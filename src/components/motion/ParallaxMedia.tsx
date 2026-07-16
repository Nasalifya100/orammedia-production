"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxMediaProps {
  children: ReactNode;
  className?: string;
  /** Vertical travel in percent of element height */
  strength?: number;
}

/**
 * Scroll-linked parallax using transforms only (no React state re-renders).
 * The inner layer is oversized so travel never reveals edges.
 */
export function ParallaxMedia({
  children,
  className,
  strength = 14,
}: ParallaxMediaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${strength}%`, `${strength}%`],
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={reduced ? undefined : { y }}
      >
        <div className="absolute inset-[-18%]">{children}</div>
      </motion.div>
    </div>
  );
}
