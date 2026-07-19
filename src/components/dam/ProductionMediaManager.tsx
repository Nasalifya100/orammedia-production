"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MediaUploadZone } from "@/components/dam/MediaUploadZone";
import { updateMediaMetadataAction } from "@/app/admin/media/actions";
import {
  MEDIA_ROLES,
  PRODUCTION_MEDIA_SLOTS,
  parseVariants,
} from "@/pams/types/media";

type MediaAsset = {
  id: string;
  title: string | null;
  path: string;
  role: string;
  kind: string;
  approvalStatus: string;
  variantsJson: string | null;
  caption: string | null;
  altText: string | null;
};

interface ProductionMediaManagerProps {
  productionId: string;
  productionTitle: string;
  media: MediaAsset[];
  trailers: {
    id: string;
    title: string | null;
    platform: string;
    preferred: boolean;
    youtubeId: string | null;
    url: string | null;
  }[];
}

export function ProductionMediaManager({
  productionId,
  productionTitle,
  media,
  trailers,
}: ProductionMediaManagerProps) {
  const router = useRouter();

  const byRole = (role: string) => media.filter((m) => m.role === role);

  return (
    <div className="space-y-10">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-amber-500/90">
          Production Media Manager
        </p>
        <h1 className="mt-2 text-3xl tracking-tight">{productionTitle}</h1>
        <p className="mt-2 text-sm text-white/50">
          Manage hero, poster, gallery, BTS, trailers and press assets from one screen.
        </p>
      </div>

      <MediaUploadZone
        productionId={productionId}
        onComplete={() => router.refresh()}
      />

      <div className="space-y-8">
        {PRODUCTION_MEDIA_SLOTS.map((slot) => {
          const assets = byRole(slot.role);
          return (
            <section
              key={slot.role}
              className="rounded border border-white/10 bg-[#101014] p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h2 className="text-sm font-medium text-white/90">
                    {slot.label}
                  </h2>
                  <p className="text-xs text-white/40">{slot.description}</p>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-white/30">
                  {assets.length} asset{assets.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {assets.map((m) => {
                  const v = parseVariants(m.variantsJson);
                  const src = v.thumbnail || m.path;
                  return (
                    <div
                      key={m.id}
                      className="overflow-hidden rounded border border-white/10 bg-black/30"
                    >
                      {m.kind === "image" ? (
                        <div className="relative aspect-video">
                          <Image
                            src={src}
                            alt={m.altText || m.title || `${productionTitle} ${slot.label}`}
                            fill
                            className="object-cover"
                            sizes="200px"
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-video items-center justify-center text-xs text-white/40">
                          {m.kind}
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-2 p-2 text-[10px]">
                        <span className="truncate text-white/60">{m.approvalStatus}</span>
                        <a
                          href={`/admin/media/${m.id}`}
                          className="text-amber-400 hover:underline"
                        >
                          Edit
                        </a>
                      </div>
                    </div>
                  );
                })}
                {assets.length === 0 ? (
                  <p className="text-xs text-white/30">No {slot.label.toLowerCase()} yet.</p>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>

      <section className="rounded border border-white/10 bg-[#101014] p-5">
        <h2 className="text-sm font-medium text-white/90">Trailers & video</h2>
        <ul className="mt-4 space-y-2 text-sm text-white/60">
          {trailers.length === 0 ? (
            <li className="text-white/30">No trailers linked.</li>
          ) : (
            trailers.map((t) => (
              <li key={t.id} className="flex items-center gap-2 border border-white/5 px-3 py-2">
                <span>{t.platform}</span>
                <span className="truncate">{t.title || t.youtubeId || t.url}</span>
                {t.preferred ? (
                  <span className="text-amber-400 text-xs">preferred</span>
                ) : null}
              </li>
            ))
          )}
        </ul>
        <a href="/admin/trailers" className="mt-3 inline-block text-xs text-amber-400 hover:underline">
          Manage trailers →
        </a>
      </section>

      <section className="rounded border border-white/10 bg-[#101014] p-5">
        <h2 className="text-sm font-medium text-white/90">All production assets</h2>
        <ul className="mt-4 divide-y divide-white/5">
          {media.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
              <span className="w-24 text-[10px] uppercase tracking-wider text-white/40">
                {m.role}
              </span>
              <span className="flex-1 truncate text-white/70">{m.path}</span>
              <form action={updateMediaMetadataAction}>
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="productionId" value={productionId} />
                <select
                  name="role"
                  defaultValue={m.role}
                  className="border border-white/10 bg-black/40 px-2 py-1 text-xs"
                  onChange={(e) => e.currentTarget.form?.requestSubmit()}
                >
                  {MEDIA_ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
