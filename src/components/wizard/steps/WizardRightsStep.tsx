"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { saveWizardRightsAction } from "@/app/admin/productions/wizard/actions";
import type { RightsChecklist } from "@/pams/types/wizard";

const RIGHTS_ITEMS = [
  { key: "posterRights", label: "Poster rights cleared" },
  { key: "trailerRights", label: "Trailer rights cleared" },
  { key: "galleryRights", label: "Gallery rights cleared" },
  { key: "musicRights", label: "Music rights cleared" },
  { key: "broadcastRights", label: "Broadcast rights cleared" },
] as const;

export function WizardRightsStep({
  productionId,
  checklist,
}: {
  productionId: string;
  checklist: RightsChecklist;
}) {
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const autosave = useCallback(
    (form: HTMLFormElement) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const fd = new FormData(form);
        fd.set("productionId", productionId);
        startTransition(async () => {
          await saveWizardRightsAction(fd);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        });
      }, 400);
    },
    [productionId],
  );

  const requiredMissing = !checklist.posterRights || !checklist.trailerRights || !checklist.galleryRights;

  return (
    <div className="mx-auto max-w-xl">
      <h2 className="text-xl tracking-tight">Rights & verification</h2>
      <p className="mt-2 text-sm text-white/50">
        Confirm rights before publishing. Poster, trailer and gallery rights are required.
      </p>
      {saved ? <p className="mt-2 text-xs text-emerald-400">Saved</p> : null}
      {requiredMissing ? (
        <p className="mt-3 rounded border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-200">
          Publishing is blocked until required rights are confirmed.
        </p>
      ) : null}

      <form className="mt-8 space-y-4" onChange={(e) => autosave(e.currentTarget)}>
        <input type="hidden" name="productionId" value={productionId} />
        {RIGHTS_ITEMS.map(({ key, label }) => (
          <label
            key={key}
            className="flex items-center gap-3 rounded border border-white/10 px-4 py-3 text-sm text-white/80"
          >
            <input
              type="checkbox"
              name={key}
              defaultChecked={checklist[key]}
              className="h-4 w-4"
            />
            {label}
          </label>
        ))}

        <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
          Approval status
          <select
            name="approvalStatus"
            defaultValue={checklist.approvalStatus}
            className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>

        <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
          Verification status
          <select
            name="verificationStatus"
            defaultValue={checklist.verificationStatus}
            className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
          >
            <option value="unverified">Unverified</option>
            <option value="verified">Verified</option>
            <option value="disputed">Disputed</option>
          </select>
        </label>
      </form>
    </div>
  );
}
