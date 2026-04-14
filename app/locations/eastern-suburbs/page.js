import Link from "next/link";

export const metadata = {
  title: "House Cleaning — Eastern Suburbs Sydney",
  description:
    "Professional home and end of lease cleaning in Bondi, Double Bay, Paddington, Vaucluse, Coogee, Woollahra and surrounding Eastern Suburbs. Regular from $150, bond clean from $340.",
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "House Cleaning — Eastern Suburbs Sydney",
  provider: { "@id": "https://pureglim.com.au/#business" },
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: -33.8915,
      longitude: 151.2767,
    },
    geoRadius: "10000",
  },
  serviceType: ["Residential Cleaning", "End of Lease Cleaning", "Bond Cleaning"],
  offers: {
    "@type": "Offer",
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice: "120",
      priceCurrency: "AUD",
    },
  },
  url: "https://pureglim.com.au/locations/eastern-suburbs",
};

export default function EasternSuburbsPage() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <Link href="/" style={styles.back}>← PureGlim</Link>

        <p style={styles.eyebrow}>Sydney Eastern Suburbs</p>
        <h1 style={styles.heading}>House & Apartment Cleaning —{" "}Sydney's Eastern Suburbs</h1>

        <p style={styles.intro}>
          The Eastern Suburbs has some of Sydney's most sought-after apartments, terraces, and
          family homes — and one of its highest concentrations of renters. Whether you're after
          reliable fortnightly upkeep in a Bondi apartment, or a thorough end of lease clean
          before a Randwick inspection, we take care of it without fuss.
        </p>

        <section style={styles.section}>
          <h2 style={styles.subheading}>Areas we cover</h2>
          <p style={styles.body}>
            We clean regularly across Bondi, Bondi Junction, Bronte, Coogee, Tamarama, Double Bay,
            Rose Bay, Vaucluse, Bellevue Hill, Woollahra, Paddington, Darlinghurst, Randwick,
            Clovelly, and the surrounding Eastern Suburbs. Not sure if we cover your street?{" "}
            <a href="tel:+61449963099" style={styles.link}>Give us a call</a> or send a message.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>Regular home cleaning — from $150</h2>
          <p style={styles.body}>
            Our regular cleaning service covers everything that needs to stay on top of: kitchen
            surfaces and sink, bathroom wipe-down, vacuuming, mopping, dusting, and general
            tidying. Weekly cleans suit busy households and families; fortnightly is the most
            popular option. Monthly works well as a supplement to your own routine.
          </p>
          <p style={styles.body}>
            Fortnightly cleans start at $150 for a 1-bedroom home. Weekly bookings receive a 10%
            discount. One-off cleans are also available, priced slightly higher than recurring visits.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>End of lease cleaning for Eastern Suburbs rentals — from $340</h2>
          <p style={styles.body}>
            With so many rental properties in the Eastern Suburbs, bond cleaning is one of the
            most common reasons people contact us. We clean to inspection standard — inside
            cupboards, skirting boards, appliance exteriors, bathroom mould treatment, and all the
            corners that regular cleaning skips. Add-ons include carpet cleaning ($70), oven ($65),
            fridge ($35), interior windows ($45), and more.
          </p>
          <p style={styles.body}>
            If anything within our scope is raised at the inspection, we come back and sort it at
            no charge.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>Get an instant estimate</h2>
          <p style={styles.body}>
            Select your home size and service on our website and get a price immediately — no
            phone call needed to get a number.
          </p>
          <div style={styles.ctas}>
            <Link href="/" style={styles.ctaPrimary}>Get a quote</Link>
            <a href="tel:+61449963099" style={styles.ctaSecondary}>+61 449 963 099</a>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>Have questions?</h2>
          <p style={styles.body}>
            Check our <Link href="/faq" style={styles.link}>cleaning FAQ</Link> for answers on
            pricing, what's included, end of lease process, and more. Or{" "}
            <a href="mailto:pureglimsydney@gmail.com" style={styles.link}>email us directly</a>.
          </p>
          <p style={{ ...styles.body, marginTop: "12px" }}>
            We also serve{" "}
            <Link href="/locations/northern-suburbs" style={styles.link}>
              Sydney's Northern Suburbs
            </Link>
            .
          </p>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
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
  eyebrow: {
    fontSize: "0.72rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "rgba(245, 251, 248, 0.35)",
    marginBottom: "12px",
  },
  heading: {
    fontFamily: "var(--font-otterco, 'Avenir Next', sans-serif)",
    fontWeight: 700,
    fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
    letterSpacing: "-0.025em",
    color: "rgba(245, 251, 248, 0.92)",
    marginBottom: "24px",
    lineHeight: 1.2,
  },
  intro: {
    fontSize: "0.95rem",
    lineHeight: "1.8",
    color: "rgba(245, 251, 248, 0.65)",
    letterSpacing: "0.01em",
    marginBottom: "48px",
  },
  section: {
    marginBottom: "44px",
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
    marginBottom: "12px",
  },
  link: {
    color: "rgba(245, 251, 248, 0.65)",
    textDecoration: "underline",
    textUnderlineOffset: "3px",
  },
  ctas: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    marginTop: "20px",
  },
  ctaPrimary: {
    display: "inline-block",
    padding: "11px 22px",
    background: "rgba(245, 251, 248, 0.92)",
    color: "#091311",
    borderRadius: "6px",
    fontSize: "0.82rem",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textDecoration: "none",
    fontFamily: "var(--font-otterco, 'Avenir Next', sans-serif)",
  },
  ctaSecondary: {
    display: "inline-block",
    padding: "11px 22px",
    border: "1px solid rgba(245, 251, 248, 0.18)",
    color: "rgba(245, 251, 248, 0.65)",
    borderRadius: "6px",
    fontSize: "0.82rem",
    letterSpacing: "0.04em",
    textDecoration: "none",
  },
};
