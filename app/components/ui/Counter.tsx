"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up to the numeric portion of `value` when scrolled into view.
 * Preserves any prefix/suffix (e.g. "1,200+", "$185", "25+"). Non-numeric
 * values ("All ages") render as-is. Respects prefers-reduced-motion.
 */
export function Counter({ value, duration = 1400 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/[\d,.]+/);
  const target = match ? Number(match[0].replace(/,/g, "")) : null;
  const [display, setDisplay] = useState(target === null ? value : formatLike(0, match![0]));
  const done = useRef(false);

  useEffect(() => {
    if (target === null) return;

    const node = ref.current;
    if (!node) return;

    const finish = () => setDisplay(value);

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      const id = requestAnimationFrame(finish);
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || done.current) return;
          done.current = true;
          observer.disconnect();

          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            const current = Math.round(target * eased);
            setDisplay(value.replace(match![0], formatLike(current, match![0])));
            if (t < 1) requestAnimationFrame(tick);
            else finish();
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, target, duration, match]);

  return <span ref={ref}>{display}</span>;
}

function formatLike(n: number, sample: string) {
  if (sample.includes(",")) return n.toLocaleString("en-US");
  return String(n);
}
