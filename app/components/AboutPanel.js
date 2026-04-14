"use client";

export default function AboutPanel({ isOpen }) {
  return (
    <section aria-hidden={!isOpen} className="info-panel about-panel">
      <div aria-hidden="true" className="panel-scroll-fade" />
      <div className="info-panel-shell">
        <div className="info-panel-head">
          <div>
            <h2>We take care of the home. You don&apos;t have to think about it.</h2>
          </div>
        </div>

        <div className="about-grid">
          <article className="about-lead-card">
            <p>
              PureGlim is for people who want their home to feel good without it
              becoming something to manage. We work quietly, consistently, and
              around your life — not the other way around.
            </p>
          </article>

          <article className="about-stat-card">
            <strong>Soft finish</strong>
            <span>We care about how a space feels, not just that the surfaces were wiped.</span>
          </article>

          <article className="about-stat-card">
            <strong>Reliable rhythm</strong>
            <span>Regular visits that fit your schedule and keep your home in easy shape.</span>
          </article>

          <article className="about-stat-card wide">
            <strong>Built for how you actually live</strong>
            <span>
              Whether it&apos;s a compact apartment or a family home, we adapt to your
              space and keep things running quietly in the background.
            </span>
          </article>
        </div>
      </div>
    </section>
  );
}
