import Image from "next/image";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export function MissionStatement() {
  return (
    <section className="relative section-premium overflow-hidden bg-black">
      <div className="absolute inset-0 gradient-jewel opacity-30" />
      <div className="relative mx-auto max-w-[90rem] px-6 lg:px-10">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <AnimatedSection>
              <span className="accent-line" />
              <p className="text-eyebrow mb-8">Our Mission</p>
            </AnimatedSection>

            <AnimatedSection delay={0.12}>
              <blockquote className="text-display text-display-md max-w-xl text-foreground">
                Original content that captivates audiences across TV and digital
                platforms.
              </blockquote>
            </AnimatedSection>

            <AnimatedSection delay={0.24}>
              <p className="mt-8 max-w-lg text-base leading-relaxed text-muted md:text-lg">
                Celebrating diversity and weaving together the threads of human
                experience — from acclaimed dramas on Zambezi Magic to feature films
                and government campaigns across Zambia.
              </p>
              <Link href="/about" className="btn-premium-ghost mt-10 inline-block">
                Our Story →
              </Link>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.18} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden md:aspect-[3/4]">
              <Image
                src="/about/mwape-multichoice-awards.jpg"
                alt="Mwape family at MultiChoice Zambia Film and Television Awards"
                fill
                className="img-premium object-cover transition-transform duration-[1.2s] hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute inset-0 vignette opacity-60" />
            </div>
            <div className="absolute -bottom-4 -left-4 hidden h-24 w-24 border border-accent/20 md:block" aria-hidden />
            <div className="absolute -top-4 -right-4 hidden h-16 w-16 border border-glass-border-strong md:block" aria-hidden />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
