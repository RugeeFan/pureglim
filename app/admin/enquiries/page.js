import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "../../../lib/auth/session";
import {
  getQuoteRequests,
  buildQuoteRequestReference,
  formatServiceTypeLabel,
} from "../../../lib/services/quoteRequests";
import DeleteAllButton from "./DeleteAllButton";

export const metadata = { title: "Enquiries — PureGlim Admin" };

const PAGE_SIZE = 15;

function statusLabel(status) {
  return { NEW: "New", CONTACTED: "Contacted", QUOTED: "Quoted" }[status] ?? status;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function EnquiriesPage({ searchParams }) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore);
  if (!session.valid) redirect("/admin/login");

  const page = Math.max(1, parseInt((await searchParams).page ?? "1", 10));
  const { items: enquiries, total } = await getQuoteRequests({ page, pageSize: PAGE_SIZE });
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const safePage = Math.min(page, totalPages || 1);

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-header-left">
          <h1 className="admin-page-title">Enquiries</h1>
          <span className="admin-page-count">{total} total</span>
        </div>
        <DeleteAllButton count={total} />
      </div>

      {total === 0 ? (
        <p className="admin-empty">No enquiries yet.</p>
      ) : (
        <>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Est. Price</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="admin-table-row">
                    <td>
                      <Link
                        href={`/admin/enquiries/${enq.id}`}
                        className="admin-table-link"
                      >
                        {buildQuoteRequestReference(enq.id)}
                      </Link>
                    </td>
                    <td>{formatServiceTypeLabel(enq.serviceType.toLowerCase())}</td>
                    <td>{enq.customerName}</td>
                    <td>{enq.phone}</td>
                    <td>{enq.email}</td>
                    <td>{enq.estimatedPrice != null ? `$${enq.estimatedPrice}` : "—"}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${enq.status.toLowerCase()}`}>
                        {statusLabel(enq.status)}
                      </span>
                    </td>
                    <td>{formatDate(enq.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="admin-pagination">
              <Link
                href={`/admin/enquiries?page=${safePage - 1}`}
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
                href={`/admin/enquiries?page=${safePage + 1}`}
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
