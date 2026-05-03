import VideoShell from "../../components/VideoShell";
import Link from "next/link";
import { getSuburbsForRegion, ROUTES_LINE } from "../../data/seoLocations";

export const metadata = {
  title: { absolute: "House Cleaning Eastern Suburbs Sydney | PureGlim" },
  description:
    "Get an instant cleaning estimate online. Reliable house cleaning for Eastern Suburbs homes, with regular routes through Bondi, Randwick, Coogee, Maroubra, and nearby areas.",
  alternates: { canonical: "https://pureglim.com.au/locations/eastern-suburbs" },
  openGraph: {
    type: "website",
    url: "https://pureglim.com.au/locations/eastern-suburbs",
    siteName: "PureGlim",
    title: "House Cleaning Eastern Suburbs Sydney | PureGlim",
    description:
      "Get an instant cleaning estimate online. Reliable house cleaning for Eastern Suburbs homes, with regular routes through Bondi, Randwick, Coogee, Maroubra, and nearby areas.",
    locale: "en_AU",
  },
};

const easternSuburbSlugs = getSuburbsForRegion("eastern");

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
      minPrice: "110",
      priceCurrency: "AUD",
    },
  },
  url: "https://pureglim.com.au/locations/eastern-suburbs",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://pureglim.com.au" },
    { "@type": "ListItem", position: 2, name: "Eastern Suburbs", item: "https://pureglim.com.au/locations/eastern-suburbs" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you only clean in the Eastern Suburbs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. We serve homes across Sydney. We just have stable regular cleaning routes through the Eastern Suburbs, which is what makes recurring weekly or fortnightly cleaning easy to schedule consistently here.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to be home during the clean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No — most clients provide entry instructions and aren't present. We're fully insured and operate with a consistent team so you always know who's coming.",
      },
    },
    {
      "@type": "Question",
      name: "How far in advance do I need to book an end-of-lease clean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We recommend at least 3–5 days notice for end-of-lease, especially in peak rental periods (Jan–Feb, Jun–Jul). Express bookings are sometimes possible — call to check availability.",
      },
    },
    {
      "@type": "Question",
      name: "Do you bring your own products and equipment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all products and equipment are supplied. If you have preferences (fragrance-free, specific brands), let us know when booking and we'll accommodate where possible.",
      },
    },
  ],
};

export default function EasternSuburbsPage() {
  return (
    <VideoShell>
      <div className="rp-header">
        <Link href="/" className="rp-back">← PureGlim</Link>
        <Link href="/?booking=true" className="rp-top-cta">Book a clean →</Link>
      </div>

      <p className="rp-eyebrow">Sydney Eastern Suburbs</p>
      <h1 className="rp-h1">House cleaning across Sydney's Eastern Suburbs</h1>
      <p className="rp-intro">
        {ROUTES_LINE} Whether it's reliable fortnightly upkeep in a Bondi apartment or a thorough
        end-of-lease clean before a Randwick inspection, we take care of it without fuss.
      </p>

      <section className="rp-section">
        <h2 className="rp-h2">Get an instant cleaning estimate online</h2>
        <p className="rp-body">
          Pick your home size, frequency, and any add-ons — the booking flow returns a price
          straight away. The online estimate is a quick starting point; final pricing depends on
          home size, condition, access, and what's needed on the first visit.
        </p>
        <div className="rp-cta-group">
          <Link href="/?booking=true" className="rp-cta-primary">Get an instant estimate →</Link>
          <a href="tel:+61449963099" className="rp-cta-secondary">+61 449 963 099</a>
        </div>
      </section>

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
          mopping, dusting, and general tidying. Fortnightly is the most popular frequency,
          with weekly starting from $110 and first visits priced a little higher.
        </p>
        <div className="rp-price-grid">
          <div className="rp-price-card"><strong>$130</strong><span>1 bedroom</span></div>
          <div className="rp-price-card"><strong>$140</strong><span>2 bedrooms</span></div>
          <div className="rp-price-card"><strong>$165</strong><span>3 bedrooms</span></div>
          <div className="rp-price-card"><strong>$200</strong><span>4 bedrooms+</span></div>
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
          Add-ons like carpet steam cleaning, oven cleaning, fridge cleaning, blinds, stain
          treatment, and mould removal can be added in the quote flow. If anything within our
          scope is raised at inspection, we return at no charge.
        </p>
        <div className="rp-price-grid">
          <div className="rp-price-card"><strong>$280</strong><span>1 bedroom</span></div>
          <div className="rp-price-card"><strong>$320</strong><span>2 bedrooms</span></div>
          <div className="rp-price-card"><strong>$360</strong><span>3 bedrooms</span></div>
          <div className="rp-price-card"><strong>$530</strong><span>4 bedrooms+</span></div>
        </div>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Suburbs we visit regularly</h2>
        <p className="rp-body">
          Selected Eastern Suburbs pages — each with local notes, pricing, and what to expect:
        </p>
        <div className="rp-area-tags">
          {easternSuburbSlugs.map((s) => (
            <Link key={s.slug} href={`/locations/${s.slug}`} className="rp-area-tag rp-area-tag-link">
              {s.name}
            </Link>
          ))}
        </div>
        <p className="rp-body" style={{ marginTop: "16px" }}>
          We also visit Bondi Beach, Bronte, Tamarama, Clovelly, Rose Bay, Bellevue Hill, Double
          Bay, Paddington, Vaucluse, and Watsons Bay regularly — and serve the rest of Sydney
          where the schedule allows. Not sure?{" "}
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
