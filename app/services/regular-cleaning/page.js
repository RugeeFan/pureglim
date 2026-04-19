import VideoShell from "../../components/VideoShell";
import Link from "next/link";

export const metadata = {
  title: "Regular House Cleaning Sydney — From $150 | PureGlim",
  description:
    "Get an estimate online. Reliable fortnightly or weekly home cleaning across Sydney. Kitchen, bathrooms, vacuuming, mopping, and more — consistent every visit.",
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Regular House Cleaning Sydney",
  provider: { "@id": "https://pureglim.com.au/#business" },
  serviceType: "Residential Cleaning",
  description:
    "Recurring home cleaning service in Sydney — weekly, fortnightly, or monthly. Kitchen, bathrooms, vacuuming, mopping, and dusting to a consistent standard.",
  areaServed: { "@type": "City", name: "Sydney" },
  offers: {
    "@type": "Offer",
    priceSpecification: [
      { "@type": "PriceSpecification", name: "1 bedroom", price: "150", priceCurrency: "AUD" },
      { "@type": "PriceSpecification", name: "2 bedrooms", price: "185", priceCurrency: "AUD" },
      { "@type": "PriceSpecification", name: "3 bedrooms", price: "225", priceCurrency: "AUD" },
      { "@type": "PriceSpecification", name: "4+ bedrooms", price: "275", priceCurrency: "AUD" },
    ],
  },
  url: "https://pureglim.com.au/services/regular-cleaning",
};

export default function RegularCleaningPage() {
  return (
    <VideoShell>
      <div className="rp-header">
        <Link href="/" className="rp-back">← PureGlim</Link>
        <Link href="/?booking=true" className="rp-top-cta">Book a clean →</Link>
      </div>

      <p className="rp-eyebrow">Residential cleaning</p>
      <h1 className="rp-h1">Regular house cleaning — from $150</h1>
      <p className="rp-intro">
        A home that stays consistently clean without you having to manage it. We arrive when
        expected, work to a fixed standard, and leave — no supervision required. Weekly,
        fortnightly, or monthly, depending on how your household runs.
      </p>

      <section className="rp-section">
        <h2 className="rp-h2">Who it's for</h2>
        <p className="rp-body">
          Regular cleaning suits anyone who wants their home maintained to a consistent standard
          without spending their own time on it — busy professionals, families with young children,
          people returning after a period away, and anyone who simply values having it done properly.
        </p>
        <p className="rp-body">
          Fortnightly is our most popular frequency. Weekly works well for larger households or
          homes with pets. Monthly is a good supplement if you manage day-to-day tidying yourself.
        </p>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Pricing</h2>
        <p className="rp-body">
          Fortnightly rates below. Weekly bookings receive a 10% discount. One-off cleans are
          available at a slightly higher rate.
        </p>
        <div className="rp-price-grid">
          <div className="rp-price-card"><strong>$150</strong><span>1 bedroom</span></div>
          <div className="rp-price-card"><strong>$185</strong><span>2 bedrooms</span></div>
          <div className="rp-price-card"><strong>$225</strong><span>3 bedrooms</span></div>
          <div className="rp-price-card"><strong>$275</strong><span>4 bedrooms+</span></div>
        </div>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">What's included</h2>
        <ul className="rp-list">
          <li>Kitchen — surfaces, sink, stovetop exterior, splashback, appliance exteriors</li>
          <li>Bathrooms — toilet, basin, shower/bath, mirrors, tiles</li>
          <li>All rooms — vacuuming, mopping hard floors, dusting surfaces and skirting boards</li>
          <li>Bedrooms — make beds (if linen is accessible), dust furniture, vacuum</li>
          <li>Living areas — vacuum upholstered surfaces, wipe tables, tidy</li>
          <li>Internal glass doors and mirrors throughout</li>
          <li>Empty bins throughout</li>
        </ul>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Add-ons</h2>
        <p className="rp-body">
          Available to add to any regular clean at booking or on the day:
        </p>
        <ul className="rp-list">
          <li>Oven clean (interior) — $65</li>
          <li>Fridge clean (interior) — $35</li>
          <li>Interior windows — $45</li>
          <li>Balcony sweep and wipe — $25</li>
          <li>Laundry — wash, dry, fold — $20</li>
        </ul>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Common questions</h2>

        <div className="rp-faq-item">
          <h3>Do I need to be home?</h3>
          <p>No — most clients aren't present. Provide entry details at booking (key lockbox, door code, etc.) and we handle the rest. The same cleaner attends each visit so you know who to expect.</p>
        </div>
        <div className="rp-faq-item">
          <h3>What if I'm not happy with a clean?</h3>
          <p>We offer a free re-clean for anything within our agreed scope that falls short. Let us know within 24 hours and we'll return at no charge — no debate.</p>
        </div>
        <div className="rp-faq-item">
          <h3>Do you supply products and equipment?</h3>
          <p>Yes, everything is supplied. If you prefer fragrance-free or specific products for allergy reasons, note it at booking and we'll accommodate where possible.</p>
        </div>
      </section>

      <hr className="rp-divider" />

      <section className="rp-section">
        <p className="rp-h2">Get an instant quote</p>
        <p className="rp-body">
          Select your home size online and get a price immediately. No phone call required.
        </p>
        <div className="rp-cta-group">
          <Link href="/?booking=true" className="rp-cta-primary">Book a clean →</Link>
          <a href="tel:+61449963099" className="rp-cta-secondary">+61 449 963 099</a>
        </div>
        <p className="rp-body" style={{ marginTop: "20px" }}>
          Also:{" "}
          <Link href="/services/end-of-lease" className="rp-link">End of lease cleaning</Link>
          {" · "}
          <Link href="/services/commercial" className="rp-link">Commercial cleaning</Link>
          {" · "}
          <Link href="/faq" className="rp-link">FAQ</Link>
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </VideoShell>
  );
}
