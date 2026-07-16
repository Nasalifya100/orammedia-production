"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { ProjectVideoModal } from "@/components/projects/ProjectVideoModal";
import type { Project } from "@/types";

/** Opens the trailer modal for a project. */
export function TrailerButton({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const hasTrailer = Boolean(
    project.youtubeId || project.muxPlaybackId || project.videoUrl,
  );

  if (!hasTrailer) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn btn-primary"
      >
        <Play size={13} fill="currentColor" />
        Watch Trailer
      </button>
      <ProjectVideoModal
        project={open ? project : null}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
