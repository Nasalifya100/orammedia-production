"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import { MediaPlayer } from "@/components/ui/MediaPlayer";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import type { Project } from "@/types";

interface ProjectVideoModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectVideoModal({ project, onClose }: ProjectVideoModalProps) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/96 p-4 md:p-10"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close trailer"
              className="absolute -top-14 right-0 text-muted transition-colors hover:text-foreground md:-right-4 md:top-0 md:translate-x-full md:pl-6"
            >
              <X size={28} strokeWidth={1.25} />
            </button>

            <div className="cinema-frame relative aspect-video w-full overflow-hidden bg-surface-2">
              {project.youtubeId ? (
                <YouTubeEmbed
                  videoId={project.youtubeId}
                  title={`${project.title} trailer`}
                  controls
                />
              ) : (
                <MediaPlayer
                  muxPlaybackId={project.muxPlaybackId}
                  src={project.videoUrl}
                  poster={project.posterUrl}
                  autoPlay
                  muted={false}
                  loop={false}
                  lazy={false}
                  controls
                  className="h-full w-full"
                />
              )}
            </div>

            <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">
                  {project.clientName} · {project.year}
                </p>
                <h2 className="display display-md mt-3 text-foreground">
                  {project.title}
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-ink-dim">
                  {project.description}
                </p>
              </div>
              <Link
                href={`/projects/${project.slug}`}
                className="btn btn-line shrink-0"
                onClick={onClose}
              >
                View Project <ArrowUpRight size={14} />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
