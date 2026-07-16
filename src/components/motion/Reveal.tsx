"use client";

import { type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
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

/** Variant-driven scroll reveal. Falls back to instant render for reduced motion. */
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

  if (reduced) return <motion.div {...props}>{children}</motion.div>;

  return (
    <motion.div
      variants={build(variant)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
