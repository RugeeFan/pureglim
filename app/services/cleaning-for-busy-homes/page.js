import VideoShell from "../../components/VideoShell";
import Link from "next/link";

export const metadata = {
  title: { absolute: "Regular Cleaning for Busy Homes in Sydney | PureGlim" },
  description:
    "Get an instant cleaning estimate online. Reliable regular cleaning for busy families, new parents, and older residents across Sydney.",
  alternates: { canonical: "https://pureglim.com.au/services/cleaning-for-busy-homes" },
  openGraph: {
    type: "website",
    url: "https://pureglim.com.au/services/cleaning-for-busy-homes",
    siteName: "PureGlim",
    title: "Regular Cleaning for Busy Homes in Sydney | PureGlim",
    description:
      "Get an instant cleaning estimate online. Reliable regular cleaning for busy families, new parents, and older residents across Sydney.",
    locale: "en_AU",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Regular Cleaning for Busy Homes — Sydney",
  provider: { "@id": "https://pureglim.com.au/#business" },
  serviceType: "Residential Cleaning",
  description:
    "Reliable regular house cleaning across Sydney for busy families, new parents, and older residents who prefer a steady cleaning routine. Weekly, fortnightly, or monthly visits.",
  areaServed: { "@type": "City", name: "Sydney" },
  offers: {
    "@type": "Offer",
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice: "110",
      priceCurrency: "AUD",
    },
  },
  url: "https://pureglim.com.au/services/cleaning-for-busy-homes",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://pureglim.com.au" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://pureglim.com.au/services/regular-cleaning" },
    { "@type": "ListItem", position: 3, name: "Cleaning for Busy Homes", item: "https://pureglim.com.au/services/cleaning-for-busy-homes" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is regular cleaning better for busy family homes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For most busy households, yes. Regular cleaning keeps the home consistently manageable instead of building up to a big reset every few weeks. It usually means less weekend cleaning and a more predictable rhythm overall.",
      },
    },
    {
      "@type": "Question",
      name: "Can I book weekly or fortnightly cleaning?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — weekly, fortnightly, and monthly are all available. Fortnightly is our most popular frequency. Weekly works well for larger households or homes with young children. Monthly is a good fit if you handle day-to-day tidying yourself.",
      },
    },
    {
      "@type": "Question",
      name: "Can you help around the time of a new baby arriving?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Many of our clients start regular cleaning when life gets busier — including around a new arrival. We aim for consistent visits and simple communication, so the home stays manageable without it becoming another thing to organise.",
      },
    },
    {
      "@type": "Question",
      name: "Do you clean homes for older residents?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We clean homes for older residents who prefer regular help keeping things comfortable. We're a cleaning service — we don't provide aged care, medical care, or personal care. We focus on keeping the home clean, with consistent visits where possible and clear communication.",
      },
    },
    {
      "@type": "Question",
      name: "Can I request extra attention for the kitchen, bathrooms, or floors?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Tell us at booking which areas matter most and we'll prioritise them on each visit. Add-ons like oven interior, fridge interior, and interior windows are also available on request.",
      },
    },
    {
      "@type": "Question",
      name: "Is the online price a final quote or an estimate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The online price is an instant estimate based on home size and rooms. Final pricing is confirmed once we understand your home — condition, access, and anything specific you'd like prioritised.",
      },
    },
  ],
};

export default function CleaningForBusyHomesPage() {
  return (
    <VideoShell>
      <div className="rp-header">
        <Link href="/" className="rp-back">← PureGlim</Link>
        <Link href="/?booking=true" className="rp-top-cta">Get an estimate →</Link>
      </div>

      <p className="rp-eyebrow">Regular cleaning · Sydney</p>
      <h1 className="rp-h1">Reliable regular cleaning for busy homes across Sydney</h1>
      <p className="rp-intro">
        Calm, careful, and consistent — for families, new parents, and older residents who prefer
        a steady cleaning routine.
      </p>

      <section className="rp-section">
        <div className="rp-cta-group">
          <Link href="/?booking=true" className="rp-cta-primary">Get an instant cleaning estimate →</Link>
          <Link href="/services/regular-cleaning" className="rp-cta-secondary">View regular cleaning</Link>
        </div>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Who this helps</h2>
        <p className="rp-body">
          PureGlim helps busy families, new parents, and older residents keep their homes clean
          and manageable with reliable regular cleaning across Sydney. Whether your home is busy
          with kids, recovering from a big week, or simply needs a steady routine, regular
          cleaning helps keep things feeling calm and under control.
        </p>
        <ul className="rp-list">
          <li>Busy family homes that need a dependable rhythm</li>
          <li>New parents settling into a routine at home</li>
          <li>Older residents who prefer regular help around the home</li>
          <li>Anyone who prefers a steady cleaning routine over constant catch-up</li>
        </ul>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Why regular cleaning works</h2>
        <p className="rp-body">
          A regular clean keeps the home consistently manageable instead of building up between
          visits. Most clients tell us it means less weekend cleaning, a more predictable rhythm,
          and a home that feels under control most of the time — not just right after a deep clean.
        </p>
        <p className="rp-body">
          Choose a frequency that suits your home:
        </p>
        <ul className="rp-list">
          <li><strong>Weekly</strong> — best for larger households, homes with young children, or homes with pets</li>
          <li><strong>Fortnightly</strong> — our most popular frequency; a steady reset that suits most homes</li>
          <li><strong>Monthly</strong> — a good supplement when you manage day-to-day tidying yourself</li>
        </ul>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">What we focus on each visit</h2>
        <p className="rp-body">
          A practical reset of the home, to a consistent standard:
        </p>
        <ul className="rp-list">
          <li>Kitchen — surfaces, sink, stovetop exterior, splashback, appliance exteriors</li>
          <li>Bathrooms — toilet, basin, shower or bath, mirrors, tiles</li>
          <li>Floors — vacuum throughout, mop hard floors</li>
          <li>Living areas and bedrooms — dust surfaces, tidy, vacuum upholstery</li>
          <li>Mirrors and internal glass</li>
          <li>Bins emptied throughout</li>
        </ul>
        <p className="rp-body">
          Tell us at booking which areas matter most — kitchen, bathrooms, floors — and we&apos;ll
          prioritise them on each visit.
        </p>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Why PureGlim</h2>
        <ul className="rp-list">
          <li><strong>Reliable scheduling</strong> — we arrive when expected</li>
          <li><strong>Careful, respectful service</strong> — in your home, on your terms</li>
          <li><strong>Simple communication</strong> — no fuss, no chasing</li>
          <li><strong>Consistent visits where possible</strong> — the same team, when we can</li>
          <li><strong>Free re-clean</strong> — anything within scope that falls short, we return</li>
          <li><strong>Peace of mind</strong> — a home that stays manageable without managing the cleaner</li>
        </ul>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">What we are, and what we&apos;re not</h2>
        <p className="rp-body">
          PureGlim provides professional house cleaning. We do not provide aged care, medical
          care, nursing, personal care, or childcare — we simply focus on keeping the home clean,
          comfortable, and manageable.
        </p>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Get an instant cleaning estimate online</h2>
        <p className="rp-body">
          Pick your home size, frequency, and any add-ons — the booking flow returns a price
          straight away. The online price is an instant estimate; final pricing is confirmed once
          we understand your home, access, and anything specific you&apos;d like prioritised.
        </p>
        <div className="rp-cta-group">
          <Link href="/?booking=true" className="rp-cta-primary">Get an instant estimate →</Link>
          <a href="tel:+61449963099" className="rp-cta-secondary">+61 449 963 099</a>
        </div>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Where we clean</h2>
        <p className="rp-body">
          Sydney-wide, with regular routes through the{" "}
          <Link href="/locations/eastern-suburbs" className="rp-link">Eastern Suburbs</Link>
          {" "}and{" "}
          <Link href="/locations/northern-suburbs" className="rp-link">Lower North Shore</Link>
          . Stable routes are what make consistent weekly or fortnightly cleaning easy to schedule
          — particularly helpful when you want the same rhythm every visit. See more on{" "}
          <Link href="/services/regular-cleaning" className="rp-link">regular cleaning</Link>
          {" "}for pricing and what&apos;s included.
        </p>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Common questions</h2>

        <div className="rp-faq-item">
          <h3>Is regular cleaning better for busy family homes?</h3>
          <p>For most busy households, yes. Regular cleaning keeps the home consistently manageable instead of building up to a big reset every few weeks. It usually means less weekend cleaning and a more predictable rhythm overall.</p>
        </div>
        <div className="rp-faq-item">
          <h3>Can I book weekly or fortnightly cleaning?</h3>
          <p>Yes — weekly, fortnightly, and monthly are all available. Fortnightly is our most popular frequency. Weekly works well for larger households or homes with young children. Monthly is a good fit if you handle day-to-day tidying yourself.</p>
        </div>
        <div className="rp-faq-item">
          <h3>Can you help around the time of a new baby arriving?</h3>
          <p>Yes. Many of our clients start regular cleaning when life gets busier — including around a new arrival. We aim for consistent visits and simple communication, so the home stays manageable without it becoming another thing to organise.</p>
        </div>
        <div className="rp-faq-item">
          <h3>Do you clean homes for older residents?</h3>
          <p>Yes. We clean homes for older residents who prefer regular help keeping things comfortable. We&apos;re a cleaning service — we don&apos;t provide aged care, medical care, or personal care. We focus on keeping the home clean, with consistent visits where possible and clear communication.</p>
        </div>
        <div className="rp-faq-item">
          <h3>Can I request extra attention for the kitchen, bathrooms, or floors?</h3>
          <p>Yes. Tell us at booking which areas matter most and we&apos;ll prioritise them on each visit. Add-ons like oven interior, fridge interior, and interior windows are also available on request.</p>
        </div>
        <div className="rp-faq-item">
          <h3>Is the online price a final quote or an estimate?</h3>
          <p>The online price is an instant estimate based on home size and rooms. Final pricing is confirmed once we understand your home — condition, access, and anything specific you&apos;d like prioritised.</p>
        </div>
      </section>

      <hr className="rp-divider" />

      <section className="rp-section">
        <p className="rp-h2">Request a regular cleaning estimate</p>
        <p className="rp-body">
          Pick your home size online and get a price straight away. No phone call required.
        </p>
        <div className="rp-cta-group">
          <Link href="/?booking=true" className="rp-cta-primary">Get an instant cleaning estimate →</Link>
          <a href="tel:+61449963099" className="rp-cta-secondary">+61 449 963 099</a>
        </div>
        <p className="rp-body" style={{ marginTop: "20px" }}>
          Also:{" "}
          <Link href="/services/regular-cleaning" className="rp-link">Regular cleaning</Link>
          {" · "}
          <Link href="/locations/eastern-suburbs" className="rp-link">Eastern Suburbs</Link>
          {" · "}
          <Link href="/locations/northern-suburbs" className="rp-link">Lower North Shore</Link>
          {" · "}
          <Link href="/faq" className="rp-link">FAQ</Link>
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
