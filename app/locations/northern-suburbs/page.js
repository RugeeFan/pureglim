import Link from "next/link";

export const metadata = {
  title: "House Cleaning — Northern Suburbs Sydney",
  description:
    "Reliable home and office cleaning in Mosman, Neutral Bay, Cremorne, North Sydney, Chatswood, Lane Cove and surrounding Northern Suburbs. Regular from $150, bond clean from $340.",
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "House & Office Cleaning — Northern Suburbs Sydney",
  provider: { "@id": "https://pureglim.com.au/#business" },
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: -33.8269,
      longitude: 151.2069,
    },
    geoRadius: "12000",
  },
  serviceType: ["Residential Cleaning", "End of Lease Cleaning", "Commercial Cleaning", "Office Cleaning"],
  offers: {
    "@type": "Offer",
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice: "120",
      priceCurrency: "AUD",
    },
  },
  url: "https://pureglim.com.au/locations/northern-suburbs",
};

export default function NorthernSuburbsPage() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <Link href="/" style={styles.back}>← PureGlim</Link>

        <p style={styles.eyebrow}>Sydney Northern Suburbs</p>
        <h1 style={styles.heading}>House & Office Cleaning —{" "}Sydney's Northern Suburbs</h1>

        <p style={styles.intro}>
          From the prestige harbourside homes of Mosman and Neutral Bay to the offices and
          studios of North Sydney and Chatswood, the Northern Suburbs spans a wide mix of
          residential and commercial needs. We work across all of it — homes, apartments,
          and workspaces — scheduled around how you actually live and work.
        </p>

        <section style={styles.section}>
          <h2 style={styles.subheading}>Areas we cover</h2>
          <p style={styles.body}>
            We service Mosman, Neutral Bay, Cremorne, Kirribilli, McMahons Point, North Sydney,
            Crows Nest, St Leonards, Chatswood, Lane Cove, Willoughby, Northbridge, and surrounding
            North Shore suburbs. Not sure if we cover your area?{" "}
            <a href="tel:+61449963099" style={styles.link}>Call or message us</a>.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>Regular home cleaning — from $150</h2>
          <p style={styles.body}>
            Whether it's a compact Neutral Bay apartment or a larger family home in Lane Cove or
            Willoughby, our regular cleaning covers everything: kitchen surfaces, bathrooms,
            vacuuming, mopping, dusting, and general tidying throughout. We work to a consistent
            standard on every visit so there's nothing to manage between cleans.
          </p>
          <p style={styles.body}>
            Fortnightly is the most popular frequency. Weekly suits busier households, and comes
            with a 10% discount over the standard rate.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>End of lease cleaning for North Shore rentals — from $340</h2>
          <p style={styles.body}>
            High-density apartments in Neutral Bay, Cremorne, and Kirribilli mean a steady flow
            of tenancy turnovers. Our end of lease service covers inside cupboards, skirting boards,
            appliance exteriors, bathroom mould treatment, tracks, corners, and all the detail work
            that matters at inspection. Optional add-ons for carpets ($70), oven ($65), fridge ($35),
            and interior windows ($45).
          </p>
          <p style={styles.body}>
            If anything within our scope is raised at inspection, we return and fix it at no charge.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>Office & commercial cleaning — North Sydney and Chatswood</h2>
          <p style={styles.body}>
            North Sydney and Chatswood are two of Sydney's largest commercial precincts outside
            the CBD. We provide regular office and workplace cleaning for smaller businesses,
            studios, retail spaces, and shared workplaces across both areas. Plans are built around
            your hours — before open, after close, or during low-traffic windows — with no template
            scope forced on a space it doesn't suit.
          </p>
          <p style={styles.body}>
            Commercial enquiries are handled individually. Contact us to arrange a brief site
            walkthrough and we'll put together a plan from there.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>Get an instant estimate</h2>
          <p style={styles.body}>
            Use our online calculator to get a residential price immediately — no call needed.
            Commercial enquiries are handled by message or phone.
          </p>
          <div style={styles.ctas}>
            <Link href="/" style={styles.ctaPrimary}>Get a quote</Link>
            <a href="tel:+61449963099" style={styles.ctaSecondary}>+61 449 963 099</a>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>Have questions?</h2>
          <p style={styles.body}>
            Our <Link href="/faq" style={styles.link}>FAQ page</Link> covers pricing, what's
            included, the end of lease process, and more. Or{" "}
            <a href="mailto:pureglimsydney@gmail.com" style={styles.link}>send us an email</a>.
          </p>
          <p style={{ ...styles.body, marginTop: "12px" }}>
            We also serve{" "}
            <Link href="/locations/eastern-suburbs" style={styles.link}>
              Sydney's Eastern Suburbs
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
