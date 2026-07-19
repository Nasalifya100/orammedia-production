"use client";

import { ProjectMediaCard } from "./ProjectMediaCard";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  index?: number;
  onPlay: (project: Project) => void;
}

export function ProjectCard({ project, index = 0, onPlay }: ProjectCardProps) {
  return (
    <ProjectMediaCard project={project} index={index} onPlay={onPlay} />
  );
}
