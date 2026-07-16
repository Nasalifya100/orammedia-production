"use client";

import { cn } from "@/lib/utils";
import type { ProjectCategoryFilter } from "@/types";

const filters: { value: ProjectCategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "narrative", label: "Narrative" },
  { value: "branded", label: "Branded" },
  { value: "commercial", label: "Commercial" },
  { value: "music-video", label: "Music Video" },
];

interface ProjectFilterProps {
  active: ProjectCategoryFilter;
  onChange: (category: ProjectCategoryFilter) => void;
}

export function ProjectFilter({ active, onChange }: ProjectFilterProps) {
  return (
    <div
      className="flex flex-wrap gap-x-8 gap-y-3 border-b border-line pb-6"
      role="tablist"
      aria-label="Filter projects"
    >
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          role="tab"
          aria-selected={active === filter.value}
          onClick={() => onChange(filter.value)}
          className={cn(
            "link-line text-sm tracking-tight transition-colors",
            active === filter.value
              ? "text-foreground"
              : "text-ink-dim hover:text-foreground",
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export { filters };
