"use client";

import Link from "next/link";
import { startWizardAction } from "@/app/admin/productions/wizard/actions";

export function WizardStartForm() {
  return (
    <form
      action={startWizardAction}
      className="mx-auto mt-16 max-w-lg space-y-6 rounded border border-white/10 bg-[#101014] p-8"
    >
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-amber-500/90">
          Production Wizard
        </p>
        <h1 className="mt-3 text-2xl tracking-tight">Start a new production</h1>
        <p className="mt-2 text-sm text-white/50">
          The wizard guides you from empty draft to a published case study. Progress
          saves automatically — resume anytime.
        </p>
      </div>
      <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
        Production title
        <input
          name="title"
          required
          placeholder="e.g. Inkondo Season 2"
          className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-3 text-sm"
        />
      </label>
      <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
        Slug (optional)
        <input
          name="slug"
          placeholder="auto-generated from title"
          className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
        />
      </label>
      <button
        type="submit"
        className="w-full bg-amber-600 py-3 text-sm font-medium text-black hover:bg-amber-500"
      >
        Begin wizard →
      </button>
      <Link href="/admin/productions" className="block text-center text-xs text-white/40 hover:text-white">
        ← Back to productions
      </Link>
    </form>
  );
}
