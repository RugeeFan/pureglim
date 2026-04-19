import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { getSession } from "../../../../lib/auth/session";
import {
  getQuoteRequestById,
  updateQuoteRequestStatus,
  deleteQuoteRequest,
  buildQuoteRequestReference,
  formatServiceTypeLabel,
  formatQuoteRequestStatusLabel,
  getQuoteRequestCommissionStateLabel,
} from "../../../../lib/services/quoteRequests";
import {
  BOOKING_STATUS_VALUES,
  formatBookingStatusLabel,
  getAllowedBookingStatusTransitions,
  getBookingStatusDescription,
} from "../../../../lib/services/bookingMeta";
import DeleteButton from "./DeleteButton";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `Enquiry ${buildQuoteRequestReference(id)} — PureGlim Admin` };
}

// ── Server Actions ────────────────────────────────────────────────────────────
const statusSchema = z.enum(BOOKING_STATUS_VALUES);

function buildEnquiryDetailPath(id, state = {}) {
  const params = new URLSearchParams();
  Object.entries(state).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  return params.size ? `/admin/enquiries/${id}?${params.toString()}` : `/admin/enquiries/${id}`;
}

async function updateStatus(formData) {
  "use server";
  const cookieStore = await cookies();
  const session = await getSession(cookieStore);
  if (!session.valid) redirect("/admin/login");

  const id = formData.get("id");
  const parsed = statusSchema.safeParse(formData.get("status"));
  if (!parsed.success) {
    redirect(buildEnquiryDetailPath(id, { error: "Please choose a valid booking status." }));
  }

  try {
    await updateQuoteRequestStatus(id, parsed.data);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "We couldn't update the booking status.";
    redirect(buildEnquiryDetailPath(id, { error: message }));
  }

  redirect(buildEnquiryDetailPath(id, { updated: "1" }));
}

async function deleteEnquiry(formData) {
  "use server";
  const cookieStore = await cookies();
  const session = await getSession(cookieStore);
  if (!session.valid) redirect("/admin/login");

  const id = formData.get("id");
  try {
    await deleteQuoteRequest(id);
  } catch {
    // record already gone or DB error — go back to list either way
  }
  redirect("/admin/enquiries");
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function Field({ label, value }) {
  if (value == null || value === "") return null;
  return (
    <div className="admin-detail-field">
      <dt className="admin-detail-label">{label}</dt>
      <dd className="admin-detail-value">{value}</dd>
    </div>
  );
}

function formatAddOns(addOns) {
  if (!Array.isArray(addOns) || !addOns.length) return null;
  return addOns.map((a) => `${a.label} (+$${a.price})`).join(", ");
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(date));
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function EnquiryDetailPage({ params, searchParams }) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore);
  if (!session.valid) redirect("/admin/login");

  const { id } = await params;
  const query = await searchParams;
  const enquiry = await getQuoteRequestById(id);
  if (!enquiry) notFound();

  const ref = buildQuoteRequestReference(enquiry.id);
  const allowedStatusSet = new Set([
    enquiry.status,
    ...getAllowedBookingStatusTransitions(enquiry.status),
  ]);
  const statusOptions = BOOKING_STATUS_VALUES.filter((status) =>
    allowedStatusSet.has(status),
  );
  const statusMessage =
    query?.updated === "1"
      ? "Booking status updated."
      : query?.error || "";
  const commissionStateLabel = getQuoteRequestCommissionStateLabel(enquiry);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <a href="/admin/enquiries" className="admin-back-link">
            ← Enquiries
          </a>
          <h1 className="admin-page-title">{ref}</h1>
        </div>
        <span
          className={`admin-badge admin-badge--${enquiry.status
            .toLowerCase()
            .replaceAll("_", "-")}`}
        >
          {formatQuoteRequestStatusLabel(enquiry.status)}
        </span>
      </div>

      {statusMessage ? (
        <div
          className={`admin-inline-notice${query?.error ? " admin-inline-notice--error" : ""}`}
        >
          {statusMessage}
        </div>
      ) : null}

      <section className="admin-detail-overview">
        <article className="admin-detail-overview-card">
          <span className="admin-detail-overview-label">Service</span>
          <strong className="admin-detail-overview-value">
            {formatServiceTypeLabel(enquiry.serviceType.toLowerCase())}
          </strong>
          <small>{formatDate(enquiry.createdAt)}</small>
        </article>
        <article className="admin-detail-overview-card">
          <span className="admin-detail-overview-label">Final amount</span>
          <strong className="admin-detail-overview-value">
            {enquiry.finalAmount != null ? `$${enquiry.finalAmount}` : "—"}
          </strong>
          <small>
            Original {enquiry.originalAmount != null ? `$${enquiry.originalAmount}` : "—"}
          </small>
        </article>
        <article className="admin-detail-overview-card">
          <span className="admin-detail-overview-label">Referral</span>
          <strong className="admin-detail-overview-value">
            {enquiry.referrer?.fullName || "Direct booking"}
          </strong>
          <small>{enquiry.referralCode || "No referral code used"}</small>
        </article>
        <article className="admin-detail-overview-card">
          <span className="admin-detail-overview-label">Commission</span>
          <strong className="admin-detail-overview-value">
            {enquiry.commissionAmount != null ? `$${enquiry.commissionAmount}` : "—"}
          </strong>
          <small>{commissionStateLabel}</small>
        </article>
      </section>

      <div className="admin-detail-grid">
        <section className="admin-detail-section">
          <h2 className="admin-detail-section-title">Customer</h2>
          <dl className="admin-detail-list">
            <Field label="Name" value={enquiry.customerName} />
            <Field label="Email" value={enquiry.email} />
            <Field label="Phone" value={enquiry.phone} />
            <Field label="Address" value={enquiry.address} />
            <Field label="Company" value={enquiry.companyName} />
          </dl>
        </section>

        <section className="admin-detail-section">
          <h2 className="admin-detail-section-title">Service</h2>
          <dl className="admin-detail-list">
            <Field
              label="Service Type"
              value={formatServiceTypeLabel(enquiry.serviceType.toLowerCase())}
            />
            <Field label="Bedrooms" value={enquiry.bedrooms} />
            <Field label="Bathrooms" value={enquiry.bathrooms} />
            <Field label="Frequency" value={enquiry.frequency} />
            <Field label="Site Type" value={enquiry.siteType} />
            <Field label="Site Schedule" value={enquiry.siteSchedule} />
            <Field label="Add-ons" value={formatAddOns(enquiry.addOns)} />
            <Field
              label="Estimated Price"
              value={enquiry.estimatedPrice != null ? `$${enquiry.estimatedPrice}` : null}
            />
            <Field label="Preferred Date" value={enquiry.preferredDate} />
            <Field label="Preferred Time" value={enquiry.preferredTime} />
            <Field label="Notes" value={enquiry.notes} />
          </dl>
        </section>
      </div>

      <div className="admin-detail-grid">
        <section className="admin-detail-section">
          <h2 className="admin-detail-section-title">Pricing</h2>
          <dl className="admin-detail-list">
            <Field
              label="Original Amount"
              value={enquiry.originalAmount != null ? `$${enquiry.originalAmount}` : null}
            />
            <Field
              label="Discount Amount"
              value={enquiry.discountAmount != null ? `$${enquiry.discountAmount}` : null}
            />
            <Field
              label="Final Amount"
              value={enquiry.finalAmount != null ? `$${enquiry.finalAmount}` : null}
            />
            <Field
              label="Commission Base"
              value={
                enquiry.commissionBaseAmount != null
                  ? `$${enquiry.commissionBaseAmount}`
                  : null
              }
            />
            <Field
              label="Commission Amount"
              value={enquiry.commissionAmount != null ? `$${enquiry.commissionAmount}` : null}
            />
            <Field label="Commission State" value={commissionStateLabel} />
          </dl>
        </section>

        <section className="admin-detail-section">
          <h2 className="admin-detail-section-title">Referral</h2>
          <dl className="admin-detail-list">
            <Field label="Referred by" value={enquiry.referrer?.fullName} />
            <Field label="Referrer phone" value={enquiry.referrer?.phone} />
            <Field label="Referral Code" value={enquiry.referralCode} />
          </dl>
        </section>
      </div>

      <section className="admin-detail-section">
        <dl className="admin-detail-list admin-detail-list--inline">
          <Field label="Submitted" value={formatDate(enquiry.createdAt)} />
          <Field label="Last Updated" value={formatDate(enquiry.updatedAt)} />
        </dl>
      </section>

      <section className="admin-detail-section">
        <h2 className="admin-detail-section-title">Update Status</h2>
        <p className="admin-detail-note">{getBookingStatusDescription(enquiry.status)}</p>
        <form className="admin-status-form" action={updateStatus}>
          <input type="hidden" name="id" value={enquiry.id} />
          <select
            name="status"
            defaultValue={enquiry.status}
            className="admin-form-select"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {formatBookingStatusLabel(status)}
              </option>
            ))}
          </select>
          <button type="submit" className="admin-submit-btn admin-submit-btn--sm">
            Save Status
          </button>
        </form>
        <p className="admin-detail-note admin-detail-note--muted">
          Allowed flow: New → Confirmed → Complete → Commission paid.
        </p>
      </section>

      <section className="admin-detail-section admin-detail-section--danger">
        <h2 className="admin-detail-section-title">Danger Zone</h2>
        <DeleteButton formAction={deleteEnquiry} enquiryId={enquiry.id} />
      </section>
    </div>
  );
}
