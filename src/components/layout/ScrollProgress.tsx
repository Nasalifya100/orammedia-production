"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  if (reduced) return null;

  return (
    <motion.div
      className="scroll-progress fixed top-0 left-0 right-0 z-[60] h-[2px]"
      style={{ scaleX, transformOrigin: "0%" }}
      aria-hidden
    />
  );
}
