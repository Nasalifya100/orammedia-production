"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useInView,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";

type RevealVariant = "up" | "fade" | "clip" | "blur" | "scale" | "left";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const build = (variant: RevealVariant): Variants => {
  switch (variant) {
    case "fade":
      return { hidden: { opacity: 0 }, show: { opacity: 1 } };
    case "clip":
      return {
        hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
        show: { opacity: 1, clipPath: "inset(0 0 0% 0)" },
      };
    case "blur":
      return {
        hidden: { opacity: 0, filter: "blur(10px)", y: 16 },
        show: { opacity: 1, filter: "blur(0px)", y: 0 },
      };
    case "scale":
      return {
        hidden: { opacity: 0, scale: 0.965 },
        show: { opacity: 1, scale: 1 },
      };
    case "left":
      return { hidden: { opacity: 0, x: 32 }, show: { opacity: 1, x: 0 } };
    case "up":
    default:
      return { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0 } };
  }
};

function intersectionRatio(el: HTMLElement, amount: number): boolean {
  const rect = el.getBoundingClientRect();
  if (rect.height <= 0) return false;
  const vh = window.innerHeight;
  const visiblePx = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
  return visiblePx / rect.height >= amount;
}

/**
 * Scroll reveal driven by viewport visibility.
 * Lenis smooth scroll does not emit native scroll events — SmoothScroll
 * re-dispatches them so IntersectionObserver (and this component) stay in sync.
 */
export function Reveal({
  children,
  variant = "up",
  delay = 0,
  duration = 0.9,
  once = true,
  amount = 0.35,
  ...props
}: RevealProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount });
  const [scrollVisible, setScrollVisible] = useState(false);
  const visible = reduced || inView || scrollVisible;

  useEffect(() => {
    if (reduced || visible) return;

    const el = ref.current;
    if (!el) return;

    const check = () => {
      if (intersectionRatio(el, amount)) setScrollVisible(true);
    };

    check();
    const afterTransition = window.setTimeout(check, 700);

    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });

    return () => {
      window.clearTimeout(afterTransition);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [amount, reduced, visible]);

  if (reduced) {
    const { className, id } = props;
    return (
      <div ref={ref} className={className} id={id}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      variants={build(variant)}
      initial="hidden"
      animate={visible ? "show" : "hidden"}
      transition={{ duration, delay, ease: EASE }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
