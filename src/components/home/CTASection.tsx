import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { MagneticButton } from "@/components/motion/MagneticButton";

export function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-surface-0">
      <ParallaxMedia className="absolute inset-0" strength={12}>
        <Image
          src="/projects/inkondo-billboard.jpg"
          alt="Inkondo production still (decorative background)"
          fill
          quality={88}
          sizes="100vw"
          className="object-cover opacity-30"
          aria-hidden
        />
      </ParallaxMedia>
      <div className="absolute inset-0 bg-gradient-to-b from-surface-0/85 via-surface-0/70 to-surface-0/90" />

      <Container className="relative z-10 py-32 text-center md:py-48">
        <p className="eyebrow eyebrow-accent mb-8">Let&apos;s collaborate</p>
        <SplitHeading
          as="h2"
          text="Ready to tell your story?"
          className="display display-xl justify-center text-foreground"
        />
        <Reveal variant="up" delay={0.15}>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-ink-dim">
            Tell us about the series, feature or film you need made in Zambia.
            We work from Lusaka — Chainama.
          </p>
          <MagneticButton className="mt-12">
            <Link href="/contact" className="btn btn-primary">
              Start a Project
              <ArrowUpRight size={15} strokeWidth={1.5} />
            </Link>
          </MagneticButton>
        </Reveal>
      </Container>
    </section>
  );
}
