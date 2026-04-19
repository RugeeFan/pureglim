"use client";

export default function PrivacyPanel({ isOpen, onClose }) {
  return (
    <div className="legal-modal privacy-modal" onClick={onClose} aria-hidden={!isOpen}>
      <div className="legal-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Privacy Policy">
        <button className="legal-close" onClick={onClose} type="button" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="legal-dialog-title">Privacy Policy</h2>
        <p className="legal-dialog-date">Last updated: April 2026</p>

        <div className="legal-body">
          <section className="legal-section">
            <h3>Information we collect</h3>
            <p>
              When you submit a booking or enquiry through our website, we collect
              the information you provide — such as your name, contact details,
              property address, and preferred service. We do not collect this
              information unless you choose to share it with us.
            </p>
          </section>

          <section className="legal-section">
            <h3>How we use your information</h3>
            <p>
              We use the information you share solely to respond to your enquiry,
              confirm your booking, and communicate service-related details. We do
              not sell, rent, or share your personal information with third parties
              for marketing purposes.
            </p>
          </section>

          <section className="legal-section">
            <h3>Data storage</h3>
            <p>
              Enquiry and booking data is stored securely and retained only as long
              as necessary to fulfil your request and meet our operational
              obligations. You may request deletion of your data at any time by
              contacting us directly.
            </p>
          </section>

          <section className="legal-section">
            <h3>Cookies and analytics</h3>
            <p>
              Our website does not use tracking cookies or advertising pixels. We
              use Vercel Analytics, a privacy-preserving tool that measures page
              visits without cookies or personal data. No browsing history,
              fingerprint, or personally identifiable information is collected.
              We may also use minimal technical cookies required for the website
              to function correctly.
            </p>
          </section>

          <section className="legal-section">
            <h3>Contact</h3>
            <p>
              If you have any questions about this policy or how we handle your
              information, please get in touch at{" "}
              <a href="mailto:hello@pureglim.com.au">hello@pureglim.com.au</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
