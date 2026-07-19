import { redirect } from "next/navigation";
import { readSession } from "@/pams/auth/session";
import { websiteConfigService } from "@/pams/services/website-config.service";
import {
  createWebsiteSnapshotAction,
  restoreWebsiteSnapshotAction,
} from "@/app/admin/website/actions";

export default async function WebsiteSnapshotsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  const sp = await searchParams;
  const snapshots = await websiteConfigService.listSnapshots();

  return (
    <div className="p-8 md:p-12">
      <p className="text-[10px] uppercase tracking-[0.28em] text-amber-500/90">
        Website Builder
      </p>
      <h1 className="mt-3 text-3xl tracking-tight">Snapshots</h1>
      <p className="mt-2 max-w-xl text-sm text-white/50">
        Save named versions and restore any previous website configuration with one click.
      </p>

      {sp.saved ? (
        <p className="mt-4 text-sm text-emerald-400">Snapshot saved.</p>
      ) : null}

      <form action={createWebsiteSnapshotAction} className="mt-8 max-w-md space-y-3">
        <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
          Snapshot name
          <input
            name="name"
            placeholder="2025 Launch, Inkondo Campaign…"
            required
            className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
          Description (optional)
          <input
            name="description"
            className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
          />
        </label>
        <button
          type="submit"
          className="bg-amber-600 px-5 py-2.5 text-sm font-medium text-black"
        >
          Save current draft
        </button>
      </form>

      <ul className="mt-12 divide-y divide-white/10 border-t border-white/10">
        {snapshots.length === 0 ? (
          <li className="py-6 text-sm text-white/40">No snapshots yet.</li>
        ) : (
          snapshots.map((snap) => (
            <li
              key={snap.id}
              className="flex flex-wrap items-center gap-4 py-4"
            >
              <div className="flex-1">
                <p className="font-medium">{snap.name}</p>
                {snap.description ? (
                  <p className="text-xs text-white/40">{snap.description}</p>
                ) : null}
                <p className="mt-1 text-[10px] text-white/30">
                  {snap.createdAt.toLocaleString()}
                  {snap.createdBy ? ` · ${snap.createdBy.name}` : ""}
                </p>
              </div>
              <form action={restoreWebsiteSnapshotAction}>
                <input type="hidden" name="id" value={snap.id} />
                <button
                  type="submit"
                  className="border border-white/20 px-4 py-2 text-xs uppercase tracking-wider hover:bg-white/5"
                >
                  Restore
                </button>
              </form>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
