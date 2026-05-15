import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getReferrerSession } from "../../../lib/auth/referrerSession";
import {
  formatServiceTypeLabel,
  getBookingPricingDetails,
} from "../../../lib/services/bookingMeta";
import { getReferrerDashboardData } from "../../../lib/services/referrers";
import { buildQuoteRequestReference } from "../../../lib/services/quoteRequests";
import BankDetailsForm from "../BankDetailsForm";
import GenerateReferralCodeButton from "../GenerateReferralCodeButton";
import ReferrerLogoutButton from "../ReferrerLogoutButton";
import ReferralShareCard from "../ReferralShareCard";
import { formatCurrencyOrDash as formatCurrency } from "../../../lib/format/currency";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STATUS_DESCRIPTIONS = {
  NEW: "Booking request received, awaiting confirmation",
  CONFIRMED: "Booking confirmed — your commission is locked in",
  COMPLETE: "Cleaning completed — commission pending payment",
  COMMISSION_PAID: "Commission transferred to your account",
};

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

      {(() => {
        const onboardingState =
          !referrer.referralCode ? "no-code" :
          stats.pendingCommission > 0 ? "has-earnings" :
          "has-code";

        if (onboardingState === "has-earnings") {
          return (
            <div className="referral-onboarding-banner referral-onboarding-banner--earnings">
              <strong>You have pending earnings!</strong>
              {" "}Add your payment details below to receive your commission payout.{" "}
              <a href="#bank-details">Add payment details →</a>
            </div>
          );
        }

        if (onboardingState === "has-code") {
          return (
            <div className="referral-onboarding-banner">
              Add payment info to receive commissions when you earn them.{" "}
              <a href="#bank-details">Set up payment details →</a>
            </div>
          );
        }

        return null;
      })()}

      <section className="referral-hero-grid">
        <article className="referral-panel referral-panel-highlight referral-code-panel">
          <span className="referral-panel-label">Share your referral</span>
          {referrer.referralCode ? (
            <ReferralShareCard referralCode={referrer.referralCode} />
          ) : (
            <div className="referral-onboarding-step">
              <p className="referral-onboarding-step-label">Step 1: Get your referral code</p>
              <p>
                Your unique code gives every new customer $20 off their first regular clean.
                When they complete a booking, you earn commission.
              </p>
              <GenerateReferralCodeButton />
            </div>
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
          <p className="referral-commission-explainer">
            Commission is paid after the referred customer completes their first
            clean. Your friend receives $20 off their first booking.
          </p>
        </div>
      </section>

      <section className="referral-panel" id="bank-details">
        <div className="referral-section-header">
          <div>
            <h2>Payment details</h2>
            <p>
              We use these to transfer your earnings. Your details are stored
              securely and only visible to you and PureGlim.
            </p>
          </div>
        </div>
        <BankDetailsForm
          current={
            referrer.bsb || referrer.payId
              ? {
                  bankAccountName: referrer.bankAccountName,
                  bsb: referrer.bsb,
                  bankAccountNumber: referrer.bankAccountNumber,
                  payId: referrer.payId,
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
                (() => {
                  const pricingDetails = getBookingPricingDetails(booking);

                  return (
                    <article key={booking.id} className="referral-booking-card">
                      <div className="referral-booking-card-head">
                        <div className="referral-booking-card-title">
                          <span className="referral-booking-reference">
                            {buildQuoteRequestReference(booking.id)}
                          </span>
                          <strong>
                            {formatServiceTypeLabel(booking.serviceType.toLowerCase())}
                            {booking.hourlyHours ? ` · ${booking.hourlyHours} hrs` : ""}
                          </strong>
                        </div>
                        <span
                          className={`referral-status-badge referral-status-${booking.status
                            .toLowerCase()
                            .replaceAll("_", "-")}`}
                          title={STATUS_DESCRIPTIONS[booking.status]}
                        >
                          {booking.statusLabel}
                        </span>
                      </div>

                      <div className="referral-booking-amount-strip">
                        <div className="referral-booking-amount-card">
                          <span>{pricingDetails.headlineLabel}</span>
                          <strong>{formatCurrency(pricingDetails.headlineAmount)}</strong>
                          {pricingDetails.comparisonAmount != null ? (
                            <small>
                              {pricingDetails.comparisonLabel} {formatCurrency(pricingDetails.comparisonAmount)}
                            </small>
                          ) : null}
                        </div>
                        <div className="referral-booking-amount-card referral-booking-amount-card--earnings">
                          <span>Your earnings</span>
                          <strong>{formatCurrency(booking.commissionAmount)}</strong>
                          <small>{booking.commissionStateLabel}</small>
                        </div>
                      </div>

                      <div className="referral-booking-meta-grid">
                        <div className="referral-booking-meta-item">
                          <span>Customer</span>
                          <strong>{booking.customerDisplayName}</strong>
                        </div>
                        <div className="referral-booking-meta-item">
                          <span>Referral code</span>
                          <strong>{booking.referralCode || referrer.referralCode || "—"}</strong>
                        </div>
                        <div className="referral-booking-meta-item">
                          <span>Submitted</span>
                          <strong>{formatDate(booking.createdAt)}</strong>
                          <small>Reference {buildQuoteRequestReference(booking.id)}</small>
                        </div>
                        <div className="referral-booking-meta-item">
                          <span>Commission state</span>
                          <strong>{booking.commissionStateLabel}</strong>
                          <small>Status {booking.statusLabel}</small>
                        </div>
                      </div>

                      <div className="referral-booking-card-footer">
                        <span>Linked and tracked from the live admin booking status.</span>
                      </div>
                    </article>
                  );
                })()
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
                    <th>Pricing</th>
                    <th>Status</th>
                    <th>Earnings</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    (() => {
                      const pricingDetails = getBookingPricingDetails(booking);

                      return (
                        <tr key={booking.id}>
                          <td>{buildQuoteRequestReference(booking.id)}</td>
                          <td>
                            {formatServiceTypeLabel(booking.serviceType.toLowerCase())}
                            {booking.hourlyHours ? ` · ${booking.hourlyHours} hrs` : ""}
                          </td>
                          <td>
                            <div className="referral-cell-stack">
                              <span>{booking.customerDisplayName}</span>
                            </div>
                          </td>
                          <td>
                            {booking.referralCode || referrer.referralCode || "—"}
                          </td>
                          <td>
                            <div className="referral-cell-stack">
                              <span>{formatCurrency(pricingDetails.headlineAmount)}</span>
                              <small>{pricingDetails.headlineLabel}</small>
                              {pricingDetails.comparisonAmount != null ? (
                                <small>
                                  {pricingDetails.comparisonLabel} {formatCurrency(pricingDetails.comparisonAmount)}
                                </small>
                              ) : null}
                            </div>
                          </td>
                          <td>
                            <span
                              className={`referral-status-badge referral-status-${booking.status
                                .toLowerCase()
                                .replaceAll("_", "-")}`}
                              title={STATUS_DESCRIPTIONS[booking.status]}
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
                      );
                    })()
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
