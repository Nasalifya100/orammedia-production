"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  saveWebsiteDraftAction,
  publishWebsiteAction,
  loadFlagshipMediaAction,
} from "@/app/admin/website/actions";
import {
  WebsitePreviewPanel,
} from "@/components/preview/WebsitePreviewPanel";
import { PREVIEW_DEVICE_WIDTHS, type PreviewDevice, type WebsitePreviewPayload } from "@/lib/preview/types";
import { sectionDiff } from "@/lib/preview/resolve-client";
import type {
  FeaturedProductionSlot,
  HomepageSectionConfig,
  WebsiteConfiguration,
} from "@/pams/types/website-config";

type ProductionOption = { id: string; title: string; slug: string };
type MediaOption = {
  id: string;
  filename: string;
  path: string;
  role: string;
  altText: string | null;
};
type TrailerOption = {
  id: string;
  title: string | null;
  platform: string;
  officialStatus: string;
  preferred: boolean;
};

type PreviewLayoutMode = "draft" | "published" | "split";

interface WebsiteBuilderProps {
  initialConfig: WebsiteConfiguration;
  publishedConfig: WebsiteConfiguration;
  productions: ProductionOption[];
  previewPayload: WebsitePreviewPayload;
}

function reorder<T extends { order: number }>(items: T[], from: number, to: number): T[] {
  const next = [...items].sort((a, b) => a.order - b.order);
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next.map((item, i) => ({ ...item, order: i }));
}

export function WebsiteBuilder({
  initialConfig,
  publishedConfig: initialPublished,
  productions,
  previewPayload,
}: WebsiteBuilderProps) {
  const [config, setConfig] = useState(initialConfig);
  const [publishedConfig, setPublishedConfig] = useState(initialPublished);
  const [device, setDevice] = useState<PreviewDevice>("desktop");
  const [previewLayout, setPreviewLayout] = useState<PreviewLayoutMode>("draft");
  const [saved, setSaved] = useState(false);
  const [publishErrors, setPublishErrors] = useState<string[]>([]);
  const [publishWarnings, setPublishWarnings] = useState<string[]>([]);
  const [dragSectionIdx, setDragSectionIdx] = useState<number | null>(null);
  const [dragFeaturedIdx, setDragFeaturedIdx] = useState<number | null>(null);
  const [mediaOptions, setMediaOptions] = useState<MediaOption[]>([]);
  const [trailerOptions, setTrailerOptions] = useState<TrailerOption[]>([]);
  const [pending, startTransition] = useTransition();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingConfig = useRef<WebsiteConfiguration | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  useEffect(() => {
    const slug = initialConfig.flagship.productionSlug;
    if (!slug) return;
    loadFlagshipMediaAction(slug).then(({ media, trailers }) => {
      setMediaOptions(media);
      setTrailerOptions(trailers);
    });
  }, [initialConfig.flagship.productionSlug]);

  const sections = useMemo(
    () => [...config.sections].sort((a, b) => a.order - b.order),
    [config.sections],
  );

  const featuredSlots = useMemo(
    () => [...config.featuredSlots].sort((a, b) => a.order - b.order),
    [config.featuredSlots],
  );

  const changedSections = useMemo(
    () => sectionDiff(config, publishedConfig),
    [config, publishedConfig],
  );

  const persist = useCallback((next: WebsiteConfiguration) => {
    setConfig(next);
    pendingConfig.current = next;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const payload = pendingConfig.current;
      if (!payload) return;
      startTransition(async () => {
        const savedConfig = await saveWebsiteDraftAction(JSON.stringify(payload));
        setConfig(savedConfig);
        pendingConfig.current = savedConfig;
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      });
    }, 700);
  }, [startTransition]);

  const updateSections = (next: HomepageSectionConfig[]) => {
    persist({ ...config, sections: next });
  };

  const updateFeatured = (next: FeaturedProductionSlot[]) => {
    persist({ ...config, featuredSlots: next });
  };

  const moveSection = (idx: number, dir: -1 | 1) => {
    const to = idx + dir;
    if (to < 0 || to >= sections.length) return;
    updateSections(reorder(sections, idx, to));
  };

  const toggleSection = (id: string) => {
    updateSections(
      sections.map((s) =>
        s.id === id ? { ...s, enabled: !s.enabled } : s,
      ),
    );
  };

  const duplicateSection = (id: string) => {
    const src = sections.find((s) => s.id === id);
    if (!src) return;
    const copy: HomepageSectionConfig = {
      ...src,
      id: `${src.id}-copy-${Date.now()}`,
      label: `${src.label ?? src.type} (copy)`,
      order: sections.length,
    };
    updateSections([...sections, copy]);
  };

  const deleteSection = (id: string) => {
    updateSections(sections.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i })));
  };

  const onFlagshipChange = async (slug: string) => {
    const next: WebsiteConfiguration = {
      ...config,
      flagship: { ...config.flagship, productionSlug: slug || null },
    };
    persist(next);
    if (slug) {
      const { media, trailers } = await loadFlagshipMediaAction(slug);
      setMediaOptions(media);
      setTrailerOptions(trailers);
    }
  };

  const onSectionDrop = (toIdx: number) => {
    if (dragSectionIdx === null || dragSectionIdx === toIdx) return;
    updateSections(reorder(sections, dragSectionIdx, toIdx));
    setDragSectionIdx(null);
  };

  const onFeaturedDrop = (toIdx: number) => {
    if (dragFeaturedIdx === null || dragFeaturedIdx === toIdx) return;
    updateFeatured(reorder(featuredSlots, dragFeaturedIdx, toIdx));
    setDragFeaturedIdx(null);
  };

  const toggleFeaturedFlag = (
    slug: string,
    key: keyof Pick<FeaturedProductionSlot, "pinned" | "featured" | "hidden" | "archived">,
  ) => {
    updateFeatured(
      featuredSlots.map((s) =>
        s.productionSlug === slug ? { ...s, [key]: !s[key] } : s,
      ),
    );
  };

  const onPublish = () => {
    startTransition(async () => {
      const result = await publishWebsiteAction();
      setPublishErrors(result.errors);
      setPublishWarnings(result.warnings);
      if (result.ok && result.config) {
        setPublishedConfig(result.config);
      }
    });
  };

  const fullPreviewUrl =
    previewLayout === "published"
      ? "/preview?scope=published"
      : "/preview?scope=draft";

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(440px,560px)]">
      <div className="space-y-8">
        <section className="rounded border border-white/10 bg-[#101014] p-6">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-white/50">
            Homepage copy
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-xs text-white/40">
              Headline
              <input
                value={config.homepageHeadline}
                onChange={(e) =>
                  persist({ ...config, homepageHeadline: e.target.value })
                }
                className="mt-1 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs text-white/40">
              Eyebrow
              <input
                value={config.homepageEyebrow}
                onChange={(e) =>
                  persist({ ...config, homepageEyebrow: e.target.value })
                }
                className="mt-1 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
              />
            </label>
            <label className="col-span-full block text-xs text-white/40">
              Subheadline
              <textarea
                value={config.homepageSubheadline}
                onChange={(e) =>
                  persist({ ...config, homepageSubheadline: e.target.value })
                }
                rows={3}
                className="mt-1 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
              />
            </label>
          </div>
        </section>

        <section className="rounded border border-white/10 bg-[#101014] p-6">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-white/50">
            Flagship production
          </h2>
          <p className="mt-2 text-xs text-white/40">
            Changing flagship updates hero, SEO, Open Graph, share image and featured #1.
          </p>
          {config.resolvedFlagship?.missingHeroArtwork ? (
            <p className="mt-3 rounded border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
              No official hero artwork for this production. Upload key art before publishing.
            </p>
          ) : null}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-xs text-white/40">
              Flagship production
              <select
                value={config.flagship.productionSlug ?? ""}
                onChange={(e) => onFlagshipChange(e.target.value)}
                className="mt-1 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
              >
                <option value="">— Select —</option>
                {productions.map((p) => (
                  <option key={p.id} value={p.slug}>
                    {p.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs text-white/40">
              Featured position
              <input
                type="number"
                min={1}
                value={config.flagship.featuredPosition}
                onChange={(e) =>
                  persist({
                    ...config,
                    flagship: {
                      ...config.flagship,
                      featuredPosition: Number(e.target.value) || 1,
                    },
                  })
                }
                className="mt-1 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs text-white/40">
              Hero poster
              <select
                value={config.flagship.heroPosterMediaId ?? ""}
                onChange={(e) =>
                  persist({
                    ...config,
                    flagship: {
                      ...config.flagship,
                      heroPosterMediaId: e.target.value || null,
                    },
                  })
                }
                className="mt-1 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
              >
                <option value="">Auto (from production)</option>
                {mediaOptions.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.role}: {m.filename}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs text-white/40">
              Hero video
              <select
                value={config.flagship.heroVideoTrailerId ?? ""}
                onChange={(e) =>
                  persist({
                    ...config,
                    flagship: {
                      ...config.flagship,
                      heroVideoTrailerId: e.target.value || null,
                    },
                  })
                }
                className="mt-1 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
              >
                <option value="">Auto (preferred trailer)</option>
                {trailerOptions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title || t.platform} {t.preferred ? "★" : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs text-white/40">
              Share / OG image
              <select
                value={config.flagship.shareImageMediaId ?? ""}
                onChange={(e) =>
                  persist({
                    ...config,
                    flagship: {
                      ...config.flagship,
                      shareImageMediaId: e.target.value || null,
                    },
                  })
                }
                className="mt-1 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
              >
                <option value="">Auto (OG-eligible media)</option>
                {mediaOptions.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.role}: {m.filename}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {config.resolvedFlagship?.heroPosterPath ? (
            <p className="mt-3 text-xs text-white/30">
              Resolved hero: {config.resolvedFlagship.heroPosterPath}
            </p>
          ) : null}
        </section>

        <section className="rounded border border-white/10 bg-[#101014] p-6">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-white/50">
            Homepage sections
          </h2>
          <ul className="mt-4 space-y-2">
            {sections.map((section, idx) => (
              <li
                key={section.id}
                draggable
                onDragStart={() => setDragSectionIdx(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onSectionDrop(idx)}
                className={`flex flex-wrap items-center gap-2 rounded border px-3 py-2 text-sm ${
                  section.enabled
                    ? "border-white/15 bg-white/[0.03]"
                    : "border-white/5 bg-black/20 opacity-60"
                }`}
              >
                <span className="cursor-grab text-white/30">⋮⋮</span>
                <span className="flex-1 font-medium">
                  {section.label ?? section.type}
                </span>
                <button type="button" onClick={() => toggleSection(section.id)} className="rounded px-2 py-1 text-xs text-white/50 hover:bg-white/10">
                  {section.enabled ? "Disable" : "Enable"}
                </button>
                <button type="button" onClick={() => moveSection(idx, -1)} className="rounded px-2 py-1 text-xs text-white/50 hover:bg-white/10">↑</button>
                <button type="button" onClick={() => moveSection(idx, 1)} className="rounded px-2 py-1 text-xs text-white/50 hover:bg-white/10">↓</button>
                <button type="button" onClick={() => duplicateSection(section.id)} className="rounded px-2 py-1 text-xs text-white/50 hover:bg-white/10">Duplicate</button>
                <button type="button" onClick={() => deleteSection(section.id)} className="rounded px-2 py-1 text-xs text-red-400/80 hover:bg-red-500/10">Delete</button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded border border-white/10 bg-[#101014] p-6">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-white/50">
            Featured productions
          </h2>
          <ul className="mt-4 space-y-2">
            {featuredSlots.map((slot, idx) => {
              const prod = productions.find((p) => p.slug === slot.productionSlug);
              return (
                <li
                  key={slot.productionSlug}
                  draggable
                  onDragStart={() => setDragFeaturedIdx(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onFeaturedDrop(idx)}
                  className="flex flex-wrap items-center gap-2 rounded border border-white/10 bg-black/30 px-3 py-2 text-sm"
                >
                  <span className="cursor-grab text-white/30">⋮⋮</span>
                  <span className="w-6 text-white/30">{idx + 1}</span>
                  <span className="flex-1">{prod?.title ?? slot.productionSlug}</span>
                  {(["pinned", "featured", "hidden", "archived"] as const).map((flag) => (
                    <button
                      key={flag}
                      type="button"
                      onClick={() => toggleFeaturedFlag(slot.productionSlug, flag)}
                      className={`rounded px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                        slot[flag]
                          ? "bg-amber-600/30 text-amber-200"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      {flag}
                    </button>
                  ))}
                </li>
              );
            })}
          </ul>
        </section>

        {publishErrors.length > 0 ? (
          <div className="rounded border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            <p className="font-medium">Publish blocked</p>
            <ul className="mt-2 list-inside list-disc text-xs">
              {publishErrors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {publishWarnings.length > 0 ? (
          <div className="rounded border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
            <ul className="list-inside list-disc text-xs">
              {publishWarnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={pending}
            onClick={onPublish}
            className="bg-amber-600 px-5 py-2.5 text-sm font-medium text-black disabled:opacity-50"
          >
            Publish website
          </button>
          {saved ? (
            <span className="text-xs text-emerald-400">Draft saved</span>
          ) : pending ? (
            <span className="text-xs text-white/40">Saving…</span>
          ) : null}
          <Link href="/admin/website/snapshots" className="text-xs text-white/40 hover:text-white">
            Snapshots →
          </Link>
          <a
            href={fullPreviewUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-white/40 hover:text-white"
          >
            Open full preview ↗
          </a>
        </div>
      </div>

      <aside className="xl:sticky xl:top-6 xl:self-start space-y-4">
        <div className="rounded border border-white/10 bg-[#101014] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
              Live preview
            </span>
            <select
              value={previewLayout}
              onChange={(e) => setPreviewLayout(e.target.value as PreviewLayoutMode)}
              className="ml-auto border border-white/10 bg-black/40 px-2 py-1 text-xs"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="split">Split (before / after)</option>
            </select>
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {(Object.keys(PREVIEW_DEVICE_WIDTHS) as PreviewDevice[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDevice(d)}
                className={`rounded px-2 py-1 text-[10px] uppercase tracking-wider ${
                  device === d
                    ? "bg-white/15 text-white"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {previewLayout === "split" ? (
          <div className="grid gap-4">
            <WebsitePreviewPanel
              config={publishedConfig}
              payload={previewPayload}
              device={device}
              label="Published"
            />
            <WebsitePreviewPanel
              config={config}
              payload={previewPayload}
              device={device}
              label="Draft"
              highlight
              changedSections={changedSections}
            />
          </div>
        ) : (
          <WebsitePreviewPanel
            config={previewLayout === "published" ? publishedConfig : config}
            payload={previewPayload}
            device={device}
            label={previewLayout === "published" ? "Published" : "Draft"}
            highlight={previewLayout === "draft" && changedSections.length > 0}
            changedSections={previewLayout === "draft" ? changedSections : []}
          />
        )}
      </aside>
    </div>
  );
}
