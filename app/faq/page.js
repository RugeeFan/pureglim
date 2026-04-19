import VideoShell from "../components/VideoShell";
import Link from "next/link";
import { faqs, faqSchema } from "../data/faqData";

export const metadata = {
  title: "Cleaning Services FAQ",
  description:
    "Get an estimate online. Answers to common questions about home cleaning with PureGlim — pricing, what's included, booking, and service areas across Sydney.",
};

export default function FAQPage() {
  return (
    <VideoShell>
      <div className="rp-header">
        <Link href="/" className="rp-back">← PureGlim</Link>
        <Link href="/?booking=true" className="rp-top-cta">Book a clean →</Link>
      </div>

      <p className="rp-eyebrow">Help &amp; information</p>
      <h1 className="rp-h1">Frequently asked questions</h1>
      <p className="rp-intro">
        Everything you need to know about booking a clean with PureGlim — pricing, what's included, how we work, and our service areas across Sydney.
      </p>

      <div>
        {faqs.map((faq, i) => (
          <div key={i} className="rp-faq-item">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>

      <hr className="rp-divider" />

      <div className="rp-section">
        <p className="rp-h2">Ready to book?</p>
        <p className="rp-body">
          Get an instant quote online or call us directly — we're available seven days a week.
        </p>
        <div className="rp-cta-group">
          <Link href="/?booking=true" className="rp-cta-primary">Book a clean →</Link>
          <a href="tel:+61449963099" className="rp-cta-secondary">+61 449 963 099</a>
        </div>
        <p className="rp-body" style={{ marginTop: "20px" }}>
          Browse our service areas:{" "}
          <Link href="/locations/eastern-suburbs" className="rp-link">Eastern Suburbs</Link>
          {" · "}
          <Link href="/locations/northern-suburbs" className="rp-link">Lower North Shore</Link>
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </VideoShell>
  );
}
