"use client";

import { useRef, type ReactNode } from "react";
import { Icon } from "./icons";

/** Horizontal snap carousel with prev/next controls. */
export function Carousel({
  children,
  ariaLabel = "Carousel",
}: {
  children: ReactNode;
  ariaLabel?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const amount = Math.max(track.clientWidth * 0.7, 260);
    track.scrollBy({ left: amount * direction, behavior: "smooth" });
  }

  return (
    <div className="carousel">
      <div className="carousel__nav">
        <button
          aria-label="Previous"
          className="icon-btn"
          onClick={() => scrollBy(-1)}
          type="button"
        >
          <Icon name="chevron-left" />
        </button>
        <button
          aria-label="Next"
          className="icon-btn"
          onClick={() => scrollBy(1)}
          type="button"
        >
          <Icon name="chevron-right" />
        </button>
      </div>
      <div aria-label={ariaLabel} className="carousel__track" ref={trackRef} role="group">
        {children}
      </div>
    </div>
  );
}
