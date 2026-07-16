import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/** Editorial statement — typography is the focus. */
export function ManifestoSection() {
  return (
    <section id="studio" className="section bg-surface-0">
      <Container>
        <p className="eyebrow mb-12">The Studio</p>

        <div className="max-w-6xl">
          <Reveal variant="clip">
            <p className="display display-md text-foreground">
              We are Oram Media Dynamics — a Lusaka production company led by
              director{" "}
              <span className="display-italic text-accent">Owas Ray Mwape</span>.
              We shoot the dramas and features Zambian audiences watch on
              Zambezi Magic, DStv and Showmax.
            </p>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-10 border-t border-line pt-14 md:grid-cols-[1fr_1.4fr] md:gap-24">
          <Reveal variant="up">
            <p className="eyebrow">Lusaka</p>
          </Reveal>
          <Reveal variant="up" delay={0.1}>
            <div className="max-w-2xl">
              <p className="text-lg leading-relaxed text-ink-dim">
                From Inkondo and Zuba on Zambezi Magic to independent features
                Graft and Look in the Mirror, the work is made here — with local
                crews, local casts, and delivery into MultiChoice and
                institutional channels.
              </p>
              <Link
                href="/about"
                className="btn-ghost link-line mt-8 inline-flex items-center gap-2 text-foreground"
              >
                Our story
                <ArrowUpRight size={15} strokeWidth={1.5} />
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
