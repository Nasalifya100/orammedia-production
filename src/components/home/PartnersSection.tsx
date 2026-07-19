"use client";

import Image from "next/image";
import type { ClientLogo } from "@/types";
import { Container } from "@/components/ui/Container";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface PartnersSectionProps {
  logos: ClientLogo[];
  variant?: "full" | "compact";
}

function PartnerLogo({
  client,
  className = "",
}: {
  client: ClientLogo;
  className?: string;
}) {
  const inner = (
    <div
      className={`group relative flex h-[72px] w-full max-w-[200px] items-center justify-center px-4 ${className}`}
    >
      <div className="relative h-12 w-full md:h-14">
        <Image
          src={client.logoSrc}
          alt={client.name}
          fill
          sizes="200px"
          className={`object-contain object-center transition-opacity duration-500 ${
            client.monochrome
              ? "opacity-55 brightness-0 invert group-hover:opacity-100"
              : "opacity-70 group-hover:opacity-100"
          }`}
        />
      </div>
    </div>
  );

  if (client.url) {
    return (
      <a
        href={client.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={client.name}
        className="flex justify-center"
      >
        {inner}
      </a>
    );
  }

  return <div className="flex justify-center">{inner}</div>;
}

export function PartnersSection({
  logos,
  variant = "full",
}: PartnersSectionProps) {
  if (variant === "compact") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-10 md:gap-x-14">
        {logos.map((client) => (
          <PartnerLogo key={client.id} client={client} />
        ))}
      </div>
    );
  }

  return (
    <section className="section-sg border-y border-glass-border bg-black">
      <Container>
        <AnimatedSection className="text-center">
          <p className="text-eyebrow mb-4">Partnerships</p>
          <h2 className="sg-dual-heading">
            <span className="base">From </span>
            <span className="highlight">Zambezi Magic</span>
            <span className="base"> to Showmax</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Our partnerships span industry leaders across broadcast, streaming,
            government, and independent production across Southern Africa.
          </p>
        </AnimatedSection>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-12">
          {logos.map((client) => (
            <PartnerLogo key={client.id} client={client} className="mx-auto" />
          ))}
        </div>
      </Container>
    </section>
  );
}
