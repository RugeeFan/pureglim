import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions — PureGlim",
  description: "Terms of service for PureGlim cleaning services.",
};

export default function TermsPage() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <Link href="/" style={styles.back}>← PureGlim</Link>

        <h1 style={styles.heading}>Terms &amp; Conditions</h1>
        <p style={styles.updated}>Last updated: April 2026</p>

        <section style={styles.section}>
          <h2 style={styles.subheading}>Services</h2>
          <p style={styles.body}>
            PureGlim provides residential and light commercial cleaning services
            in the agreed service area. The scope of each visit is confirmed at
            the time of booking. We reserve the right to adjust services based
            on safety, access, or conditions at the property.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>Bookings and scheduling</h2>
          <p style={styles.body}>
            Bookings are confirmed once we have agreed on a date, time, and
            service scope. We will make reasonable efforts to arrive within the
            agreed time window. In cases of unforeseen circumstances, we will
            notify you as early as possible and arrange an alternative.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>Cancellations</h2>
          <p style={styles.body}>
            We ask for at least 24 hours notice to cancel or reschedule a
            booking. Late cancellations or no-shows may incur a cancellation
            fee, which will be communicated to you at the time of booking.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>Payment</h2>
          <p style={styles.body}>
            Payment terms are agreed upon booking. We accept bank transfer and
            other methods as communicated at the time of confirmation. Invoices
            are due within the agreed payment period.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>Liability</h2>
          <p style={styles.body}>
            We take care with every visit. In the unlikely event of accidental
            damage caused by our team, please notify us within 48 hours and we
            will work with you to resolve it fairly. We are not liable for
            pre-existing damage, items of exceptional value not disclosed prior
            to the service, or damage resulting from conditions outside our
            control.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>Contact</h2>
          <p style={styles.body}>
            Questions about these terms? Reach us at{" "}
            <a href="mailto:hello@pureglim.com.au" style={styles.link}>
              hello@pureglim.com.au
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100dvh",
    background: "#091311",
    padding: "clamp(40px, 6vw, 80px) clamp(20px, 5vw, 60px)",
    fontFamily: "'Avenir Next', 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: "640px",
    margin: "0 auto",
  },
  back: {
    display: "inline-block",
    marginBottom: "48px",
    fontSize: "0.8rem",
    letterSpacing: "0.06em",
    color: "rgba(245, 251, 248, 0.40)",
    textDecoration: "none",
  },
  heading: {
    fontFamily: "var(--font-otterco, 'Avenir Next', sans-serif)",
    fontWeight: 700,
    fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
    letterSpacing: "-0.025em",
    color: "rgba(245, 251, 248, 0.92)",
    marginBottom: "8px",
  },
  updated: {
    fontSize: "0.72rem",
    letterSpacing: "0.06em",
    color: "rgba(245, 251, 248, 0.30)",
    marginBottom: "52px",
  },
  section: {
    marginBottom: "40px",
  },
  subheading: {
    fontFamily: "var(--font-otterco, 'Avenir Next', sans-serif)",
    fontWeight: 700,
    fontSize: "0.88rem",
    letterSpacing: "0.04em",
    color: "rgba(245, 251, 248, 0.72)",
    marginBottom: "12px",
  },
  body: {
    fontSize: "0.875rem",
    lineHeight: "1.75",
    color: "rgba(245, 251, 248, 0.52)",
    letterSpacing: "0.01em",
  },
  link: {
    color: "rgba(245, 251, 248, 0.65)",
    textDecoration: "underline",
    textUnderlineOffset: "3px",
  },
};
