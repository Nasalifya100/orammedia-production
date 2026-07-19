import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { Service } from "@/types";

interface WhatWeDoSectionProps {
  services: Service[];
}

/** What We Do — stainedglass.tv dual-heading service pillars */
export function WhatWeDoSection({ services }: WhatWeDoSectionProps) {
  const pillars = [
    {
      highlight: "Connect People",
      base: "to stories",
      body: services[0]?.description ??
        "Develop and produce broadcast-quality original content for audiences across TV and digital platforms.",
      href: `/services/${services[0]?.slug ?? "production"}`,
      cta: "Our Production Services",
    },
    {
      highlight: "Help Brands",
      base: "connect to people",
      body: services[2]?.description ??
        "Assist brands and ministries through event coverage, documentary film, and story-driven branded content.",
      href: `/services/${services[2]?.slug ?? "post-production"}`,
      cta: "Branded Content",
    },
  ];

  return (
    <section className="section-sg border-y border-glass-border bg-charcoal-light">
      <div className="sg-container">
        <AnimatedSection className="mb-14 text-center md:mb-20">
          <p className="text-eyebrow mb-4">What We Do</p>
          <h2 className="sg-dual-heading">
            <span className="highlight">What</span>{" "}
            <span className="base">We Do</span>
          </h2>
        </AnimatedSection>

        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          {pillars.map((pillar, i) => (
            <AnimatedSection key={pillar.highlight} delay={i * 0.1}>
              <div className="card-editorial h-full p-10 md:p-12">
                <h3 className="sg-dual-heading text-[clamp(1.25rem,2.5vw,1.75rem)]">
                  <span className="highlight">{pillar.highlight}</span>{" "}
                  <span className="base">{pillar.base}</span>
                </h3>
                <p className="mt-6 text-sm leading-[1.85] text-muted md:text-base">
                  {pillar.body}
                </p>
                <Link href={pillar.href} className="btn-sg-accent mt-10 inline-flex">
                  {pillar.cta}
                </Link>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
