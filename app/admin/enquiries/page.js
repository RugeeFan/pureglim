import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { getSession } from "../../../lib/auth/session";
import {
  getQuoteRequests,
  buildQuoteRequestReference,
  formatServiceTypeLabel,
  formatQuoteRequestStatusLabel,
  updateQuoteRequestStatus,
  undoQuoteRequestStatus,
  InvalidStatusUndoError,
} from "../../../lib/services/quoteRequests";
import StatusNav from "./StatusNav";
import {
  BOOKING_STATUS_VALUES,
  getAllowedBookingStatusTransitions,
  formatBookingStatusLabel,
  getBookingPricingDetails,
} from "../../../lib/services/bookingMeta";
import DeleteAllButton from "./DeleteAllButton";
import { formatCurrencyOrDash as formatCurrency } from "../../../lib/format/currency";

export const metadata = { title: "Enquiries — PureGlim Admin" };

const PAGE_SIZE = 15;

function formatDate(date) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function renderPricingRows(pricingDetails) {
  return pricingDetails.rows.map((row) => (
    <span key={row.label}>
      {row.label} {formatCurrency(row.amount)}
    </span>
  ));
}

function getPreviousStatus(status) {
  const idx = BOOKING_STATUS_VALUES.indexOf(status);
  return idx > 0 ? BOOKING_STATUS_VALUES[idx - 1] : null;
}

function getNextStatus(status) {
  const transitions = getAllowedBookingStatusTransitions(status);
  return transitions[0] ?? null;
}

const inlineStatusSchema = z.enum(BOOKING_STATUS_VALUES);

function appendError(returnTo, message) {
  const sep = returnTo.includes("?") ? "&" : "?";
  return `${returnTo}${sep}error=${encodeURIComponent(message)}`;
}

async function updateStatusInline(formData) {
  "use server";
  const cookieStore = await cookies();
  const session = await getSession(cookieStore);
  if (!session.valid) redirect("/admin/login");

  const id = formData.get("id");
  const parsed = inlineStatusSchema.safeParse(formData.get("status"));
  const returnTo = formData.get("returnTo") || "/admin/enquiries";

  if (!parsed.success) {
    redirect(appendError(returnTo, "Invalid booking status."));
  }

  try {
    await updateQuoteRequestStatus(id, parsed.data);
  } catch (error) {
    console.error("[admin/enquiries] advance failed:", error);
    const userMessage =
      error instanceof Error && error.message
        ? error.message
        : "Couldn't advance booking status.";
    redirect(appendError(returnTo, userMessage));
  }
  redirect(returnTo);
}

async function undoStatusInline(formData) {
  "use server";
  const cookieStore = await cookies();
  const session = await getSession(cookieStore);
  if (!session.valid) redirect("/admin/login");

  const id = formData.get("id");
  const parsed = inlineStatusSchema.safeParse(formData.get("status"));
  const returnTo = formData.get("returnTo") || "/admin/enquiries";

  if (!parsed.success) {
    redirect(appendError(returnTo, "Invalid booking status."));
  }

  try {
    await undoQuoteRequestStatus(id, parsed.data);
  } catch (error) {
    console.error("[admin/enquiries] undo failed:", error);
    const userMessage =
      error instanceof InvalidStatusUndoError
        ? error.message
        : "Couldn't undo booking status.";
    redirect(appendError(returnTo, userMessage));
  }
  redirect(returnTo);
}

export default async function EnquiriesPage({ searchParams }) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore);
  if (!session.valid) redirect("/admin/login");

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  // Cap server-side at 80 chars. Long search strings hit Prisma's
  // case-insensitive `contains` (sequential ILIKE on customerName / email /
  // phone / referralCode); on a large enquiry table that's a slow scan
  // attacker can trigger from any logged-in admin session. 80 chars is
  // generous for real-world searches and bounds the worst case.
  const search = (params.q ?? "").trim().slice(0, 80);
  const statusFilter = params.status ?? "";

  const { items: enquiries, total } = await getQuoteRequests({
    page,
    pageSize: PAGE_SIZE,
    search,
    status: statusFilter,
  });
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const safePage = Math.min(page, totalPages || 1);

  function pageUrl(p) {
    const qs = new URLSearchParams();
    if (p > 1) qs.set("page", String(p));
    if (search) qs.set("q", search);
    if (statusFilter) qs.set("status", statusFilter);
    return `/admin/enquiries${qs.size ? `?${qs}` : ""}`;
  }

  const returnTo = pageUrl(safePage);

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-header-left">
          <h1 className="admin-page-title">Enquiries</h1>
          <span className="admin-page-count">{total} total</span>
        </div>
        <DeleteAllButton count={total} />
      </div>

      {params?.error ? (
        <div className="admin-inline-notice admin-inline-notice--error">
          {params.error}
        </div>
      ) : null}

      {/* Search + filter bar */}
      <div className="admin-search-shell">
        <form method="GET" action="/admin/enquiries" className="admin-search-form">
          <input
            type="text"
            name="q"
            defaultValue={search}
            placeholder="Search by name, email or phone…"
            className="admin-search-input"
            autoComplete="off"
          />
          <select name="status" defaultValue={statusFilter} className="admin-status-filter-select">
            <option value="">All statuses</option>
            {BOOKING_STATUS_VALUES.map((s) => (
              <option key={s} value={s}>{formatBookingStatusLabel(s)}</option>
            ))}
          </select>
          <button type="submit" className="admin-search-btn">Search</button>
          {(search || statusFilter) && (
            <a href="/admin/enquiries" className="admin-search-clear">Clear</a>
          )}
        </form>
      </div>

      {total === 0 ? (
        <p className="admin-empty">
          {search || statusFilter ? "No results for the current filters." : "No enquiries yet."}
        </p>
      ) : (
        <>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Referral</th>
                  <th>Amounts</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enq) => {
                  const nextStatus = getNextStatus(enq.status);
                  const prevStatus = getPreviousStatus(enq.status);
                  const statusSlug = enq.status.toLowerCase().replaceAll("_", "-");
                  const pricingDetails = getBookingPricingDetails(enq);

                  return (
                    <tr key={enq.id} className="admin-table-row">
                      <td>
                        <Link
                          href={`/admin/enquiries/${enq.id}`}
                          className="admin-table-link"
                        >
                          {buildQuoteRequestReference(enq.id)}
                        </Link>
                      </td>
                      <td>
                        <div className="admin-cell-stack">
                          <span>{enq.customerName}</span>
                          <small>{enq.phone}</small>
                          <small>{enq.email}</small>
                        </div>
                      </td>
                      <td>
                        <div className="admin-cell-stack">
                          <span>{formatServiceTypeLabel(enq.serviceType.toLowerCase())}</span>
                          {enq.address ? <small>{enq.address}</small> : null}
                        </div>
                      </td>
                      <td>
                        {enq.referrerId ? (
                          <div className="admin-referral-cell">
                            <span className="admin-referral-pill admin-referral-pill--linked">
                              Referral linked
                            </span>
                            <div className="admin-cell-stack">
                              <span>{enq.referrer?.fullName || "Referral"}</span>
                              <small>{enq.referralCode || enq.referrer?.referralCode || "—"}</small>
                            </div>
                          </div>
                        ) : (
                          <div className="admin-referral-cell">
                            <span className="admin-referral-pill admin-referral-pill--organic">
                              Direct booking
                            </span>
                            <span className="admin-muted">No referral source</span>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="admin-amount-card">
                          <div className="admin-amount-card-main">
                            <span>{pricingDetails.headlineLabel}</span>
                            <strong>{formatCurrency(pricingDetails.headlineAmount)}</strong>
                          </div>
                          <div className="admin-amount-card-grid">
                            {renderPricingRows(pricingDetails)}
                            <span>
                              Commission {formatCurrency(enq.commissionAmount)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status cell — badge + prev/next buttons */}
                      <td style={{ position: "relative", zIndex: 1 }}>
                        <div className="admin-status-cell">
                          <span className={`admin-badge admin-badge--${statusSlug}`}>
                            {formatQuoteRequestStatusLabel(enq.status)}
                          </span>
                          <StatusNav
                            id={enq.id}
                            nextStatus={nextStatus}
                            prevStatus={prevStatus}
                            nextLabel={nextStatus ? formatBookingStatusLabel(nextStatus) : null}
                            prevLabel={prevStatus ? formatBookingStatusLabel(prevStatus) : null}
                            returnTo={returnTo}
                            advanceAction={updateStatusInline}
                            undoAction={undoStatusInline}
                          />
                        </div>
                      </td>

                      <td>{formatDate(enq.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="admin-enquiry-cards">
            {enquiries.map((enq) => {
              const nextStatus = getNextStatus(enq.status);
              const prevStatus = getPreviousStatus(enq.status);
              const statusSlug = enq.status.toLowerCase().replaceAll("_", "-");
              const pricingDetails = getBookingPricingDetails(enq);

              return (
                <article key={`${enq.id}-card`} className="admin-enquiry-card">
                  <div className="admin-enquiry-card-head">
                    <div className="admin-enquiry-card-title">
                      <Link
                        href={`/admin/enquiries/${enq.id}`}
                        className="admin-table-link admin-enquiry-card-ref"
                      >
                        {buildQuoteRequestReference(enq.id)}
                      </Link>
                      <strong>{formatServiceTypeLabel(enq.serviceType.toLowerCase())}</strong>
                      <small>{formatDate(enq.createdAt)}</small>
                    </div>
                    <span className={`admin-badge admin-badge--${statusSlug}`}>
                      {formatQuoteRequestStatusLabel(enq.status)}
                    </span>
                  </div>

                  <div className="admin-enquiry-card-grid">
                    <div className="admin-enquiry-card-block">
                      <span>Customer</span>
                      <strong>{enq.customerName}</strong>
                      <small>{enq.phone}</small>
                      <small>{enq.email}</small>
                    </div>

                    <div className="admin-enquiry-card-block admin-enquiry-card-block--referral">
                      <div className="admin-enquiry-card-block-head">
                        <span>Referral source</span>
                        <em className={enq.referrerId ? "is-linked" : "is-organic"}>
                          {enq.referrerId ? "Linked" : "Direct"}
                        </em>
                      </div>
                      <strong>{enq.referrer?.fullName || "No referral"}</strong>
                      <small>{enq.referralCode || "—"}</small>
                    </div>

                    <div className="admin-enquiry-card-block admin-enquiry-card-block--finance">
                      <span>Amounts</span>
                      <strong>
                        {formatCurrency(pricingDetails.headlineAmount)}
                      </strong>
                      <div className="admin-finance-inline">
                        <small>{pricingDetails.headlineLabel}</small>
                        {pricingDetails.comparisonAmount != null ? (
                          <small>
                            {pricingDetails.comparisonLabel} {formatCurrency(pricingDetails.comparisonAmount)}
                          </small>
                        ) : null}
                        {pricingDetails.rows.map((row) => (
                          <small key={row.label}>
                            {row.label} {formatCurrency(row.amount)}
                          </small>
                        ))}
                        <small>
                          Commission {formatCurrency(enq.commissionAmount)}
                        </small>
                      </div>
                    </div>

                    <div className="admin-enquiry-card-block">
                      <span>Address</span>
                      <strong>{enq.address || "—"}</strong>
                    </div>
                  </div>

                  <div className="admin-enquiry-card-actions">
                    <StatusNav
                      id={enq.id}
                      nextStatus={nextStatus}
                      prevStatus={prevStatus}
                      nextLabel={nextStatus ? formatBookingStatusLabel(nextStatus) : null}
                      prevLabel={prevStatus ? formatBookingStatusLabel(prevStatus) : null}
                      returnTo={returnTo}
                      advanceAction={updateStatusInline}
                      undoAction={undoStatusInline}
                    />
                    <Link href={`/admin/enquiries/${enq.id}`} className="admin-enquiry-open">
                      Open enquiry
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="admin-pagination">
              <Link
                href={pageUrl(safePage - 1)}
                className={`admin-pagination-btn${safePage <= 1 ? " disabled" : ""}`}
                aria-disabled={safePage <= 1}
                tabIndex={safePage <= 1 ? -1 : 0}
              >
                ← Prev
              </Link>
              <span className="admin-pagination-info">
                Page {safePage} of {totalPages}
              </span>
              <Link
                href={pageUrl(safePage + 1)}
                className={`admin-pagination-btn${safePage >= totalPages ? " disabled" : ""}`}
                aria-disabled={safePage >= totalPages}
                tabIndex={safePage >= totalPages ? -1 : 0}
              >
                Next →
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
