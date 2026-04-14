import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — PureGlim",
  description: "How PureGlim collects and uses your information.",
};

export default function PrivacyPage() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <Link href="/" style={styles.back}>← PureGlim</Link>

        <h1 style={styles.heading}>Privacy Policy</h1>
        <p style={styles.updated}>Last updated: April 2026</p>

        <section style={styles.section}>
          <h2 style={styles.subheading}>Information we collect</h2>
          <p style={styles.body}>
            When you submit a booking or enquiry through our website, we collect
            the information you provide — such as your name, contact details,
            property address, and preferred service. We do not collect this
            information unless you choose to share it with us.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>How we use your information</h2>
          <p style={styles.body}>
            We use the information you share solely to respond to your enquiry,
            confirm your booking, and communicate service-related details. We do
            not sell, rent, or share your personal information with third parties
            for marketing purposes.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>Data storage</h2>
          <p style={styles.body}>
            Enquiry and booking data is stored securely and retained only as long
            as necessary to fulfil your request and meet our operational
            obligations. You may request deletion of your data at any time by
            contacting us directly.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>Cookies and analytics</h2>
          <p style={styles.body}>
            Our website does not use tracking cookies or advertising pixels. We
            use Vercel Analytics, a privacy-preserving tool that measures page
            visits without cookies or personal data. No browsing history,
            fingerprint, or personally identifiable information is collected.
            We may also use minimal technical cookies required for the website
            to function correctly.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>Contact</h2>
          <p style={styles.body}>
            If you have any questions about this policy or how we handle your
            information, please get in touch at{" "}
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
