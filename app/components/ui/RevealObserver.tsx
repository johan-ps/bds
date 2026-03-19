"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("reveal-ready");

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        el.dataset.revealState = "visible";
      });
      return;
    }

    const observedElements = new WeakSet<HTMLElement>();
    const revealTimers = new WeakMap<HTMLElement, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            element.dataset.revealState = "visible";
            const timerId = revealTimers.get(element);

            if (timerId) {
              window.clearTimeout(timerId);
              revealTimers.delete(element);
            }

            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -8% 0px" }
    );

    const shouldStartVisible = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      return rect.top < viewportHeight * 0.92 && rect.bottom > 0;
    };

    const markVisible = (el: HTMLElement) => {
      el.dataset.revealState = "visible";
      const timerId = revealTimers.get(el);

      if (timerId) {
        window.clearTimeout(timerId);
        revealTimers.delete(el);
      }
    };

    const observeElement = (el: HTMLElement) => {
      if (observedElements.has(el)) {
        return;
      }

      observedElements.add(el);

      if (shouldStartVisible(el)) {
        markVisible(el);
        return;
      }

      el.dataset.revealState = "hidden";
      observer.observe(el);

      const timerId = window.setTimeout(() => {
        markVisible(el);
        observer.unobserve(el);
      }, 900);

      revealTimers.set(el, timerId);
    };

    const observeRevealTree = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches(".reveal")) {
        observeElement(root);
      }

      root.querySelectorAll?.<HTMLElement>(".reveal").forEach((el) => {
        observeElement(el);
      });
    };

    observeRevealTree(document);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            observeRevealTree(node);
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        el.dataset.revealState = "visible";
      });
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
