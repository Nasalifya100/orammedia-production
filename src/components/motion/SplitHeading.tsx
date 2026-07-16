"use client";

import { type ElementType } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SplitHeadingProps {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Per-word stagger step in seconds */
  stagger?: number;
  once?: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Word-by-word line-mask reveal for editorial headlines.
 * Each word rises from behind a clipped line. Semantic tag stays intact.
 */
export function SplitHeading({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.055,
  once = true,
}: SplitHeadingProps) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={cn("flex flex-wrap", className)} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="mr-[0.28em] inline-flex overflow-hidden pb-[0.12em]"
          aria-hidden
        >
          <motion.span
            className="inline-block"
            initial={{ y: "115%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once, amount: 0.6 }}
            transition={{ duration: 0.85, ease: EASE, delay: delay + i * stagger }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
