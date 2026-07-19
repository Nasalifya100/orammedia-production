"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { cn, formatCategory } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectPosterProps {
  project: Project;
  index?: number;
}

/** Orientation-aware project card — reads like a film release. */
export function ProjectPoster({ project, index = 0 }: ProjectPosterProps) {
  return (
    <Reveal variant="clip" delay={(index % 2) * 0.08}>
      <Link
        href={`/projects/${project.slug}`}
        className="group block"
        aria-label={`View ${project.title}`}
      >
        <div
          className={cn(
            "relative overflow-hidden bg-surface-2",
            project.portraitPoster ? "aspect-[3/4]" : "aspect-cinema-tall",
          )}
        >
          <Image
            src={project.thumbnail || project.posterUrl}
            alt={project.title}
            fill
            quality={88}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 46vw"
            className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-0/85 via-surface-0/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">
              {formatCategory(project.category)} · {project.year}
            </p>
            <h3 className="display display-sm mt-2 text-foreground transition-colors duration-500 group-hover:text-accent">
              {project.title}
            </h3>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
