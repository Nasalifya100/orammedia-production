"use client";

import { useState } from "react";
import Image from "next/image";
import { MediaUploadZone } from "@/components/dam/MediaUploadZone";
import { addWizardTrailerAction } from "@/app/admin/productions/wizard/actions";
import type { WizardProduction } from "@/components/wizard/ProductionWizardShell";
import { parseVariants } from "@/pams/types/media";

const POSTER_SLOTS = [
  { role: "poster", label: "Official poster" },
  { role: "hero", label: "Hero image" },
  { role: "og", label: "Open Graph image" },
] as const;

export function WizardMediaStep({
  production,
  onRefresh,
}: {
  production: WizardProduction;
  onRefresh: () => void;
}) {
  const [tab, setTab] = useState<"poster" | "trailer" | "gallery">("poster");

  const heroCandidate = production.media
    .filter((m) => m.kind === "image" && (m.width ?? 0) >= 1280)
    .sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h2 className="text-xl tracking-tight">Poster & media</h2>
        <p className="mt-2 text-sm text-white/50">
          Upload official key art, trailers and gallery. WebP, AVIF and thumbnails generate automatically.
        </p>
        {heroCandidate ? (
          <p className="mt-3 rounded border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-200">
            Suggested hero: {heroCandidate.path.split("/").pop()} ({heroCandidate.width}px wide)
          </p>
        ) : (
          <p className="mt-3 rounded border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-200">
            Upload a hero image at least 1280px wide for best results.
          </p>
        )}
      </div>

      <div className="flex gap-2 border-b border-white/10 pb-2">
        {(["poster", "trailer", "gallery"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-xs uppercase tracking-wider ${
              tab === t ? "border-b-2 border-amber-500 text-white" : "text-white/40"
            }`}
          >
            {t === "poster" ? "Poster & hero" : t === "trailer" ? "Trailer" : "Gallery"}
          </button>
        ))}
      </div>

      {tab === "poster" ? (
        <div className="space-y-6">
          {POSTER_SLOTS.map((slot) => {
            const asset = production.media.find((m) => m.role === slot.role);
            return (
              <div key={slot.role} className="rounded border border-white/10 p-4">
                <p className="text-sm font-medium text-white/80">{slot.label}</p>
                {asset ? (
                  <div className="mt-3 flex gap-4">
                    <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded bg-black">
                      <Image
                        src={asset.path}
                        alt={`${slot.label} preview`}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    </div>
                    <p className="text-xs text-white/40 break-all">{asset.path}</p>
                  </div>
                ) : null}
                <div className="mt-4">
                  <MediaUploadZone
                    productionId={production.id}
                    role={slot.role}
                    onComplete={() => onRefresh()}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {tab === "trailer" ? (
        <div className="space-y-6">
          <form action={addWizardTrailerAction} className="space-y-4 rounded border border-white/10 p-4">
            <input type="hidden" name="productionId" value={production.id} />
            <label className="block text-xs text-white/40">
              Platform
              <select name="platform" className="mt-1 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm">
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="mux">Mux</option>
                <option value="mp4">Self-hosted MP4</option>
              </select>
            </label>
            <input name="youtubeId" placeholder="YouTube ID" className="w-full border border-white/10 bg-black/40 px-3 py-2 text-sm" />
            <input name="muxPlaybackId" placeholder="Mux playback ID" className="w-full border border-white/10 bg-black/40 px-3 py-2 text-sm" />
            <input name="url" placeholder="Video URL" className="w-full border border-white/10 bg-black/40 px-3 py-2 text-sm" />
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" name="preferred" defaultChecked />
              Official / preferred trailer
            </label>
            <button type="submit" className="bg-amber-600 px-4 py-2 text-sm text-black">Add trailer</button>
          </form>
          <ul className="space-y-2 text-sm text-white/60">
            {production.trailers.map((t) => (
              <li key={t.id} className="border border-white/5 px-3 py-2">
                {t.platform} · {t.title || t.youtubeId || t.url}
                {t.preferred ? " ★" : ""}
              </li>
            ))}
          </ul>
          <MediaUploadZone productionId={production.id} role="gallery" onComplete={() => onRefresh()} />
          <p className="text-xs text-white/30">Or upload MP4 directly (stored as production media)</p>
        </div>
      ) : null}

      {tab === "gallery" ? (
        <div className="space-y-4">
          <MediaUploadZone productionId={production.id} role="gallery" onComplete={() => onRefresh()} />
          <div className="grid gap-3 sm:grid-cols-3">
            {production.media
              .filter((m) => ["gallery", "still", "bts"].includes(m.role))
              .map((m) => {
                const v = parseVariants(m.variantsJson);
                return (
                  <div key={m.id} className="relative aspect-video overflow-hidden rounded border border-white/10">
                    {m.kind === "image" ? (
                      <Image
                        src={v.thumbnail || m.path}
                        alt={`${production.title} gallery still`}
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center text-xs text-white/40">{m.kind}</span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
