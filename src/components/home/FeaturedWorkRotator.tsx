"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { ProjectVideoModal } from "@/components/projects/ProjectVideoModal";
import { formatCategory } from "@/lib/utils";
import type { Project } from "@/types";

const ROTATE_MS = 6500;

interface FeaturedWorkRotatorProps {
  projects: Project[];
}

/** Auto-rotating cinematic showcase — cycles all featured productions */
export function FeaturedWorkRotator({ projects }: FeaturedWorkRotatorProps) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [paused, setPaused] = useState(false);

  const current = projects[index];
  const previewId = current?.previewYoutubeId ?? current?.youtubeId;

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => (i + dir + projects.length) % projects.length);
    },
    [projects.length],
  );

  useEffect(() => {
    if (paused || hovered || projects.length <= 1) return;
    const timer = window.setInterval(() => go(1), ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [paused, hovered, go, projects.length]);

  if (!current) return null;

  return (
    <>
      <article
        className="group relative block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="relative aspect-cinema w-full overflow-hidden vignette-strong bg-black">
          <AnimatePresence mode="sync">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={current.thumbnail}
                alt={current.title}
                fill
                className={`img-premium object-cover transition-opacity duration-700 ${
                  hovered && previewId ? "opacity-0" : "opacity-100"
                }`}
                sizes="100vw"
                priority={index === 0}
              />
            </motion.div>
          </AnimatePresence>

          {hovered && previewId && (
            <div className="absolute inset-0 z-10">
              <YouTubeEmbed
                videoId={previewId}
                preview
                title={`${current.title} preview`}
                className="h-full w-full scale-[1.35]"
              />
            </div>
          )}

          <div className="absolute inset-0 z-20 bg-gradient-to-t from-black via-black/25 to-black/35" />

          {(previewId || current.videoUrl) && (
            <button
              type="button"
              onClick={() => setModalProject(current)}
              aria-label={`Play ${current.title} trailer`}
              className="absolute inset-0 z-30 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            >
              <span className="flex h-24 w-24 items-center justify-center rounded-full border border-white/25 bg-black/35 backdrop-blur-md transition-transform duration-500 hover:scale-105">
                <Play size={34} className="ml-1 text-white" fill="white" />
              </span>
            </button>
          )}

          {/* Side controls */}
          {projects.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous project"
                className="absolute left-4 top-1/2 z-40 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/10 bg-black/30 text-foreground/80 backdrop-blur-sm transition-colors hover:border-accent hover:text-accent md:left-8"
              >
                <ChevronLeft size={20} strokeWidth={1.25} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next project"
                className="absolute right-4 top-1/2 z-40 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/10 bg-black/30 text-foreground/80 backdrop-blur-sm transition-colors hover:border-accent hover:text-accent md:right-8"
              >
                <ChevronRight size={20} strokeWidth={1.25} />
              </button>
            </>
          )}

          <div className="absolute bottom-0 left-0 right-0 z-30 p-8 md:p-16 lg:p-20">
            <div className="sg-container">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="text-[10px] uppercase tracking-[0.3em] text-accent">
                    Featured — {formatCategory(current.category)} · {current.year}
                  </span>
                  <Link href={`/projects/${current.slug}`}>
                    <h3 className="mt-4 text-display text-[clamp(2.5rem,7vw,5.5rem)] text-foreground transition-colors duration-300 hover:text-accent">
                      {current.title}
                    </h3>
                  </Link>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/55 md:text-base">
                    {current.description}
                  </p>
                  <Link
                    href={`/projects/${current.slug}`}
                    className="btn-sg-ghost mt-8 inline-flex items-center gap-2"
                  >
                    View Project <ArrowUpRight size={14} />
                  </Link>
                </motion.div>
              </AnimatePresence>

              {projects.length > 1 && (
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  {projects.map((p, i) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Show ${p.title}`}
                      aria-current={i === index ? "true" : undefined}
                      className={`group/dot relative h-12 w-16 overflow-hidden border transition-all duration-500 md:h-14 md:w-20 ${
                        i === index
                          ? "border-accent ring-1 ring-accent/40"
                          : "border-white/15 opacity-50 hover:opacity-90"
                      }`}
                    >
                      <Image
                        src={p.thumbnail}
                        alt={p.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                  <span className="ml-auto hidden text-[10px] uppercase tracking-[0.25em] text-muted/60 md:inline">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(projects.length).padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>

      <ProjectVideoModal
        project={modalProject}
        onClose={() => setModalProject(null)}
      />
    </>
  );
}
