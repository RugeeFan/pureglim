"use client";
import { useEffect, useRef, useState } from "react";

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

export default function AnimatedPrice({ amount }) {
  const [display, setDisplay] = useState(amount);
  const prev = useRef(amount);
  const raf = useRef(null);

  useEffect(() => {
    const from = prev.current;
    const to = amount;
    if (from === to) return;

    const duration = 500;
    const start = performance.now();
    if (raf.current) cancelAnimationFrame(raf.current);

    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(from + (to - from) * easeOutQuart(t)));
      if (t < 1) {
        raf.current = requestAnimationFrame(step);
      } else {
        prev.current = to;
      }
    }
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [amount]);

  return <strong>${display}</strong>;
}
