"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { saveWizardSeoAction } from "@/app/admin/productions/wizard/actions";
import type { WizardProduction } from "@/components/wizard/ProductionWizardShell";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

export function WizardSeoStep({ production }: { production: WizardProduction }) {
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const title = production.seoTitle || production.title;
  const description = production.seoDescription || production.synopsis || "";
  const ogImage =
    production.media.find((m) => m.role === "og")?.path ||
    production.media.find((m) => m.role === "hero")?.path ||
    production.media.find((m) => m.role === "poster")?.path ||
    "";
  const canonical =
    production.seoCanonical ||
    `${SITE_URL}/projects/${production.slug}`;

  const autosave = useCallback(
    (form: HTMLFormElement) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const fd = new FormData(form);
        fd.set("productionId", production.id);
        startTransition(async () => {
          await saveWizardSeoAction(fd);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        });
      }, 800);
    },
    [production.id],
  );

  const incomplete = !production.seoTitle || !production.seoDescription;

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <h2 className="text-xl tracking-tight">SEO & homepage</h2>
        <p className="mt-2 text-sm text-white/50">
          Search and social previews plus homepage placement. Saves automatically.
        </p>
        {saved ? <p className="mt-2 text-xs text-emerald-400">Saved</p> : null}
        {incomplete ? (
          <p className="mt-3 rounded border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-200">
            SEO title and description are recommended before publish.
          </p>
        ) : null}
      </div>

      <form className="space-y-6" onChange={(e) => autosave(e.currentTarget)}>
        <input type="hidden" name="productionId" value={production.id} />
        <Field label="SEO title" name="seoTitle" defaultValue={production.seoTitle ?? ""} />
        <Field label="SEO description" name="seoDescription" multiline defaultValue={production.seoDescription ?? ""} />
        <Field label="Canonical URL" name="seoCanonical" defaultValue={production.seoCanonical ?? ""} placeholder={canonical} />

        <div className="grid gap-4 border-t border-white/10 pt-6 md:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" name="featured" defaultChecked={production.featured} />
            Feature on homepage
          </label>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" name="flagshipCandidate" defaultChecked={production.flagshipCandidate} />
            Flagship candidate
          </label>
          <Field label="Homepage position" name="sortOrder" type="number" defaultValue={production.sortOrder} />
          <Field label="Homepage campaign" name="homepageCampaign" defaultValue={production.homepageCampaign ?? ""} />
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        <PreviewCard title="Google Search">
          <p className="text-lg text-blue-400">{title}</p>
          <p className="mt-1 text-xs text-emerald-600">{canonical}</p>
          <p className="mt-2 line-clamp-2 text-sm text-white/50">{description}</p>
        </PreviewCard>
        <PreviewCard title="Open Graph / Facebook">
          {ogImage ? (
            <div className="mb-3 aspect-video rounded bg-white/5 bg-cover bg-center" style={{ backgroundImage: `url(${ogImage})` }} />
          ) : (
            <div className="mb-3 flex aspect-video items-center justify-center rounded bg-white/5 text-xs text-white/30">
              No share image
            </div>
          )}
          <p className="font-medium text-white/90">{title}</p>
          <p className="mt-1 line-clamp-2 text-xs text-white/50">{description}</p>
        </PreviewCard>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  multiline,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  multiline?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
      {label}
      {multiline ? (
        <textarea
          name={name}
          rows={3}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
        />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
        />
      )}
    </label>
  );
}

function PreviewCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded border border-white/10 bg-[#101014] p-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}
