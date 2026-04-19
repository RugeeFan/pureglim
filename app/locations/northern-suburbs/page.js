import VideoShell from "../../components/VideoShell";
import Link from "next/link";

export const metadata = {
  title: "House Cleaning — Sydney Lower North Shore | PureGlim",
  description:
    "Get an estimate online. Home and office cleaning in Mosman, Neutral Bay, North Sydney, Chatswood, and Lane Cove. Reliable, detail-focused service.",
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "House & Office Cleaning — Lower North Shore Sydney",
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
      minPrice: "150",
      priceCurrency: "AUD",
    },
  },
  url: "https://pureglim.com.au/locations/northern-suburbs",
};

export default function NorthernSuburbsPage() {
  return (
    <VideoShell>
      <div className="rp-header">
        <Link href="/" className="rp-back">← PureGlim</Link>
        <Link href="/?booking=true" className="rp-top-cta">Book a clean →</Link>
      </div>

      <p className="rp-eyebrow">Sydney Lower North Shore</p>
      <h1 className="rp-h1">House &amp; office cleaning — Lower North Shore</h1>
      <p className="rp-intro">
        From the prestige harbourside homes of Mosman and Neutral Bay to the offices and studios
        of North Sydney and Chatswood, the Lower North Shore spans a wide mix of residential and
        commercial needs. We work across all of it — scheduled around how you actually live and work.
      </p>

      <section className="rp-section">
        <h2 className="rp-h2">Why Lower North Shore properties choose PureGlim</h2>
        <p className="rp-body">
          The Lower North Shore has high expectations — properties are well-kept, agents are
          thorough, and clients notice when a job is done properly. We've built our reputation
          here on consistency: the same standard every visit, fully insured, with a free
          re-clean guarantee if anything falls short.
        </p>
        <p className="rp-body">
          Whether it's a Mosman family home, a Neutral Bay apartment, or a North Sydney office,
          we quote accurately and turn up on time.
        </p>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Regular home cleaning</h2>
        <p className="rp-body">
          Covers kitchen surfaces and sink, bathroom wipe-down, vacuuming, mopping, dusting, and
          general tidying throughout. Fortnightly is the most popular frequency; weekly bookings
          receive a 10% discount.
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
          High-density apartments in Neutral Bay, Cremorne, and Kirribilli mean a steady flow of
          tenancy turnovers. Our end of lease service covers inside cupboards, skirting boards,
          appliance exteriors, bathroom mould treatment, tracks, corners, and all the detail work
          that matters at inspection.
        </p>
        <p className="rp-body">
          Add-ons: carpet cleaning ($70), oven ($65), fridge ($35), interior windows ($45).
          If anything within our scope is raised at inspection, we return at no charge.
        </p>
        <div className="rp-price-grid">
          <div className="rp-price-card"><strong>$340</strong><span>1 bedroom</span></div>
          <div className="rp-price-card"><strong>$430</strong><span>2 bedrooms</span></div>
          <div className="rp-price-card"><strong>$520</strong><span>3 bedrooms</span></div>
        </div>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Office &amp; commercial cleaning — North Sydney and Chatswood</h2>
        <p className="rp-body">
          North Sydney and Chatswood are two of Sydney's largest commercial precincts outside the
          CBD. We provide regular office and workplace cleaning for smaller businesses, studios,
          retail spaces, and shared workplaces across both areas.
        </p>
        <p className="rp-body">
          Schedules are built around your hours — before open, after close, or during low-traffic
          windows — with no template scope forced on a space it doesn't suit. Commercial enquiries
          are handled individually; contact us to arrange a brief site walkthrough.
        </p>
        <div className="rp-cta-group" style={{ marginTop: "20px" }}>
          <a href="mailto:pureglimsydney@gmail.com" className="rp-cta-primary">Enquire about commercial →</a>
          <a href="tel:+61449963099" className="rp-cta-secondary">+61 449 963 099</a>
        </div>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Areas we cover</h2>
        <p className="rp-body">We clean regularly across the Lower North Shore, including:</p>
        <div className="rp-area-tags">
          {["Mosman", "Neutral Bay", "Cremorne", "Kirribilli", "McMahons Point",
            "North Sydney", "Crows Nest", "St Leonards", "Chatswood",
            "Lane Cove", "Willoughby", "Northbridge"].map(s => (
            <span key={s} className="rp-area-tag">{s}</span>
          ))}
        </div>
        <p className="rp-body" style={{ marginTop: "16px" }}>
          Not listed?{" "}
          <a href="tel:+61449963099" className="rp-link">Call us</a> — we likely cover your area.
        </p>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Common questions — Lower North Shore</h2>

        <div className="rp-faq-item">
          <h3>Do you service strata apartments on the Lower North Shore?</h3>
          <p>Yes — we regularly clean strata apartments in Neutral Bay, Cremorne, and Kirribilli. Access arrangements (key lockboxes, building entry codes) are handled at booking.</p>
        </div>
        <div className="rp-faq-item">
          <h3>Can I get a quote for a commercial space in North Sydney?</h3>
          <p>Yes. Commercial quotes are handled individually rather than through the online calculator. Email or call us to arrange a walkthrough, and we'll put together a scope and schedule that fits your space.</p>
        </div>
        <div className="rp-faq-item">
          <h3>How quickly can you book an end of lease clean?</h3>
          <p>We typically need 3–5 days notice. Urgent bookings are sometimes available — call to check. We aim to accommodate end of lease timing wherever possible given the bond implications.</p>
        </div>
        <div className="rp-faq-item">
          <h3>What's your re-clean policy?</h3>
          <p>If anything within our agreed scope doesn't meet standard — whether for a regular or end of lease job — we return and fix it at no additional charge. No arguments, no conditions. See our <Link href="/faq" className="rp-link">FAQ</Link> for more detail.</p>
        </div>
      </section>

      <hr className="rp-divider" />

      <section className="rp-section">
        <p className="rp-h2">Get an instant quote</p>
        <p className="rp-body">
          Residential prices online in seconds. Commercial and large-scale enquiries by phone or email.
        </p>
        <div className="rp-cta-group">
          <Link href="/?booking=true" className="rp-cta-primary">Book a clean →</Link>
          <a href="tel:+61449963099" className="rp-cta-secondary">+61 449 963 099</a>
        </div>
        <p className="rp-body" style={{ marginTop: "20px" }}>
          Also serving:{" "}
          <Link href="/locations/eastern-suburbs" className="rp-link">Eastern Suburbs</Link>
          {" · "}
          <Link href="/services/regular-cleaning" className="rp-link">Regular cleaning</Link>
          {" · "}
          <Link href="/services/end-of-lease" className="rp-link">End of lease</Link>
          {" · "}
          <Link href="/services/commercial" className="rp-link">Commercial cleaning</Link>
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </VideoShell>
  );
}
