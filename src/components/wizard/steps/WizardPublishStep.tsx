"use client";

import { useSearchParams } from "next/navigation";
import { publishWizardAction } from "@/app/admin/productions/wizard/actions";
import type { WizardProduction } from "@/components/wizard/ProductionWizardShell";

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-white/50">
        <span>{label}</span>
        <span className="tabular-nums text-amber-300">{value}%</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full bg-amber-500 transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function WizardPublishStep({
  production,
  scores,
  onGoPreview,
}: {
  production: WizardProduction;
  scores: {
    production: number;
    media: number;
    seo: number;
    rights: number;
    archive: number;
    overall: number;
  };
  onGoPreview: () => void;
}) {
  const searchParams = useSearchParams();
  const published = searchParams.get("published") === "1" || production.published;
  const canPublish =
    scores.production >= 40 &&
    scores.media >= 25 &&
    scores.rights >= 60;

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h2 className="text-xl tracking-tight">Publish</h2>
        <p className="mt-2 text-sm text-white/50">
          Final checklist before the production goes live on orammedia.com.
        </p>
        {published ? (
          <p className="mt-4 rounded border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            Published successfully. Homepage, sitemap and search index will refresh on next deploy cycle.
          </p>
        ) : null}
      </div>

      <div className="space-y-4 rounded border border-white/10 p-6">
        <ScoreBar label="Production score" value={scores.production} />
        <ScoreBar label="Media score" value={scores.media} />
        <ScoreBar label="SEO score" value={scores.seo} />
        <ScoreBar label="Rights score" value={scores.rights} />
        <ScoreBar label="Archive score" value={scores.archive} />
        <div className="border-t border-white/10 pt-4">
          <ScoreBar label="Overall" value={scores.overall} />
        </div>
      </div>

      <ul className="space-y-2 text-sm text-white/60">
        <Check ok={Boolean(production.title && production.slug)}>Title & slug</Check>
        <Check ok={Boolean(production.synopsis)}>Synopsis</Check>
        <Check ok={production.media.some((m) => m.role === "poster" || m.role === "hero")}>
          Poster or hero image
        </Check>
        <Check ok={production.credits.length > 0}>Credits</Check>
        <Check ok={Boolean(production.seoTitle || production.seoDescription)}>SEO metadata</Check>
      </ul>

      {!published ? (
        <div className="flex flex-wrap gap-3">
          <form action={publishWizardAction}>
            <input type="hidden" name="productionId" value={production.id} />
            <button
              type="submit"
              disabled={!canPublish}
              className="bg-amber-600 px-6 py-3 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              Publish production
            </button>
          </form>
          <button
            type="button"
            onClick={onGoPreview}
            className="border border-white/15 px-6 py-3 text-sm text-white/70"
          >
            Review preview
          </button>
        </div>
      ) : null}

      {!canPublish && !published ? (
        <p className="text-xs text-amber-200/80">
          Complete required steps (overview, media, rights) before publishing.
        </p>
      ) : null}
    </div>
  );
}

function Check({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <span className={ok ? "text-emerald-400" : "text-white/25"}>{ok ? "✓" : "○"}</span>
      {children}
    </li>
  );
}
