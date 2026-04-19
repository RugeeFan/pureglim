import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "../../../lib/auth/session";
import { getAllReferrersForAdmin } from "../../../lib/services/referrers";

export const metadata = { title: "Referrers — PureGlim Admin" };

function formatCurrency(amount) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function AdminReferrersPage() {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore);
  if (!session.valid) redirect("/admin/login");

  const referrers = await getAllReferrersForAdmin();

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-header-left">
          <h1 className="admin-page-title">Referrers</h1>
          <span className="admin-page-count">{referrers.length} total</span>
        </div>
      </div>

      {referrers.length === 0 ? (
        <p className="admin-empty">No referrers yet.</p>
      ) : (
        <>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Referral Code</th>
                  <th>Referrals</th>
                  <th>Paid commission</th>
                  <th>Account name</th>
                  <th>BSB</th>
                  <th>Account number</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {referrers.map((referrer) => {
                  const earnedCommission = referrer.referrals.reduce(
                    (sum, r) => sum + (r.commissionAmount ?? 0),
                    0,
                  );
                  const hasBankDetails = Boolean(referrer.bsb);

                  return (
                    <tr key={referrer.id} className="admin-table-row">
                      <td>{referrer.fullName || <span className="admin-muted">—</span>}</td>
                      <td>{referrer.phone}</td>
                      <td>
                        {referrer.referralCode ? (
                          <span className="admin-badge admin-badge--new">
                            {referrer.referralCode}
                          </span>
                        ) : (
                          <span className="admin-muted">Not generated</span>
                        )}
                      </td>
                      <td>{referrer._count.referrals}</td>
                      <td>{earnedCommission > 0 ? formatCurrency(earnedCommission) : "—"}</td>
                      <td>
                        {hasBankDetails ? (
                          referrer.bankAccountName
                        ) : (
                          <span className="admin-muted">Not provided</span>
                        )}
                      </td>
                      <td>
                        {hasBankDetails ? (
                          referrer.bsb
                        ) : (
                          <span className="admin-muted">—</span>
                        )}
                      </td>
                      <td>
                        {hasBankDetails ? (
                          referrer.bankAccountNumber
                        ) : (
                          <span className="admin-muted">—</span>
                        )}
                      </td>
                      <td>{formatDate(referrer.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="admin-partner-cards">
            {referrers.map((referrer) => {
              const earnedCommission = referrer.referrals.reduce(
                (sum, r) => sum + (r.commissionAmount ?? 0),
                0,
              );
              const hasBankDetails = Boolean(referrer.bsb);

              return (
                <article key={`${referrer.id}-card`} className="admin-enquiry-card">
                  <div className="admin-enquiry-card-head">
                    <div className="admin-enquiry-card-title">
                      <strong>{referrer.fullName || "Unnamed referrer"}</strong>
                      <small>{referrer.phone}</small>
                    </div>
                    {referrer.referralCode ? (
                      <span className="admin-badge admin-badge--new">{referrer.referralCode}</span>
                    ) : (
                      <span className="admin-muted">No code</span>
                    )}
                  </div>

                  <div className="admin-enquiry-card-grid">
                    <div className="admin-enquiry-card-block">
                      <span>Referrals</span>
                      <strong>{referrer._count.referrals}</strong>
                      <small>Joined {formatDate(referrer.createdAt)}</small>
                    </div>
                    <div className="admin-enquiry-card-block">
                      <span>Paid commission</span>
                      <strong>{earnedCommission > 0 ? formatCurrency(earnedCommission) : "—"}</strong>
                    </div>
                    <div className="admin-enquiry-card-block">
                      <span>Account name</span>
                      <strong>{hasBankDetails ? referrer.bankAccountName : "Not provided"}</strong>
                    </div>
                    <div className="admin-enquiry-card-block">
                      <span>Bank details</span>
                      <strong>{hasBankDetails ? referrer.bsb : "—"}</strong>
                      <small>{hasBankDetails ? referrer.bankAccountNumber : "—"}</small>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
