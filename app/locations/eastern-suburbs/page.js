import VideoShell from "../../components/VideoShell";
import Link from "next/link";

export const metadata = {
  title: "House Cleaning — Sydney Eastern Suburbs | PureGlim",
  description:
    "Get an estimate online. Home and end of lease cleaning in Bondi, Double Bay, Paddington, Vaucluse, Coogee, and Woollahra. Done with care and consistency.",
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
      minPrice: "150",
      priceCurrency: "AUD",
    },
  },
  url: "https://pureglim.com.au/locations/eastern-suburbs",
};

export default function EasternSuburbsPage() {
  return (
    <VideoShell>
      <div className="rp-header">
        <Link href="/" className="rp-back">← PureGlim</Link>
        <Link href="/?booking=true" className="rp-top-cta">Book a clean →</Link>
      </div>

      <p className="rp-eyebrow">Sydney Eastern Suburbs</p>
      <h1 className="rp-h1">House &amp; apartment cleaning — Eastern Suburbs</h1>
      <p className="rp-intro">
        The Eastern Suburbs has some of Sydney's most sought-after apartments, terraces, and
        family homes — and one of its highest concentrations of renters. Whether you need
        reliable fortnightly upkeep in a Bondi apartment or a thorough end of lease clean
        before a Randwick inspection, we take care of it without fuss.
      </p>

      <section className="rp-section">
        <h2 className="rp-h2">Why Eastern Suburbs properties choose PureGlim</h2>
        <p className="rp-body">
          We've cleaned hundreds of homes from Bondi to Bellevue Hill. Eastern Suburbs clients
          tend to value two things above all: consistency and discretion. Our cleaners arrive
          when expected, work efficiently, and leave the kind of result that needs no follow-up
          call. We're fully insured, and every job is backed by our free re-clean guarantee.
        </p>
        <p className="rp-body">
          Whether it's a compact studio on Hall Street or a four-bedroom terrace in Paddington,
          we quote accurately and deliver consistently.
        </p>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Regular home cleaning</h2>
        <p className="rp-body">
          Our regular service covers kitchen surfaces and sink, bathroom wipe-down, vacuuming,
          mopping, dusting, and general tidying. Fortnightly is the most popular frequency;
          weekly bookings receive a 10% discount.
        </p>
        <div className="rp-price-grid">
          <div className="rp-price-card"><strong>$150</strong><span>1 bedroom</span></div>
          <div className="rp-price-card"><strong>$185</strong><span>2 bedrooms</span></div>
          <div className="rp-price-card"><strong>$225</strong><span>3 bedrooms</span></div>
          <div className="rp-price-card"><strong>$275</strong><span>4 bedrooms+</span></div>
        </div>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">End of lease cleaning</h2>
        <p className="rp-body">
          Bond cleaning in the Eastern Suburbs requires attention to detail — agents inspect
          closely. We clean to inspection standard: inside cupboards, skirting boards, appliance
          exteriors, bathroom mould treatment, and all the spots regular cleaning skips.
        </p>
        <p className="rp-body">
          Add-ons available: carpet cleaning ($70), oven ($65), fridge ($35), interior windows ($45).
          If anything within our scope is raised at inspection, we return at no charge.
        </p>
        <div className="rp-price-grid">
          <div className="rp-price-card"><strong>$340</strong><span>1 bedroom</span></div>
          <div className="rp-price-card"><strong>$430</strong><span>2 bedrooms</span></div>
          <div className="rp-price-card"><strong>$520</strong><span>3 bedrooms</span></div>
        </div>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Areas we cover</h2>
        <p className="rp-body">
          We clean regularly across the Eastern Suburbs. Common areas include:
        </p>
        <div className="rp-area-tags">
          {["Bondi", "Bondi Beach", "Bondi Junction", "Bronte", "Tamarama", "Coogee",
            "Clovelly", "Randwick", "Rose Bay", "Bellevue Hill", "Double Bay",
            "Paddington", "Vaucluse", "Watsons Bay"].map(s => (
            <span key={s} className="rp-area-tag">{s}</span>
          ))}
        </div>
        <p className="rp-body" style={{ marginTop: "16px" }}>
          Not sure if we reach your street?{" "}
          <a href="tel:+61449963099" className="rp-link">Call us</a> or{" "}
          <a href="mailto:pureglimsydney@gmail.com" className="rp-link">send a message</a>.
        </p>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Common questions — Eastern Suburbs</h2>

        <div className="rp-faq-item">
          <h3>Do I need to be home during the clean?</h3>
          <p>No — most clients provide entry instructions and aren't present. We're fully insured and operate with a consistent team so you always know who's coming.</p>
        </div>
        <div className="rp-faq-item">
          <h3>How far in advance do I need to book an end of lease clean?</h3>
          <p>We recommend at least 3–5 days notice for end of lease, especially in peak rental periods (Jan–Feb, Jun–Jul). Express bookings are sometimes possible — call to check availability.</p>
        </div>
        <div className="rp-faq-item">
          <h3>Do you bring your own products and equipment?</h3>
          <p>Yes, all products and equipment are supplied. If you have preferences (fragrance-free, specific brands), let us know when booking and we'll accommodate where possible.</p>
        </div>
        <div className="rp-faq-item">
          <h3>What's included in a regular clean vs end of lease?</h3>
          <p>Regular cleans keep surfaces and high-traffic areas consistently clean. End of lease is a deeper, one-off clean covering inside cupboards, appliances, and all rental inspection points. See our full <Link href="/faq" className="rp-link">FAQ</Link> for a complete breakdown.</p>
        </div>
      </section>

      <hr className="rp-divider" />

      <section className="rp-section">
        <p className="rp-h2">Get an instant quote</p>
        <p className="rp-body">
          Select your home size and service online — no phone call needed to get a number.
        </p>
        <div className="rp-cta-group">
          <Link href="/?booking=true" className="rp-cta-primary">Book a clean →</Link>
          <a href="tel:+61449963099" className="rp-cta-secondary">+61 449 963 099</a>
        </div>
        <p className="rp-body" style={{ marginTop: "20px" }}>
          Also serving:{" "}
          <Link href="/locations/northern-suburbs" className="rp-link">Lower North Shore</Link>
          {" · "}
          <Link href="/services/regular-cleaning" className="rp-link">Regular cleaning</Link>
          {" · "}
          <Link href="/services/end-of-lease" className="rp-link">End of lease</Link>
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </VideoShell>
  );
}
