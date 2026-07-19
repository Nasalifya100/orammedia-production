"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { saveWizardAwardsAction } from "@/app/admin/productions/wizard/actions";
import type { WizardProduction } from "@/components/wizard/ProductionWizardShell";

export function WizardAwardsStep({ production }: { production: WizardProduction }) {
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const autosave = useCallback(
    (form: HTMLFormElement) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const fd = new FormData(form);
        fd.set("productionId", production.id);
        startTransition(async () => {
          await saveWizardAwardsAction(fd);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        });
      }, 800);
    },
    [production.id],
  );

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-xl tracking-tight">Awards & festivals</h2>
      <p className="mt-2 text-sm text-white/50">
        Optional — awards, nominations, festival selections, premieres and press links. Leave blank if none.
      </p>
      {saved ? <p className="mt-2 text-xs text-emerald-400">Saved</p> : null}

      <form className="mt-8 space-y-4" onChange={(e) => autosave(e.currentTarget)}>
        <input type="hidden" name="productionId" value={production.id} />
        <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
          Awards & recognition
          <textarea
            name="awardsNotes"
            rows={4}
            defaultValue={production.productionNotes ?? ""}
            placeholder="ZAFTA nomination 2024, Best Drama…"
            className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
          Festival selections & premieres
          <textarea
            name="festivalNotes"
            rows={4}
            defaultValue={production.rightsNotes ?? ""}
            placeholder="Durban Film Festival selection…"
            className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
          Press links
          <textarea
            name="pressNotes"
            rows={3}
            defaultValue={production.verificationNotes ?? ""}
            placeholder="URLs or citations…"
            className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
          />
        </label>
      </form>
    </div>
  );
}
