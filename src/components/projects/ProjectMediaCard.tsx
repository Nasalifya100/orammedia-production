"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { formatCategory } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectMediaCardProps {
  project: Project;
  index?: number;
  sizes?: string;
  showIndex?: boolean;
  showDescription?: boolean;
  onPlay: (project: Project) => void;
  priority?: boolean;
}

export function ProjectMediaCard({
  project,
  index = 0,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  showIndex = true,
  showDescription = true,
  onPlay,
  priority = false,
}: ProjectMediaCardProps) {
  const [hovered, setHovered] = useState(false);
  const previewId = project.previewYoutubeId ?? project.youtubeId;
  const hasPreview = Boolean(previewId || project.videoUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.75, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <article
        className="group block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative aspect-cinema overflow-hidden bg-charcoal-elevated vignette-strong">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            priority={priority}
            className={`img-premium object-cover transition-all duration-[850ms] ease-out ${
              hovered && previewId ? "scale-105 opacity-0" : "scale-100 opacity-100"
            }`}
            sizes={sizes}
          />

          {hovered && previewId && (
            <div className="absolute inset-0 z-10 overflow-hidden">
              <YouTubeEmbed
                videoId={previewId}
                preview
                title={`${project.title} preview`}
                className="h-full w-full scale-[1.35] object-cover"
              />
            </div>
          )}

          <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />
          <div className="absolute inset-0 z-20 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />

          {showIndex && (
            <div className="absolute top-5 left-5 z-30 font-mono text-[10px] tracking-widest text-accent/60">
              {String(index + 1).padStart(2, "0")}
            </div>
          )}

          {hasPreview && (
            <button
              type="button"
              onClick={() => onPlay(project)}
              aria-label={`Play ${project.title} trailer`}
              className="absolute inset-0 z-30 flex items-center justify-center opacity-0 transition-opacity duration-400 group-hover:opacity-100"
            >
              <span className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-white/25 bg-black/40 backdrop-blur-md transition-transform duration-400 hover:scale-105">
                <Play size={22} className="ml-0.5 text-white" fill="white" />
              </span>
            </button>
          )}

          <Link
            href={`/projects/${project.slug}`}
            className="absolute top-5 right-5 z-30 translate-y-2 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100"
            aria-label={`Open ${project.title} project page`}
          >
            <ArrowUpRight size={18} className="text-accent" strokeWidth={1.25} />
          </Link>

          <div className="absolute bottom-0 left-0 right-0 z-30 p-6 md:p-7">
            <p className="text-[9px] uppercase tracking-[0.28em] text-accent">
              {formatCategory(project.category)} · {project.year}
            </p>
            <Link href={`/projects/${project.slug}`}>
              <h3 className="mt-2 text-base font-semibold uppercase tracking-wide text-foreground transition-colors duration-300 hover:text-[var(--sg-gold)] md:text-lg">
                {project.title}
              </h3>
            </Link>
            {showDescription && (
              <p className="mt-2 line-clamp-2 max-h-0 overflow-hidden text-sm text-foreground/50 opacity-0 transition-all duration-400 group-hover:max-h-12 group-hover:opacity-100">
                {project.description}
              </p>
            )}
          </div>
        </div>
      </article>
    </motion.div>
  );
}
