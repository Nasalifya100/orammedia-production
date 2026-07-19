"use client";

import { useState, useTransition } from "react";
import {
  addWizardCreditAction,
  createPersonAction,
  removeWizardCreditAction,
  searchPeopleAction,
} from "@/app/admin/productions/wizard/actions";
import type { WizardProduction } from "@/components/wizard/ProductionWizardShell";

const ROLES = [
  "Director",
  "Producer",
  "Executive Producer",
  "Writer",
  "Cast",
  "Cinematographer",
  "Editor",
  "Composer",
];

export function WizardCreditsStep({ production }: { production: WizardProduction }) {
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState<{ id: string; name: string }[]>([]);
  const [, startTransition] = useTransition();

  const search = (q: string) => {
    setQuery(q);
    if (q.length < 2) return;
    startTransition(async () => {
      const results = await searchPeopleAction(q);
      setPeople(results);
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h2 className="text-xl tracking-tight">People & credits</h2>
        <p className="mt-2 text-sm text-white/50">
          Search existing people or add new names without leaving the wizard.
        </p>
      </div>

      <form action={addWizardCreditAction} className="space-y-4 rounded border border-white/10 p-4">
        <input type="hidden" name="productionId" value={production.id} />
        <label className="block text-xs text-white/40">
          Search person
          <input
            value={query}
            onChange={(e) => search(e.target.value)}
            placeholder="Type to search…"
            className="mt-1 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
          />
        </label>
        {people.length > 0 ? (
          <ul className="max-h-32 overflow-y-auto border border-white/5 text-sm">
            {people.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left hover:bg-white/5"
                  onClick={() => {
                    const input = document.querySelector<HTMLInputElement>('input[name="personName"]');
                    const pid = document.querySelector<HTMLInputElement>('input[name="personId"]');
                    if (input) input.value = p.name;
                    if (pid) pid.value = p.id;
                    setPeople([]);
                  }}
                >
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <input type="hidden" name="personId" defaultValue="" />
        <input name="personName" required placeholder="Name" className="w-full border border-white/10 bg-black/40 px-3 py-2 text-sm" />
        <select name="role" className="w-full border border-white/10 bg-black/40 px-3 py-2 text-sm">
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <input type="hidden" name="department" value="crew" />
        <div className="flex gap-2">
          <button type="submit" className="bg-amber-600 px-4 py-2 text-sm text-black">Add credit</button>
          <button
            type="button"
            className="border border-white/15 px-4 py-2 text-sm text-white/60"
            onClick={() => {
              const name = (document.querySelector('input[name="personName"]') as HTMLInputElement)?.value;
              if (name) startTransition(async () => { await createPersonAction(name); });
            }}
          >
            Create person
          </button>
        </div>
      </form>

      <ul className="divide-y divide-white/5 border border-white/10">
        {production.credits.length === 0 ? (
          <li className="p-4 text-sm text-white/30">No credits yet.</li>
        ) : (
          production.credits.map((c) => (
            <li key={c.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <span>
                <strong className="text-white/90">{c.personName}</strong>
                <span className="text-white/40"> · {c.role}</span>
              </span>
              <form action={removeWizardCreditAction}>
                <input type="hidden" name="creditId" value={c.id} />
                <input type="hidden" name="productionId" value={production.id} />
                <button type="submit" className="text-xs text-red-400/80">Remove</button>
              </form>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
