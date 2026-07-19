"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { FeaturedWorkRotator } from "@/components/home/FeaturedWorkRotator";
import { ProjectMediaCard } from "@/components/projects/ProjectMediaCard";
import { ProjectVideoModal } from "@/components/projects/ProjectVideoModal";
import type { Project } from "@/types";

interface FeaturedProjectsProps {
  projects: Project[];
}

/** Cinematic work showcase — rotating hero + full portfolio scroll */
export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [modalProject, setModalProject] = useState<Project | null>(null);

  const featured = projects.filter((p) => p.featured);
  const ordered = [...projects].sort((a, b) => a.order - b.order);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -480 : 480,
      behavior: "smooth",
    });
  };

  return (
    <>
      <section id="showreel" className="section-sg bg-black">
        <div className="sg-container">
          <div className="mb-14 flex items-end justify-between gap-8 md:mb-20">
            <AnimatedSection>
              <p className="text-eyebrow mb-4">Filmography</p>
              <h2 className="sg-dual-heading">
                <span className="highlight">Projects</span>
              </h2>
            </AnimatedSection>
            <div className="hidden gap-3 md:flex">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                className="flex h-12 w-12 items-center justify-center border border-glass-border text-muted transition-all duration-300 hover:border-accent hover:text-accent"
              >
                <ChevronLeft size={18} strokeWidth={1.25} />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="flex h-12 w-12 items-center justify-center border border-glass-border text-muted transition-all duration-300 hover:border-accent hover:text-accent"
              >
                <ChevronRight size={18} strokeWidth={1.25} />
              </button>
            </div>
          </div>
        </div>

        {featured.length > 0 && (
          <AnimatedSection className="mb-10 md:mb-14">
            <FeaturedWorkRotator projects={featured} />
          </AnimatedSection>
        )}

        <div
          ref={scrollRef}
          className="work-scroll flex gap-5 overflow-x-auto px-[max(1.25rem,calc((100vw-1440px)/2+1.25rem))] pb-6 md:gap-7 md:px-[max(1.25rem,calc((100vw-1440px)/2+3.125rem))]"
        >
          {ordered.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: 48 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="snap-card w-[82vw] shrink-0 sm:w-[48vw] md:w-[38vw] lg:w-[30vw]"
            >
              <ProjectMediaCard
                project={project}
                index={index}
                sizes="(max-width: 768px) 82vw, 30vw"
                showIndex
                showDescription={false}
                onPlay={setModalProject}
              />
            </motion.div>
          ))}
        </div>

        <div className="sg-container mt-14 text-center md:text-left">
          <Link href="/projects" className="btn-sg-primary inline-flex items-center gap-2">
            View our Projects <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      <ProjectVideoModal
        project={modalProject}
        onClose={() => setModalProject(null)}
      />
    </>
  );
}
