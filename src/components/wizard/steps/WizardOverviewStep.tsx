"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { saveWizardOverviewAction } from "@/app/admin/productions/wizard/actions";
import type { WizardProduction } from "@/components/wizard/ProductionWizardShell";

const ARCHIVAL = [
  ["oram-production", "ORAM Production"],
  ["oram-co-production", "ORAM Co-Production"],
  ["directed-by-owas", "Directed by Owas"],
  ["personal-filmography", "Personal Filmography"],
  ["requires-verification", "Requires Verification"],
] as const;

export function WizardOverviewStep({ production }: { production: WizardProduction }) {
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const autosave = useCallback(
    (form: HTMLFormElement) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const fd = new FormData(form);
        fd.set("productionId", production.id);
        startTransition(async () => {
          await saveWizardOverviewAction(fd);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        });
      }, 800);
    },
    [production.id],
  );

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-xl tracking-tight">Production details</h2>
      <p className="mt-2 text-sm text-white/50">
        Core metadata for the archive and public case study. Saves automatically.
      </p>
      {saved ? (
        <p className="mt-2 text-xs text-emerald-400">Saved</p>
      ) : pending ? (
        <p className="mt-2 text-xs text-white/40">Saving…</p>
      ) : null}

      <form
        id="wizard-overview"
        className="mt-8 space-y-5"
        onChange={(e) => autosave(e.currentTarget)}
      >
        <input type="hidden" name="productionId" value={production.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title *" name="title" defaultValue={production.title} required />
          <Field label="Slug *" name="slug" defaultValue={production.slug} required />
          <Field label="Year" name="year" type="number" defaultValue={production.year ?? ""} />
          <Field label="Runtime" name="runtime" defaultValue={production.runtime ?? ""} />
          <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
            Status
            <select
              name="status"
              defaultValue={production.status}
              className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
            >
              {["released", "ongoing", "concluded", "unknown"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
            Category
            <select
              name="kind"
              defaultValue={production.kind}
              className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
            >
              {["feature", "tv-series", "telenovela", "short", "branded", "documentary"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="col-span-full block text-xs uppercase tracking-[0.14em] text-white/40">
            Archive classification *
            <select
              name="archivalCategory"
              defaultValue={production.archivalCategory}
              className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
            >
              {ARCHIVAL.map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </label>
        </div>
        <Field label="Synopsis *" name="synopsis" multiline defaultValue={production.synopsis ?? ""} />
        <Field label="ORAM role" name="oramRole" multiline defaultValue={production.oramRole ?? ""} />
        <Field label="Owas role" name="owasRole" multiline defaultValue={production.owasRole ?? ""} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Broadcaster" name="broadcaster" defaultValue={production.broadcaster ?? ""} />
          <Field label="Streaming platform" name="streamingPlatform" defaultValue={production.streamingPlatform ?? ""} />
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  multiline,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  multiline?: boolean;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
      {label}
      {multiline ? (
        <textarea
          name={name}
          rows={4}
          required={required}
          defaultValue={defaultValue}
          className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          defaultValue={defaultValue}
          className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
        />
      )}
    </label>
  );
}
