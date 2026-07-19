import Image from "next/image";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { TeamMember } from "@/types";

interface TeamPreviewSectionProps {
  members: TeamMember[];
}

/** Team preview — stainedglass.tv “Our Dedicated Team” */
export function TeamPreviewSection({ members }: TeamPreviewSectionProps) {
  return (
    <section className="section-sg bg-black">
      <div className="sg-container">
        <AnimatedSection className="text-center">
          <p className="text-eyebrow mb-4">Oram Media Dynamics</p>
          <h2 className="sg-dual-heading">
            <span className="highlight">Our</span>{" "}
            <span className="base">Dedicated Team</span>
          </h2>
        </AnimatedSection>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {members.map((member, i) => (
            <AnimatedSection key={member.id} delay={i * 0.08}>
              <article className="group text-center">
                <div className="relative mx-auto aspect-[3/4] max-w-[280px] overflow-hidden">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="img-premium object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="280px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
                <h3 className="mt-6 text-lg font-semibold uppercase tracking-wide text-foreground">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--sg-gold)]">
                  {member.role}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted line-clamp-4">
                  {member.bio}
                </p>
                <Link href="/about" className="btn-sg-ghost mt-5 inline-block">
                  Read More
                </Link>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
