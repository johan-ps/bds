"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "./icons";

type Slide = { src: string; alt: string };

/**
 * Wraps gallery content. Any descendant carrying `data-lightbox` with
 * `data-src` (+ optional `data-alt`) becomes clickable AND keyboard-operable
 * (give it role="button" tabIndex={0}) to open a fullscreen viewer with
 * prev/next + keyboard nav. Focus is moved into the dialog on open, trapped
 * while open, and restored to the trigger on close. In admin edit-mode the
 * editable elements call stopPropagation, so clicks select fields instead.
 */
export function Lightbox({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const move = useCallback(
    (dir: 1 | -1) =>
      setIndex((current) =>
        current === null || slides.length === 0
          ? current
          : (current + dir + slides.length) % slides.length
      ),
    [slides.length]
  );

  const openFrom = useCallback((target: HTMLElement) => {
    if (!containerRef.current) return;
    const nodes = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>("[data-lightbox]")
    );
    if (!nodes.includes(target)) return;
    triggerRef.current = target;
    setSlides(nodes.map((node) => ({ src: node.dataset.src ?? "", alt: node.dataset.alt ?? "" })));
    setIndex(nodes.indexOf(target));
  }, []);

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-lightbox]");
    if (target) openFrom(target);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-lightbox]");
    if (!target) return;
    event.preventDefault();
    openFrom(target);
  }

  // keyboard controls + body scroll lock + focus management while open
  useEffect(() => {
    if (index === null) return;

    triggerRef.current = (triggerRef.current ?? (document.activeElement as HTMLElement)) || null;
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      // restore focus to the trigger when closing
      triggerRef.current?.focus?.();
    };
  }, [index, close, move]);

  const active = index === null ? null : slides[index];

  return (
    <div onClick={handleClick} onKeyDown={handleKeyDown} ref={containerRef}>
      {children}
      {active ? (
        <div
          className="lightbox"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          ref={dialogRef}
          tabIndex={-1}
        >
          <button aria-label="Close viewer" className="icon-btn lightbox__close" ref={closeRef} type="button">
            <Icon name="close" />
          </button>
          <button
            aria-label="Previous image"
            className="icon-btn lightbox__nav lightbox__nav--prev"
            onClick={(event) => {
              event.stopPropagation();
              move(-1);
            }}
            type="button"
          >
            <Icon name="chevron-left" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt={active.alt} onClick={(event) => event.stopPropagation()} src={active.src} />
          <button
            aria-label="Next image"
            className="icon-btn lightbox__nav lightbox__nav--next"
            onClick={(event) => {
              event.stopPropagation();
              move(1);
            }}
            type="button"
          >
            <Icon name="chevron-right" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
