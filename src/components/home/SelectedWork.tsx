"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { cn } from "@/lib/utils";
import { formatCategory } from "@/lib/utils";
import type { Project } from "@/types";

interface SelectedWorkProps {
  projects: Project[];
}

/** Editorial featured-work rows — one release at a time, alternating. */
export function SelectedWork({ projects }: SelectedWorkProps) {
  const featured = projects
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order);

  return (
    <section id="work" className="section border-t border-line bg-surface-0">
      <Container>
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6 md:mb-24">
          <div>
            <p className="eyebrow mb-5">Selected Work</p>
            <SplitHeading
              as="h2"
              text="Recent releases"
              className="display display-lg text-foreground"
            />
          </div>
          <Link
            href="/projects"
            className="btn-ghost link-line inline-flex items-center gap-2 text-foreground"
          >
            All work
            <ArrowUpRight size={15} strokeWidth={1.5} />
          </Link>
        </div>

        <div className="flex flex-col gap-24 md:gap-40">
          {featured.map((project, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={project.id}
                className="grid items-center gap-8 md:grid-cols-12 md:gap-14"
              >
                <Reveal
                  variant="clip"
                  className={cn(
                    "md:col-span-7",
                    flip && "md:order-2 md:col-start-6",
                  )}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group relative block overflow-hidden bg-surface-2"
                    aria-label={`View ${project.title}`}
                  >
                    <div
                      className={cn(
                        "relative",
                        project.portraitPoster
                          ? "mx-auto aspect-[3/4] max-w-md"
                          : "aspect-cinema-tall",
                      )}
                    >
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        quality={88}
                        sizes="(max-width: 768px) 100vw, 58vw"
                        className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                      />
                    </div>
                  </Link>
                </Reveal>

                <div
                  className={cn(
                    "md:col-span-5",
                    flip && "md:order-1 md:col-start-1 md:row-start-1",
                  )}
                >
                  <Reveal variant="up" delay={0.1}>
                    <span className="numeral text-sm text-ink-faint">
                      {String(i + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="display display-md text-foreground transition-colors hover:text-accent"
                      >
                        {project.title}
                      </Link>
                    </h3>
                    <p className="mt-3 text-sm uppercase tracking-[0.18em] text-ink-faint">
                      {formatCategory(project.category)} · {project.year}
                    </p>
                    <p className="mt-6 max-w-md leading-relaxed text-ink-dim">
                      {project.description}
                    </p>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="btn-ghost link-line mt-8 inline-flex items-center gap-2 text-foreground"
                    >
                      View project
                      <ArrowUpRight size={15} strokeWidth={1.5} />
                    </Link>
                  </Reveal>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
