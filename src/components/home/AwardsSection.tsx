import { Award as AwardIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { Award } from "@/types";

interface AwardsSectionProps {
  awards: Award[];
}

export function AwardsSection({ awards }: AwardsSectionProps) {
  return (
    <section className="section-sg bg-black">
      <Container>
        <AnimatedSection className="text-center">
          <p className="text-eyebrow mb-4">Recognition</p>
          <h2 className="sg-dual-heading">
            <span className="highlight">Awards</span>{" "}
            <span className="base">&amp; Accolades</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Honoured by festivals and industry bodies for excellence in Zambian
            storytelling.
          </p>
        </AnimatedSection>

        <div className="mt-14 grid gap-px border border-glass-border bg-glass-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {awards.map((award, index) => (
            <AnimatedSection key={award.id} delay={index * 0.07}>
              <div className="group flex h-full flex-col items-center bg-black p-8 text-center transition-colors duration-500 hover:bg-charcoal-light">
                <div className="mb-5 border border-[var(--sg-gold)]/20 p-4">
                  <AwardIcon size={26} className="text-[var(--sg-gold)]" strokeWidth={1.25} />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground md:text-base">
                  {award.name}
                </h3>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[var(--sg-gold)]">
                  {award.year}
                </p>
                <p className="mt-2 text-xs text-muted">{award.organization}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
