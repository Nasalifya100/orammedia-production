"use client";

import { useState, useMemo } from "react";
import { ProjectPoster } from "./ProjectPoster";
import { ProjectFilter } from "./ProjectFilter";
import type { Project, ProjectCategoryFilter } from "@/types";

const ITEMS_PER_PAGE = 6;

interface ProjectGridProps {
  projects: Project[];
  initialCategory?: ProjectCategoryFilter;
}

export function ProjectGrid({
  projects,
  initialCategory = "all",
}: ProjectGridProps) {
  const [category, setCategory] = useState<ProjectCategoryFilter>(initialCategory);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (category === "all") return projects;
    return projects.filter((p) => p.category === category);
  }, [projects, category]);

  const visible = filtered.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = visible.length < filtered.length;

  const handleCategoryChange = (cat: ProjectCategoryFilter) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div>
      <ProjectFilter active={category} onChange={handleCategoryChange} />

      {filtered.length === 0 ? (
        <p className="mt-20 text-center text-ink-dim">
          No projects found in this category.
        </p>
      ) : (
        <>
          <div className="mt-14 grid grid-cols-1 items-start gap-6 sm:grid-cols-2 md:gap-10">
            {visible.map((project, index) => (
              <ProjectPoster key={project.id} project={project} index={index} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-16 text-center">
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                className="btn btn-line"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
