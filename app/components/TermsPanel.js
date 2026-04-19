"use client";

export default function TermsPanel({ isOpen, onClose }) {
  return (
    <div className="legal-modal terms-modal" onClick={onClose} aria-hidden={!isOpen}>
      <div className="legal-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Terms & Conditions">
        <button className="legal-close" onClick={onClose} type="button" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="legal-dialog-title">Terms &amp; Conditions</h2>
        <p className="legal-dialog-date">Last updated: April 2026</p>

        <div className="legal-body">
          <section className="legal-section">
            <h3>Services</h3>
            <p>
              PureGlim provides residential and light commercial cleaning services
              in the agreed service area. The scope of each visit is confirmed at
              the time of booking. We reserve the right to adjust services based
              on safety, access, or conditions at the property.
            </p>
          </section>

          <section className="legal-section">
            <h3>Bookings and scheduling</h3>
            <p>
              Bookings are confirmed once we have agreed on a date, time, and
              service scope. We will make reasonable efforts to arrive within the
              agreed time window. In cases of unforeseen circumstances, we will
              notify you as early as possible and arrange an alternative.
            </p>
          </section>

          <section className="legal-section">
            <h3>Cancellations</h3>
            <p>
              We ask for at least 24 hours notice to cancel or reschedule a
              booking. Late cancellations or no-shows may incur a cancellation
              fee, which will be communicated to you at the time of booking.
            </p>
          </section>

          <section className="legal-section">
            <h3>Payment</h3>
            <p>
              Payment terms are agreed upon booking. We accept bank transfer and
              other methods as communicated at the time of confirmation. Invoices
              are due within the agreed payment period.
            </p>
          </section>

          <section className="legal-section">
            <h3>Liability</h3>
            <p>
              We take care with every visit. In the unlikely event of accidental
              damage caused by our team, please notify us within 48 hours and we
              will work with you to resolve it fairly. We are not liable for
              pre-existing damage, items of exceptional value not disclosed prior
              to the service, or damage resulting from conditions outside our
              control.
            </p>
          </section>

          <section className="legal-section">
            <h3>Contact</h3>
            <p>
              Questions about these terms? Reach us at{" "}
              <a href="mailto:hello@pureglim.com.au">hello@pureglim.com.au</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
