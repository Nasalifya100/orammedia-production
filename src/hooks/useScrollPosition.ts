"use client";

import { useEffect, useState } from "react";

/**
 * Tracks whether the page has scrolled past a threshold (for header state).
 * Only updates state when the boolean flips, so it never causes per-frame
 * re-renders. Use Framer `useScroll`/`useTransform` for continuous parallax.
 */
export function useScrollPosition(threshold = 40) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setIsScrolled((prev) => {
        const next = window.scrollY > threshold;
        return prev === next ? prev : next;
      });
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return { isScrolled };
}
