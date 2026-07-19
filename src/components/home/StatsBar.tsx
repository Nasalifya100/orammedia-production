"use client";

import { AnimatedSection } from "@/components/ui/AnimatedSection";

const stats = [
  { value: "600+", label: "Episodes Directed", sub: "Zuba — Zambezi Magic" },
  { value: "DStv", label: "Broadcast Partner", sub: "Zambezi Magic · Showmax" },
  { value: "10K+", label: "Community Reach", sub: "Oram TV · Facebook" },
  { value: "1990", label: "Storytelling Legacy", sub: "Award-winning cinema" },
];

export function StatsBar() {
  return (
    <section className="relative border-y border-glass-border bg-charcoal-light">
      <div className="absolute inset-0 gradient-jewel opacity-40" />
      <div className="relative mx-auto grid max-w-[90rem] grid-cols-2 divide-x divide-glass-border md:grid-cols-4">
        {stats.map((stat, i) => (
          <AnimatedSection key={stat.label} delay={i * 0.1}>
            <div className="px-8 py-12 md:px-10 md:py-14 text-center md:text-left">
              <p className="font-serif text-[clamp(2rem,4vw,2.75rem)] font-light tracking-tight text-accent">
                {stat.value}
              </p>
              <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-foreground/90">
                {stat.label}
              </p>
              <p className="mt-1.5 text-xs text-muted">{stat.sub}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
