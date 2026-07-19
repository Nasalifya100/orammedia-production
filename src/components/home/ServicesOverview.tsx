import Link from "next/link";
import { Clapperboard, Camera, Film, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { Service } from "@/types";

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  clapperboard: Clapperboard,
  camera: Camera,
  film: Film,
};

interface ServicesOverviewProps {
  services: Service[];
}

export function ServicesOverview({ services }: ServicesOverviewProps) {
  return (
    <section className="section-premium relative bg-charcoal-light">
      <div className="absolute inset-0 gradient-jewel opacity-25" />
      <Container className="relative">
        <AnimatedSection>
          <SectionHeading
            eyebrow="What We Do"
            title="End-to-End Production"
            description="From first treatment to final delivery — every stage handled with cinematic precision and broadcast-ready quality."
            align="center"
          />
        </AnimatedSection>

        <div className="grid gap-px bg-glass-border md:grid-cols-3">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] ?? Clapperboard;
            return (
              <AnimatedSection key={service.id} delay={index * 0.12}>
                <div className="group flex h-full flex-col bg-charcoal-light p-10 md:p-12 card-editorial border-0">
                  <div className="mb-8 inline-flex border border-accent/20 p-3.5">
                    <Icon size={22} className="text-accent" />
                  </div>
                  <p className="font-mono text-[10px] text-accent/60">
                    0{index + 1}
                  </p>
                  <h3 className="mt-3 font-serif text-2xl font-light text-foreground md:text-3xl">
                    {service.title}
                  </h3>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted md:text-base">
                    {service.description}
                  </p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="mt-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-accent transition-all group-hover:gap-3"
                  >
                    Learn More
                    <ArrowRight size={14} strokeWidth={1.25} />
                  </Link>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
