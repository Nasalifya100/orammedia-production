import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import type { TeamMember } from "@/types";

interface FounderSectionProps {
  members: TeamMember[];
}

/** Founder feature — the person behind the work is the focus. */
export function FounderSection({ members }: FounderSectionProps) {
  const founder =
    members.find((m) => /director|ceo|founder/i.test(m.role)) ?? members[0];
  if (!founder) return null;

  return (
    <section className="section border-t border-line bg-surface">
      <Container>
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <Reveal variant="scale" className="order-2 md:order-1">
            <ParallaxMedia
              className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden bg-surface-2"
              strength={8}
            >
              <Image
                src={founder.photo}
                alt={founder.name}
                fill
                quality={90}
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </ParallaxMedia>
          </Reveal>

          <div className="order-1 md:order-2">
            <Reveal variant="up">
              <p className="eyebrow mb-6">Founder &amp; Director</p>
              <h2 className="display display-lg text-foreground">
                {founder.name}
              </h2>
              <p className="mt-4 text-sm uppercase tracking-[0.18em] text-ink-faint">
                Best Actor 1990–1992 · Director
              </p>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink-dim">
                {founder.bio}
              </p>
              <Link
                href="/about"
                className="btn-ghost link-line mt-8 inline-flex items-center gap-2 text-foreground"
              >
                Meet the studio
                <ArrowUpRight size={15} strokeWidth={1.5} />
              </Link>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
