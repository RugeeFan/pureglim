import Link from "next/link";
import VideoShell from "./VideoShell";
import {
  SITE_URL,
  REGULAR_PRICES,
  END_OF_LEASE_PRICES,
  COMMON_FAQS,
  END_OF_LEASE_FAQ,
} from "../data/seoLocations";

// Rich page template for individual suburb pages.
// Region pages have their own bespoke layout (more content, different sections).

export default function SuburbRichPage({ suburb }) {
  const url = `${SITE_URL}/locations/${suburb.slug}`;
  const regionUrl = `${SITE_URL}/locations/${suburb.regionSlug}`;

  const faqs = [
    ...COMMON_FAQS,
    {
      q: `Is ${suburb.name} on a regular cleaning route?`,
      a: `Yes — ${suburb.name} sits on one of our recurring ${suburb.regionName} routes, which is what makes weekly or fortnightly cleaning easy to schedule consistently. Final timing depends on availability when you book.`,
    },
    END_OF_LEASE_FAQ,
  ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `House Cleaning — ${suburb.name}, Sydney`,
    provider: { "@id": `${SITE_URL}/#business` },
    serviceType: ["Residential Cleaning", "End of Lease Cleaning"],
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: suburb.coords.lat,
        longitude: suburb.coords.lng,
      },
      geoRadius: "2500",
    },
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: "110",
        priceCurrency: "AUD",
      },
    },
    url,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: suburb.regionName, item: regionUrl },
      { "@type": "ListItem", position: 3, name: suburb.name, item: url },
    ],
  };

  return (
    <VideoShell>
      <div className="rp-header">
        <Link href="/" className="rp-back">← PureGlim</Link>
        <Link href="/?booking=true" className="rp-top-cta">Get an instant estimate →</Link>
      </div>

      <p className="rp-eyebrow">{suburb.eyebrow}</p>
      <h1 className="rp-h1">{suburb.h1}</h1>
      <p className="rp-intro">{suburb.intro}</p>

      <section className="rp-section">
        <h2 className="rp-h2">Get an instant cleaning estimate online</h2>
        <p className="rp-body">
          Pick your home size, frequency, and any add-ons, and the booking flow returns a price
          straight away — no phone call needed for a starting number. The online estimate is a
          quick guide; final pricing depends on home size, condition, access, and what's needed
          on the first visit.
        </p>
        <div className="rp-cta-group">
          <Link href="/?booking=true" className="rp-cta-primary">Get an instant estimate →</Link>
          <a href="tel:+61449963099" className="rp-cta-secondary">+61 449 963 099</a>
        </div>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Regular cleaning in {suburb.name}</h2>
        <p className="rp-body">
          Weekly, fortnightly, or monthly — same cleaner each visit, fixed scope, predictable
          schedule. Fortnightly is our most popular frequency. Starting prices below are for
          fortnightly cleans with one bathroom.
        </p>
        <div className="rp-price-grid">
          {REGULAR_PRICES.map((p) => (
            <div className="rp-price-card" key={p.size}>
              <strong>{p.price}</strong>
              <span>{p.size}</span>
            </div>
          ))}
        </div>
        <p className="rp-body" style={{ marginTop: "16px" }}>
          See the full <Link href="/services/regular-cleaning" className="rp-link">regular house cleaning</Link>{" "}
          page for what's included and add-ons.
        </p>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">End-of-lease cleaning in {suburb.name}</h2>
        <p className="rp-body">
          Bond-back cleaning to inspection standard — inside cupboards, skirting, appliance
          exteriors, mould treatment, and the detail work that matters at handover. If anything
          within scope is raised at inspection, we return at no charge.
        </p>
        <div className="rp-price-grid">
          {END_OF_LEASE_PRICES.map((p) => (
            <div className="rp-price-card" key={p.size}>
              <strong>{p.price}</strong>
              <span>{p.size}</span>
            </div>
          ))}
        </div>
        <p className="rp-body" style={{ marginTop: "16px" }}>
          Full details on the{" "}
          <Link href="/services/end-of-lease" className="rp-link">end-of-lease cleaning</Link> page.
        </p>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">What we clean</h2>
        <ul className="rp-list">
          <li>Kitchen — surfaces, sink, stovetop exterior, splashback, appliance exteriors</li>
          <li>Bathrooms — toilet, basin, shower/bath, mirrors, tiles</li>
          <li>Bedrooms &amp; living areas — vacuuming, mopping, dusting, surfaces</li>
          <li>Mirrors and internal glass throughout</li>
          <li>Bins emptied throughout</li>
          <li>Optional add-ons: oven, fridge, interior windows, balcony, laundry support</li>
        </ul>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Local notes — {suburb.name}</h2>
        <p className="rp-body">{suburb.localNote}</p>
        {suburb.nearby?.length ? (
          <>
            <p className="rp-body" style={{ marginTop: "16px" }}>
              Nearby areas we also clean regularly:
            </p>
            <div className="rp-area-tags">
              {suburb.nearby.map((s) => (
                <span key={s} className="rp-area-tag">{s}</span>
              ))}
            </div>
          </>
        ) : null}
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Why PureGlim</h2>
        <ul className="rp-list">
          <li>Same cleaner each recurring visit — consistency, not rotation</li>
          <li>Free re-clean if anything in scope falls short</li>
          <li>Fully insured, police-checked staff</li>
          <li>Easy communication — text or call, same day</li>
          <li>No long lock-in for regular cleaning</li>
        </ul>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Common questions</h2>
        {faqs.map((f) => (
          <div className="rp-faq-item" key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </section>

      <hr className="rp-divider" />

      <section className="rp-section">
        <p className="rp-h2">Book or request an estimate</p>
        <p className="rp-body">
          Use the online booking flow for an instant estimate, or call us if you'd like to talk
          through a one-off or commercial enquiry.
        </p>
        <div className="rp-cta-group">
          <Link href="/?booking=true" className="rp-cta-primary">Get an instant estimate →</Link>
          <a href="tel:+61449963099" className="rp-cta-secondary">+61 449 963 099</a>
        </div>
        <p className="rp-body" style={{ marginTop: "20px" }}>
          Also see:{" "}
          <Link href={`/locations/${suburb.regionSlug}`} className="rp-link">{suburb.regionName}</Link>
          {" · "}
          <Link href="/services/regular-cleaning" className="rp-link">Regular cleaning</Link>
          {" · "}
          <Link href="/services/end-of-lease" className="rp-link">End of lease</Link>
          {" · "}
          <Link href="/services/commercial" className="rp-link">Commercial</Link>
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </VideoShell>
  );
}
