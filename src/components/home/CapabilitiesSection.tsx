"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import type { Service } from "@/types";

interface CapabilitiesSectionProps {
  services: Service[];
}

/** Capabilities as an editorial index — hairline rows, hover reveal. */
export function CapabilitiesSection({ services }: CapabilitiesSectionProps) {
  return (
    <section id="capabilities" className="section border-t border-line bg-surface">
      <Container>
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-24">
          <div>
            <p className="eyebrow mb-5">Capabilities</p>
            <SplitHeading
              as="h2"
              text="End to end, in-house."
              className="display display-lg text-foreground"
            />
            <p className="mt-8 max-w-sm leading-relaxed text-ink-dim">
              From first treatment to final grade, we handle the whole
              production lifecycle at broadcast standard.
            </p>
          </div>

          <div className="border-t border-line">
            {services.map((service, i) => (
              <Reveal key={service.id} variant="up" delay={i * 0.05}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex items-start gap-6 border-b border-line py-8 transition-colors hover:bg-ink/[0.02] md:py-10"
                >
                  <span className="numeral pt-2 text-sm text-ink-faint">
                    0{i + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="display display-sm text-foreground transition-colors group-hover:text-accent">
                      {service.title}
                    </h3>
                    <p className="mt-3 max-w-xl leading-relaxed text-ink-dim">
                      {service.description}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={22}
                    strokeWidth={1.25}
                    className="mt-2 shrink-0 -translate-x-2 text-ink-faint opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:text-accent group-hover:opacity-100"
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
