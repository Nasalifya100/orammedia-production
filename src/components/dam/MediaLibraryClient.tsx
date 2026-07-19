"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MediaUploadZone } from "@/components/dam/MediaUploadZone";
import { parseVariants } from "@/pams/types/media";

type MediaRow = {
  id: string;
  title: string | null;
  path: string;
  role: string;
  kind: string;
  approvalStatus: string;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  production: { title: string; slug: string } | null;
  variantsJson: string | null;
};

interface MediaLibraryClientProps {
  initialMedia: MediaRow[];
  insights: {
    unusedCount: number;
    duplicateGroups: { checksum: string; count: number }[];
    recommendations: string[];
  };
}

export function MediaLibraryClient({
  initialMedia,
  insights,
}: MediaLibraryClientProps) {
  const router = useRouter();
  const [filter, setFilter] = useState("all");

  const filtered = initialMedia.filter((m) => {
    if (filter === "pending") return m.approvalStatus === "pending";
    if (filter === "unassigned") return !m.production;
    return true;
  });

  return (
    <div className="space-y-8">
      {insights.recommendations.length > 0 ? (
        <div className="rounded border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-amber-300">
            Archive intelligence
          </p>
          <ul className="mt-2 space-y-1 text-xs text-amber-100/80">
            {insights.recommendations.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <MediaUploadZone onComplete={() => router.refresh()} />

      <div className="flex flex-wrap gap-2 text-xs">
        {[
          ["all", `All (${initialMedia.length})`],
          ["pending", "Pending approval"],
          ["unassigned", `Unassigned (${insights.unusedCount})`],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded px-3 py-1.5 ${
              filter === key
                ? "bg-white/15 text-white"
                : "bg-white/5 text-white/50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((m) => {
          const variants = parseVariants(m.variantsJson);
          const preview =
            m.kind === "image" ? variants.thumbnail || m.path : m.path;
          return (
            <Link
              key={m.id}
              href={`/admin/media/${m.id}`}
              className="group overflow-hidden rounded border border-white/10 bg-[#121216] transition hover:border-amber-500/30"
            >
              <div className="relative aspect-[4/3] bg-black/40">
                {m.kind === "image" ? (
                  <Image
                    src={preview}
                    alt={m.title || m.path}
                    fill
                    className="object-cover"
                    sizes="240px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs uppercase tracking-wider text-white/40">
                    {m.kind}
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-sm text-white/90">
                  {m.title || m.path.split("/").pop()}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-white/40">
                  {m.role} · {m.approvalStatus}
                </p>
                {m.production ? (
                  <p className="mt-1 truncate text-xs text-white/50">
                    {m.production.title}
                  </p>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
