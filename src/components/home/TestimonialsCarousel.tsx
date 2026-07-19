"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { Testimonial } from "@/types";

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialsCarousel({
  testimonials,
}: TestimonialsCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () =>
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  const testimonial = testimonials[current];

  return (
    <section className="section-premium relative border-y border-glass-border bg-charcoal-light">
      <div className="absolute inset-0 gradient-jewel opacity-20" />
      <Container className="relative">
        <AnimatedSection className="text-center">
          <span className="accent-line accent-line-center" />
          <p className="text-eyebrow mb-4">Client Voices</p>
          <h2 className="text-display text-display-md text-foreground">
            What They Say
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="relative mx-auto mt-16 max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -28 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <blockquote className="font-serif text-[clamp(1.5rem,3.5vw,2.75rem)] font-light italic leading-snug text-foreground/95">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="mt-10 flex items-center justify-center gap-5">
                  <div className="relative h-14 w-14 overflow-hidden ring-1 ring-glass-border-strong">
                    <Image
                      src={testimonial.photo}
                      alt={testimonial.clientName}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium tracking-wide text-foreground">
                      {testimonial.clientName}
                    </p>
                    <p className="text-xs uppercase tracking-[0.15em] text-muted">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-14 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonial"
                className="flex h-11 w-11 items-center justify-center border border-glass-border text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <ChevronLeft size={18} strokeWidth={1.25} />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrent(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`h-px transition-all duration-500 ${
                      i === current
                        ? "w-10 bg-accent"
                        : "w-6 bg-muted/25 hover:bg-muted/45"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="flex h-11 w-11 items-center justify-center border border-glass-border text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <ChevronRight size={18} strokeWidth={1.25} />
              </button>
            </div>
          </div>
        </AnimatedSection>
      </Container>
    </section>
  );
}
