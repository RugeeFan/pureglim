import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "../../../lib/auth/session";
import {
  getQuoteRequests,
  buildQuoteRequestReference,
  formatServiceTypeLabel,
  formatQuoteRequestStatusLabel,
  updateQuoteRequestStatus,
  forceSetQuoteRequestStatus,
} from "../../../lib/services/quoteRequests";
import StatusNav from "./StatusNav";
import {
  BOOKING_STATUS_VALUES,
  getAllowedBookingStatusTransitions,
  formatBookingStatusLabel,
} from "../../../lib/services/bookingMeta";
import DeleteAllButton from "./DeleteAllButton";

export const metadata = { title: "Enquiries — PureGlim Admin" };

const PAGE_SIZE = 15;

function formatDate(date) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function formatCurrency(amount) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getPreviousStatus(status) {
  const idx = BOOKING_STATUS_VALUES.indexOf(status);
  return idx > 0 ? BOOKING_STATUS_VALUES[idx - 1] : null;
}

function getNextStatus(status) {
  const transitions = getAllowedBookingStatusTransitions(status);
  return transitions[0] ?? null;
}

async function updateStatusInline(formData) {
  "use server";
  const cookieStore = await cookies();
  const session = await getSession(cookieStore);
  if (!session.valid) redirect("/admin/login");

  const id = formData.get("id");
  const status = formData.get("status");
  const returnTo = formData.get("returnTo") || "/admin/enquiries";

  try {
    await updateQuoteRequestStatus(id, status);
  } catch {
    // invalid transition — redirect back silently
  }
  redirect(returnTo);
}

async function undoStatusInline(formData) {
  "use server";
  const cookieStore = await cookies();
  const session = await getSession(cookieStore);
  if (!session.valid) redirect("/admin/login");

  const id = formData.get("id");
  const status = formData.get("status");
  const returnTo = formData.get("returnTo") || "/admin/enquiries";

  try {
    await forceSetQuoteRequestStatus(id, status);
  } catch {
    // ignore
  }
  redirect(returnTo);
}

export default async function EnquiriesPage({ searchParams }) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore);
  if (!session.valid) redirect("/admin/login");

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const search = (params.q ?? "").trim();
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
                          <div className="admin-cell-stack">
                            <span>{enq.referrer?.fullName || "Referral"}</span>
                            <small>{enq.referralCode || enq.referrer?.referralCode || "—"}</small>
                          </div>
                        ) : (
                          <span className="admin-muted">—</span>
                        )}
                      </td>
                      <td>
                        <div className="admin-cell-stack">
                          <span>
                            Original{" "}
                            {enq.originalAmount != null
                              ? `$${enq.originalAmount}`
                              : enq.estimatedPrice != null
                                ? `$${enq.estimatedPrice}`
                                : "—"}
                          </span>
                          {(enq.discountAmount ?? 0) > 0 && (
                            <small>Discount -${enq.discountAmount}</small>
                          )}
                          <small>
                            Final{" "}
                            {enq.finalAmount != null
                              ? `$${enq.finalAmount}`
                              : enq.estimatedPrice != null
                                ? `$${enq.estimatedPrice}`
                                : "—"}
                          </small>
                          {enq.commissionAmount != null && (
                            <small>Commission ${enq.commissionAmount}</small>
                          )}
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

                    <div className="admin-enquiry-card-block">
                      <span>Referral</span>
                      <strong>{enq.referrer?.fullName || "No referral"}</strong>
                      <small>{enq.referralCode || "—"}</small>
                    </div>

                    <div className="admin-enquiry-card-block">
                      <span>Amounts</span>
                      <strong>
                        {formatCurrency(enq.finalAmount ?? enq.estimatedPrice)}
                      </strong>
                      <small>
                        Original {formatCurrency(enq.originalAmount ?? enq.estimatedPrice)}
                      </small>
                      <small>
                        Discount {formatCurrency(enq.discountAmount ?? 0)}
                      </small>
                      <small>
                        Commission {formatCurrency(enq.commissionAmount)}
                      </small>
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
