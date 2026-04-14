"use client";

export default function ContactPanel({ isOpen }) {
  return (
    <section aria-hidden={!isOpen} className="info-panel contact-panel">
      <div aria-hidden="true" className="panel-scroll-fade" />
      <div className="info-panel-shell">
        <div className="info-panel-head">
          <div>
            <h2>We&apos;re easy to reach.</h2>
          </div>
        </div>

        <div className="contact-grid">
          <a href="sms:+61449963099" className="contact-card emphasis">
            <span>SMS</span>
            <strong>+61 449 963 099</strong>
            <p>Questions, bookings, or a quick quote — just give us a SMS.</p>
          </a>

          <a href="mailto:pureglimsydney@gmail.com" className="contact-card">
            <span>Email</span>
            <strong>pureglimsydney@gmail.com</strong>
            <p>Share your property details, photos, or preferred timing and we&apos;ll take it from there.</p>
          </a>

          <a
            href="https://wa.me/61449963099"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card"
          >
            <span>WhatsApp</span>
            <strong>+61 449 963 099</strong>
            <p>Drop us a message on WhatsApp — we usually reply within the hour.</p>
          </a>

          <a
            href="https://m.me/pureglimsydney"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card"
          >
            <span>Messenger</span>
            <strong>PureGlim Sydney</strong>
            <p>Reach us on Facebook Messenger — quick questions or to get the ball rolling.</p>
          </a>

          <article className="contact-card">
            <span>Hours</span>
            <strong>Mon to Sat</strong>
            <p>8am to 6pm. We usually reply within one business day.</p>
          </article>

          <article className="contact-card wide">
            <span>Not sure where to start?</span>
            <strong>Apartments, family homes, boutique offices</strong>
            <p>
              Just send us your property size and how often you&apos;d like a visit.
              We&apos;ll suggest what fits and keep it simple from there.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
