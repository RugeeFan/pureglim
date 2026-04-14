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
} from "../../../../lib/services/quoteRequests";
import DeleteButton from "./DeleteButton";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: `Enquiry ${buildQuoteRequestReference(id)} — PureGlim Admin` };
}

// ── Server Actions ────────────────────────────────────────────────────────────
const statusSchema = z.enum(["NEW", "CONTACTED", "QUOTED"]);

async function updateStatus(formData) {
  "use server";
  const cookieStore = await cookies();
  const session = await getSession(cookieStore);
  if (!session.valid) redirect("/admin/login");

  const id = formData.get("id");
  const parsed = statusSchema.safeParse(formData.get("status"));
  if (!parsed.success) redirect(`/admin/enquiries/${id}`);

  try {
    await updateQuoteRequestStatus(id, parsed.data);
  } catch {
    redirect("/admin/enquiries");
  }

  redirect(`/admin/enquiries/${id}`);
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

function statusLabel(status) {
  return { NEW: "New", CONTACTED: "Contacted", QUOTED: "Quoted" }[status] ?? status;
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function EnquiryDetailPage({ params }) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore);
  if (!session.valid) redirect("/admin/login");

  const { id } = await params;
  const enquiry = await getQuoteRequestById(id);
  if (!enquiry) notFound();

  const ref = buildQuoteRequestReference(enquiry.id);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <a href="/admin/enquiries" className="admin-back-link">
            ← Enquiries
          </a>
          <h1 className="admin-page-title">{ref}</h1>
        </div>
        <span className={`admin-badge admin-badge--${enquiry.status.toLowerCase()}`}>
          {statusLabel(enquiry.status)}
        </span>
      </div>

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

      <section className="admin-detail-section">
        <dl className="admin-detail-list admin-detail-list--inline">
          <Field label="Submitted" value={formatDate(enquiry.createdAt)} />
          <Field label="Last Updated" value={formatDate(enquiry.updatedAt)} />
        </dl>
      </section>

      <section className="admin-detail-section">
        <h2 className="admin-detail-section-title">Update Status</h2>
        <form className="admin-status-form" action={updateStatus}>
          <input type="hidden" name="id" value={enquiry.id} />
          <select
            name="status"
            defaultValue={enquiry.status}
            className="admin-form-select"
          >
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUOTED">Quoted</option>
          </select>
          <button type="submit" className="admin-submit-btn admin-submit-btn--sm">
            Save Status
          </button>
        </form>
      </section>

      <section className="admin-detail-section admin-detail-section--danger">
        <h2 className="admin-detail-section-title">Danger Zone</h2>
        <DeleteButton formAction={deleteEnquiry} enquiryId={enquiry.id} />
      </section>
    </div>
  );
}
