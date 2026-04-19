"use client";

import { faqs } from "../data/faqData";

export default function FaqPanel({ isOpen, onClose }) {
  return (
    <div className="legal-modal faq-modal" onClick={onClose} aria-hidden={!isOpen}>
      <div className="legal-dialog faq-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="FAQ">
        <button className="legal-close" onClick={onClose} type="button" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="legal-dialog-title">FAQ</h2>
        <p className="legal-dialog-date">Pricing, inclusions, and how it all works</p>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <section key={i} className="faq-item">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
