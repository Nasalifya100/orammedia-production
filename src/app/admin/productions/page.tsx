import Link from "next/link";
import { redirect } from "next/navigation";
import { readSession } from "@/pams/auth/session";
import { productionService } from "@/pams/services/production.service";
import { WIZARD_STEPS } from "@/pams/types/wizard";

export default async function AdminProductionsPage() {
  const session = await readSession();
  if (!session) redirect("/admin/login");

  const productions = await productionService.listAdmin();

  return (
    <div className="p-8 md:p-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-amber-500/90">
            Production Manager
          </p>
          <h1 className="mt-3 text-3xl tracking-tight">Productions</h1>
        </div>
        <Link
          href="/admin/productions/wizard"
          className="bg-amber-600 px-5 py-2.5 text-sm font-medium text-black hover:bg-amber-500"
        >
          New production wizard →
        </Link>
      </div>

      <div className="mt-10 overflow-x-auto border border-white/10">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-white/5 text-[10px] uppercase tracking-[0.16em] text-white/40">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Classification</th>
              <th className="px-4 py-3">Workflow</th>
              <th className="px-4 py-3">Media</th>
              <th className="px-4 py-3">Published</th>
            </tr>
          </thead>
          <tbody>
            {productions.map((p) => (
              <tr key={p.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3 tabular-nums text-white/40">
                  {p.sortOrder}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/productions/${p.id}/wizard`}
                    className="text-white hover:text-amber-400"
                  >
                    {p.title}
                  </Link>
                  <p className="text-xs text-white/30">{p.slug}</p>
                  {!p.published && p.wizardStep ? (
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-white/25">
                      Wizard · {WIZARD_STEPS.find((s) => s.id === p.wizardStep)?.label ?? p.wizardStep}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-white/60">{p.archivalCategory}</td>
                <td className="px-4 py-3 text-white/60">{p.workflowStatus}</td>
                <td className="px-4 py-3 tabular-nums text-white/40">
                  {p._count.media}/{p._count.trailers}
                </td>
                <td className="px-4 py-3">
                  {p.published ? (
                    <span className="text-emerald-400">Live</span>
                  ) : (
                    <span className="text-white/30">No</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
