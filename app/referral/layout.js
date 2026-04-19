import "./referral.css";

export const metadata = {
  title: "Referral Dashboard — PureGlim",
  description: "Referral program dashboard for tracking your code, referred bookings, and earnings.",
};

export default function ReferralLayout({ children }) {
  return (
    <div className="referral-shell">
      <main className="referral-main">{children}</main>
    </div>
  );
}
