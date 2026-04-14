"use client";

const PARTICLES = [
  { x: 0, y: -46 },
  { x: 33, y: -33 },
  { x: 46, y: 0 },
  { x: 33, y: 33 },
  { x: 0, y: 46 },
  { x: -33, y: 33 },
  { x: -46, y: 0 },
  { x: -33, y: -33 },
];

export default function SuccessAnimation() {
  return (
    <div className="success-anim-wrap" aria-hidden="true">
      <div className="success-particles">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="success-particle"
            style={{
              "--tx": `${p.x}px`,
              "--ty": `${p.y}px`,
              animationDelay: `${0.8 + i * 0.04}s`,
            }}
          />
        ))}
      </div>
      <svg className="success-check-svg" viewBox="0 0 52 52">
        <circle className="success-check-circle" cx="26" cy="26" r="23" />
        <path className="success-check-tick" d="M15 26.5 L22 33.5 L37 18" />
      </svg>
    </div>
  );
}
