import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getReferrerSession } from "../../../lib/auth/referrerSession";
import { formatServiceTypeLabel } from "../../../lib/services/bookingMeta";
import { getReferrerDashboardData } from "../../../lib/services/referrers";
import { buildQuoteRequestReference } from "../../../lib/services/quoteRequests";
import BankDetailsForm from "../BankDetailsForm";
import GenerateReferralCodeButton from "../GenerateReferralCodeButton";
import ReferrerLogoutButton from "../ReferrerLogoutButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    dateStyle: "medium",
  }).format(new Date(date));
}

const statCards = [
  {
    key: "total",
    label: "Total referred",
    valueKey: "totalReferredBookings",
    helper: "All bookings linked to your code.",
    wide: true,
  },
  {
    key: "confirmed",
    label: "Confirmed",
    valueKey: "confirmedBookings",
    helper: "Bookings approved by our team.",
  },
  {
    key: "completed",
    label: "Completed",
    valueKey: "completedBookings",
    helper: "Work finished and ready for payout tracking.",
  },
  {
    key: "pending",
    label: "Pending earnings",
    valueKey: "pendingCommission",
    helper: "Completed bookings awaiting earnings payout.",
    currency: true,
  },
  {
    key: "paid",
    label: "Referral earnings paid",
    valueKey: "paidCommission",
    helper: "Earnings already transferred to your bank.",
    currency: true,
  },
];

export default async function ReferralDashboardPage() {
  noStore();

  const cookieStore = await cookies();
  const session = await getReferrerSession(cookieStore);

  if (!session.valid) {
    redirect("/referral/login");
  }

  const dashboard = await getReferrerDashboardData(session.payload.sub);
  if (!dashboard) {
    redirect("/referral/login");
  }

  const { referrer, bookings, stats } = dashboard;

  return (
    <div className="referral-dashboard">
      <div className="referral-dashboard-header">
        <div>
          <p className="referral-eyebrow">Referral Dashboard</p>
          <h1>{referrer.fullName || "PureGlim Referral"}</h1>
          <p className="referral-dashboard-subtitle">
            {referrer.phone} · Track your referral code, bookings, and earnings.
          </p>
        </div>
        <ReferrerLogoutButton />
      </div>

      <section className="referral-hero-grid">
        <article className="referral-panel referral-panel-highlight referral-code-panel">
          <span className="referral-panel-label">Your referral code</span>
          {referrer.referralCode ? (
            <>
              <strong className="referral-code-display">{referrer.referralCode}</strong>
              <p>
                Share this code with friends or customers. Eligible bookings get $20 off and
                appear here automatically.
              </p>
            </>
          ) : (
            <>
              <p>
                You haven&apos;t created your referral code yet. Generate it once and
                it stays tied to your account.
              </p>
              <GenerateReferralCodeButton />
            </>
          )}
        </article>

        <div className="referral-stats-grid">
          {statCards.map((card) => (
            <article
              key={card.key}
              className={`referral-panel referral-stat-card${card.wide ? " referral-stat-card--wide" : ""}`}
            >
              <div className="referral-stat-copy">
                <span className="referral-panel-label">{card.label}</span>
                <p>{card.helper}</p>
              </div>
              <strong className="referral-stat-value">
                {card.currency
                  ? formatCurrency(stats[card.valueKey])
                  : stats[card.valueKey]}
              </strong>
            </article>
          ))}
        </div>
      </section>

      <section className="referral-panel">
        <div className="referral-section-header">
          <div>
            <h2>Bank details</h2>
            <p>
              We use these to transfer your earnings. Your details are stored
              securely and only visible to you and PureGlim.
            </p>
          </div>
        </div>
        <BankDetailsForm
          current={
            referrer.bsb
              ? {
                  bankAccountName: referrer.bankAccountName,
                  bsb: referrer.bsb,
                  bankAccountNumber: referrer.bankAccountNumber,
                }
              : null
          }
        />
      </section>

      <section className="referral-panel">
        <div className="referral-section-header">
          <div>
            <h2>Referrals</h2>
            <p>
              Status updates come from our admin system and update in real time.
            </p>
          </div>
        </div>

        {bookings.length ? (
          <>
            <div className="referral-booking-cards">
              {bookings.map((booking) => (
                <article key={booking.id} className="referral-booking-card">
                  <div className="referral-booking-card-head">
                    <div className="referral-booking-card-title">
                      <span className="referral-booking-reference">
                        {buildQuoteRequestReference(booking.id)}
                      </span>
                      <strong>{formatServiceTypeLabel(booking.serviceType.toLowerCase())}</strong>
                    </div>
                    <span
                      className={`referral-status-badge referral-status-${booking.status
                        .toLowerCase()
                        .replaceAll("_", "-")}`}
                    >
                      {booking.statusLabel}
                    </span>
                  </div>

                  <div className="referral-booking-meta-grid">
                    <div className="referral-booking-meta-item">
                      <span>Customer</span>
                      <strong>{booking.customerName}</strong>
                      <small>{booking.email}</small>
                    </div>
                    <div className="referral-booking-meta-item">
                      <span>Referral code</span>
                      <strong>{booking.referralCode || referrer.referralCode || "—"}</strong>
                    </div>
                    <div className="referral-booking-meta-item">
                      <span>Final amount</span>
                      <strong>{formatCurrency(booking.finalAmount ?? booking.estimatedPrice)}</strong>
                      <small>Discount {formatCurrency(booking.discountAmount ?? 0)}</small>
                    </div>
                    <div className="referral-booking-meta-item">
                      <span>Earnings</span>
                      <strong>{formatCurrency(booking.commissionAmount)}</strong>
                      <small>{booking.commissionStateLabel}</small>
                    </div>
                  </div>

                  <div className="referral-booking-card-footer">
                    <span>Submitted {formatDate(booking.createdAt)}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="referral-table-wrapper">
              <table className="referral-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Service</th>
                    <th>Customer</th>
                    <th>Referral code</th>
                    <th>Final amount</th>
                    <th>Status</th>
                    <th>Earnings</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{buildQuoteRequestReference(booking.id)}</td>
                      <td>{formatServiceTypeLabel(booking.serviceType.toLowerCase())}</td>
                      <td>
                        <div className="referral-cell-stack">
                          <span>{booking.customerName}</span>
                          <small>{booking.email}</small>
                        </div>
                      </td>
                      <td>
                        {booking.referralCode || referrer.referralCode || "—"}
                      </td>
                      <td>
                        <div className="referral-cell-stack">
                          <span>{formatCurrency(booking.finalAmount ?? booking.estimatedPrice)}</span>
                          <small>Discount {formatCurrency(booking.discountAmount ?? 0)}</small>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`referral-status-badge referral-status-${booking.status
                            .toLowerCase()
                            .replaceAll("_", "-")}`}
                        >
                          {booking.statusLabel}
                        </span>
                      </td>
                      <td>
                        <div className="referral-cell-stack">
                          <span>{formatCurrency(booking.commissionAmount)}</span>
                          <small>{booking.commissionStateLabel}</small>
                        </div>
                      </td>
                      <td>{formatDate(booking.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="referral-empty-state">
            <h3>No referrals yet.</h3>
            <p>
              Once someone books using your referral code, it will appear here
              with live status updates.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
