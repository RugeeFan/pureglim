import VideoShell from "../../components/VideoShell";
import Link from "next/link";

export const metadata = {
  title: "End of Lease Cleaning Sydney — From $280 | PureGlim",
  description:
    "Get an estimate online. Bond cleaning in Sydney to inspection standard. Inside cupboards, skirting boards, appliances, and mould treatment. Free re-clean if anything is raised at inspection.",
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "End of Lease Cleaning Sydney",
  provider: { "@id": "https://pureglim.com.au/#business" },
  serviceType: "End of Lease Cleaning",
  description:
    "Bond and end of lease cleaning in Sydney to inspection standard. Covers all rental inspection points — cupboards, appliances, bathroom mould, skirting boards, and more.",
  areaServed: { "@type": "City", name: "Sydney" },
  offers: {
    "@type": "Offer",
    priceSpecification: [
      { "@type": "PriceSpecification", name: "1 bedroom", price: "280", priceCurrency: "AUD" },
      { "@type": "PriceSpecification", name: "2 bedrooms", price: "320", priceCurrency: "AUD" },
      { "@type": "PriceSpecification", name: "3 bedrooms", price: "360", priceCurrency: "AUD" },
      { "@type": "PriceSpecification", name: "4 bedrooms", price: "530", priceCurrency: "AUD" },
      { "@type": "PriceSpecification", name: "5+ bedrooms", price: "620", priceCurrency: "AUD" },
    ],
  },
  url: "https://pureglim.com.au/services/end-of-lease",
};

export default function EndOfLeasePage() {
  return (
    <VideoShell>
      <div className="rp-header">
        <Link href="/" className="rp-back">← PureGlim</Link>
        <Link href="/?booking=true" className="rp-top-cta">Get a quote →</Link>
      </div>

      <p className="rp-eyebrow">Bond &amp; vacate cleaning</p>
      <h1 className="rp-h1">End of lease cleaning — from $280</h1>
      <p className="rp-intro">
        Cleaning to the standard your agent actually inspects to — not a rushed once-over. We cover
        every item on a typical exit checklist, and if anything within our scope is raised at
        inspection, we return and fix it at no charge.
      </p>

      <section className="rp-section">
        <h2 className="rp-h2">Who it's for</h2>
        <p className="rp-body">
          Anyone moving out of a rental in Sydney who wants their bond back without hassle.
          Whether you're vacating a studio in Bondi, a family home in Lane Cove, or an apartment
          in Neutral Bay — the standard is the same and the guarantee applies regardless of property size.
        </p>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Pricing</h2>
        <p className="rp-body">
          Prices below are starting rates before optional extras. Additional bathrooms and condition
          can shift the quote higher, so use the online estimator for an exact range.
        </p>
        <div className="rp-price-grid">
          <div className="rp-price-card"><strong>$280</strong><span>1 bedroom</span></div>
          <div className="rp-price-card"><strong>$320</strong><span>2 bedrooms</span></div>
          <div className="rp-price-card"><strong>$360</strong><span>3 bedrooms</span></div>
          <div className="rp-price-card"><strong>$530</strong><span>4 bedrooms</span></div>
          <div className="rp-price-card"><strong>$620</strong><span>5+ bedrooms</span></div>
        </div>
        <p className="rp-body" style={{ marginTop: "16px" }}>
          Bathroom add-ons run from $80 for a second bathroom to $150 for four or more bathrooms.
        </p>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">What's included</h2>
        <ul className="rp-list">
          <li>Kitchen — inside and outside all cupboards and drawers, benches, sink, stovetop, rangehood filter, splashback</li>
          <li>Oven exterior (interior available as add-on)</li>
          <li>All appliance exteriors — dishwasher, fridge, microwave</li>
          <li>Bathrooms — full scrub of toilet, basin, shower, bath, tiles, grout, mould treatment</li>
          <li>All rooms — vacuum, mop, skirting boards, light switches, door frames, window tracks</li>
          <li>Built-in wardrobes — inside and outside</li>
          <li>Mirrors and glass throughout</li>
          <li>Laundry — tub, exterior of appliances, shelves</li>
          <li>All bins emptied and wiped</li>
        </ul>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Add-ons</h2>
        <ul className="rp-list">
          <li>Carpet steam cleaning — from $80</li>
          <li>Oven cleaning — $20</li>
          <li>Fridge cleaning — $20</li>
          <li>Microwave cleaning — $20</li>
          <li>Staircase cleaning — $60</li>
          <li>Wall stain removal — $20</li>
          <li>Toilet stain removal — $20</li>
          <li>Pet hair removal — $20</li>
          <li>Mould removal — $20</li>
          <li>Carpet stain removal — $25</li>
          <li>Blind cleaning — from $15 per blind</li>
        </ul>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Bond-back guarantee</h2>
        <p className="rp-body">
          If anything within our agreed scope is raised by your agent or property manager at the
          final inspection, we return and address it — no arguments, no fees, no conditions.
          This applies to the specific items we cleaned, not pre-existing damage or items outside
          our scope.
        </p>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Common questions</h2>

        <div className="rp-faq-item">
          <h3>How far in advance should I book?</h3>
          <p>3–5 business days is ideal. Peak periods (Jan–Feb, Jun–Jul) can book out quickly — earlier is better if you have a fixed inspection date. Express bookings are sometimes possible; call to check.</p>
        </div>
        <div className="rp-faq-item">
          <h3>Do I need to be present during the clean?</h3>
          <p>No — most clients hand over keys or provide a lockbox code and aren't present. We send a completion notification when done.</p>
        </div>
        <div className="rp-faq-item">
          <h3>What if my agent raises something at inspection?</h3>
          <p>Contact us within 72 hours of the inspection and provide the specific items noted. We'll arrange a return visit at no charge to address anything within our scope. This guarantee gives you confidence going into the inspection.</p>
        </div>
      </section>

      <hr className="rp-divider" />

      <section className="rp-section">
        <p className="rp-h2">Book your end of lease clean</p>
        <p className="rp-body">
          Get an instant quote online or call us to discuss your property.
        </p>
        <div className="rp-cta-group">
          <Link href="/?booking=true" className="rp-cta-primary">Get a quote →</Link>
          <a href="tel:+61449963099" className="rp-cta-secondary">+61 449 963 099</a>
        </div>
        <p className="rp-body" style={{ marginTop: "20px" }}>
          Service areas:{" "}
          <Link href="/locations/eastern-suburbs" className="rp-link">Eastern Suburbs</Link>
          {" · "}
          <Link href="/locations/northern-suburbs" className="rp-link">Lower North Shore</Link>
          {" · "}
          <Link href="/faq" className="rp-link">Full FAQ</Link>
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </VideoShell>
  );
}
