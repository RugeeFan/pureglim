"use client";

import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { services } from "../data/constants";

export default function ServicesPanel({ isOpen, onSelectService }) {
  const primaryService = services[0];
  const secondaryServices = services.slice(1);

  return (
    <section aria-hidden={!isOpen} className="services-panel">
      <div aria-hidden="true" className="panel-scroll-fade" />
      <div className="services-panel-shell">
        <div className="services-panel-head">
          <div className="services-head-copy">
            <h2>Find the clean that fits.</h2>
            <p>
              Three services. Regular home care, a thorough handover clean, or
              workspace support — nothing more complicated than that.
            </p>
          </div>
        </div>

        <section className="service-spotlight">
          <article className="service-feature-card">
            <div className="service-feature-copy">
              <span className="service-card-badge">{primaryService.badge}</span>
              <h3>{primaryService.title}</h3>
              <p>{primaryService.description}</p>

              <div className="service-feature-highlights">
                {primaryService.highlights.map((item) => (
                  <span key={item}>
                    <CheckCircle2 size={16} />
                    {item}
                  </span>
                ))}
              </div>

              <div className="service-feature-actions">
                <button
                  className="primary-button"
                  onClick={() => onSelectService(primaryService.id)}
                  type="button"
                >
                  {primaryService.ctaLabel}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </article>
        </section>

        <section className="service-grid">
          {secondaryServices.map((service) => (
            <article className={`service-detail-card ${service.tone}`} key={service.id}>
              <div className="service-detail-card-head">
                <span className="service-card-badge">{service.badge}</span>
              </div>

              <div className="service-detail-card-copy">
                <h3>{service.title}</h3>
                <p>{service.cardDescription}</p>
              </div>

              <ul className="service-bullet-list">
                {service.included.slice(0, 4).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              {service.guarantee ? (
                <div className="service-guarantee-card">
                  <span>{service.guarantee.label}</span>
                  <strong>{service.guarantee.title}</strong>
                </div>
              ) : null}

              {service.commercialUseCases ? (
                <div className="service-use-case-row">
                  {service.commercialUseCases.slice(0, 4).map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              ) : null}

              <div className="service-card-actions">
                <button
                  className="secondary-button"
                  onClick={() => onSelectService(service.id)}
                  type="button"
                >
                  {service.learnMoreLabel}
                  <ArrowUpRight size={16} />
                </button>
                <button
                  className="ghost-button service-card-cta"
                  onClick={() => onSelectService(service.id)}
                  type="button"
                >
                  {service.ctaLabel}
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="services-bottom-note">
          <div>
            <p>
              Pick the service that fits and we&apos;ll walk you through it. Regular and
              end-of-lease cleans come with a quick online estimate. Commercial spaces
              get a tailored proposal.
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}
