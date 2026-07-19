"use client";

import { useSearchParams } from "next/navigation";

export function PreviewBanner() {
  const params = useSearchParams();
  const scope = params.get("scope") === "published" ? "published" : "draft";

  return (
    <div
      className={`sticky top-0 z-[100] border-b px-4 py-2 text-center text-xs uppercase tracking-[0.22em] ${
        scope === "draft"
          ? "border-amber-500/30 bg-amber-500/15 text-amber-100"
          : "border-emerald-500/30 bg-emerald-500/15 text-emerald-100"
      }`}
    >
      {scope === "draft" ? "Draft preview" : "Published preview"} — ORAM OS
    </div>
  );
}
