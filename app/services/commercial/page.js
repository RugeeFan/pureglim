import VideoShell from "../../components/VideoShell";
import Link from "next/link";

export const metadata = {
  title: "Commercial & Office Cleaning Sydney | PureGlim",
  description:
    "Get an estimate online. Regular office and workplace cleaning across North Sydney, Chatswood, and the Eastern Suburbs. Scheduled around your hours — no template scope.",
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Commercial & Office Cleaning Sydney",
  provider: { "@id": "https://pureglim.com.au/#business" },
  serviceType: "Commercial Cleaning",
  description:
    "Regular commercial and office cleaning across North Sydney, Chatswood, and Sydney's Eastern Suburbs. Flexible scheduling — before open, after close, or during low-traffic periods.",
  areaServed: { "@type": "City", name: "Sydney" },
  url: "https://pureglim.com.au/services/commercial",
};

export default function CommercialPage() {
  return (
    <VideoShell>
      <div className="rp-header">
        <Link href="/" className="rp-back">← PureGlim</Link>
        <a href="mailto:pureglimsydney@gmail.com" className="rp-top-cta">Enquire now →</a>
      </div>

      <p className="rp-eyebrow">Commercial &amp; office cleaning</p>
      <h1 className="rp-h1">Workplace cleaning — done around your hours</h1>
      <p className="rp-intro">
        Offices, studios, retail spaces, and shared workplaces across Sydney's North Shore and
        Eastern Suburbs. No template scope — we build a plan around your space, your hours,
        and how your team actually uses the place.
      </p>

      <section className="rp-section">
        <h2 className="rp-h2">Who it's for</h2>
        <p className="rp-body">
          We work with smaller businesses, design studios, professional offices, medical rooms,
          boutique retail, and shared coworking spaces. Typically 50–500 sqm — large enough to
          need regular cleaning, small enough that a dedicated in-house cleaner doesn't make sense.
        </p>
        <p className="rp-body">
          If you currently have cleaners who don't show up consistently, or you're handling cleaning
          yourselves, we're likely a straightforward improvement on what you have.
        </p>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">How it works</h2>
        <p className="rp-body">
          Commercial jobs start with a short site walkthrough — usually 15–20 minutes. We look at
          the space, understand what matters to you (front-of-house vs back-of-house priority,
          sensitive equipment, after-hours access), and put together a scope and schedule.
        </p>
        <p className="rp-body">
          From there: fixed schedule, fixed price, same team attending each visit. No invoices
          to chase — we handle billing monthly.
        </p>
        <ul className="rp-list" style={{ marginTop: "14px" }}>
          <li>Before-open, after-close, or during low-traffic hours</li>
          <li>Consistent team — same faces each visit</li>
          <li>Fully insured, police-checked staff</li>
          <li>Monthly billing, no hidden charges</li>
          <li>Flexible scope — adjust as your needs change</li>
        </ul>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Areas served</h2>
        <p className="rp-body">
          We currently take on commercial clients across:
        </p>
        <div className="rp-area-tags">
          {["North Sydney", "Chatswood", "Crows Nest", "St Leonards", "Neutral Bay",
            "Bondi Junction", "Paddington", "Darlinghurst", "Randwick"].map(s => (
            <span key={s} className="rp-area-tag">{s}</span>
          ))}
        </div>
        <p className="rp-body" style={{ marginTop: "16px" }}>
          Not listed? <a href="tel:+61449963099" className="rp-link">Call us</a> — we may still be able to help depending on location and scope.
        </p>
      </section>

      <section className="rp-section">
        <h2 className="rp-h2">Common questions</h2>

        <div className="rp-faq-item">
          <h3>How is commercial cleaning priced?</h3>
          <p>Commercial quotes are built per-site, not from a rate card. Pricing depends on floor area, frequency, and scope. After a quick walkthrough we'll give you a fixed monthly figure — no surprises.</p>
        </div>
        <div className="rp-faq-item">
          <h3>Can you clean outside business hours?</h3>
          <p>Yes — most of our commercial clients prefer after-hours cleaning. We work with your building access arrangements and provide our own key or code management as needed.</p>
        </div>
        <div className="rp-faq-item">
          <h3>What if our office layout or needs change?</h3>
          <p>We adjust scope and pricing with reasonable notice. Commercial arrangements are built on a rolling basis — no long lock-in contracts.</p>
        </div>
      </section>

      <hr className="rp-divider" />

      <section className="rp-section">
        <p className="rp-h2">Get in touch</p>
        <p className="rp-body">
          Commercial enquiries start with a conversation — email or call us to discuss your space
          and we'll arrange a walkthrough at a time that suits.
        </p>
        <div className="rp-cta-group">
          <a href="mailto:pureglimsydney@gmail.com" className="rp-cta-primary">Email us →</a>
          <a href="tel:+61449963099" className="rp-cta-secondary">+61 449 963 099</a>
        </div>
        <p className="rp-body" style={{ marginTop: "20px" }}>
          Residential services:{" "}
          <Link href="/services/regular-cleaning" className="rp-link">Regular cleaning</Link>
          {" · "}
          <Link href="/services/end-of-lease" className="rp-link">End of lease</Link>
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
