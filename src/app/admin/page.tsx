import Link from "next/link";
import { redirect } from "next/navigation";
import { readSession } from "@/pams/auth/session";
import { statsService } from "@/pams/services/stats.service";
import { wizardService } from "@/pams/services/wizard.service";
import { WIZARD_STEPS } from "@/pams/types/wizard";

export default async function AdminDashboardPage() {
  const session = await readSession();
  if (!session) redirect("/admin/login");

  const [stats, mission] = await Promise.all([
    statsService.dashboard(),
    wizardService.missionControl(),
  ]);

  const cards = [
    { label: "Draft productions", value: mission.drafts },
    { label: "Awaiting approval", value: mission.awaitingApproval },
    { label: "Ready to publish", value: mission.readyToPublish },
    { label: "Published today", value: mission.publishedToday },
    { label: "Total productions", value: stats.productions },
    { label: "Published", value: stats.published },
    { label: "Media assets", value: stats.media },
    { label: "Completeness", value: `${stats.completeness}%` },
  ];

  return (
    <div className="p-8 md:p-12">
      <p className="text-[10px] uppercase tracking-[0.28em] text-amber-500/90">
        Mission Control
      </p>
      <h1 className="mt-3 text-3xl tracking-tight">Archive operating system</h1>
      <p className="mt-2 max-w-2xl text-sm text-white/50">
        Welcome, {session.name}. Track wizard progress and publish readiness from one desk.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="border border-white/10 bg-[#121216] px-4 py-5"
          >
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
              {c.label}
            </p>
            <p className="mt-3 text-2xl tabular-nums">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <section className="border border-white/10 bg-[#121216] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm uppercase tracking-[0.18em] text-white/60">
              Wizard progress
            </h2>
            <Link href="/admin/productions/wizard" className="text-xs text-amber-400 hover:text-amber-300">
              New production →
            </Link>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            {mission.wizardProgress.length === 0 ? (
              <li className="text-white/30">No in-progress wizards.</li>
            ) : (
              mission.wizardProgress.map((w) => (
                <li key={w.id} className="border-b border-white/5 pb-3">
                  <Link href={`/admin/productions/${w.id}/wizard`} className="font-medium text-white/90 hover:text-amber-400">
                    {w.title}
                  </Link>
                  <div className="mt-2 flex items-center gap-3 text-xs text-white/40">
                    <span>
                      {WIZARD_STEPS.find((s) => s.id === w.step)?.label ?? w.step}
                    </span>
                    <span className="tabular-nums text-amber-300">{w.percent}%</span>
                    <span>{w.media} media · {w.credits} credits</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full bg-amber-500" style={{ width: `${w.percent}%` }} />
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="border border-white/10 bg-[#121216] p-6">
          <h2 className="text-sm uppercase tracking-[0.18em] text-white/60">
            Recently started
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {mission.recentlyStarted.length === 0 ? (
              <li className="text-white/30">No recent drafts.</li>
            ) : (
              mission.recentlyStarted.map((p) => (
                <li key={p.id} className="flex justify-between border-b border-white/5 py-2">
                  <Link href={`/admin/productions/${p.id}/wizard`} className="text-white/80 hover:text-amber-400">
                    {p.title}
                  </Link>
                  <span className="text-xs text-white/30">
                    {WIZARD_STEPS.find((s) => s.id === p.wizardStep)?.label ?? "Overview"}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/admin/productions/wizard"
          className="bg-amber-600 px-4 py-2.5 text-sm font-medium text-black hover:bg-amber-500"
        >
          Start production wizard
        </Link>
        <Link
          href="/admin/productions"
          className="border border-white/15 px-4 py-2.5 text-sm text-white/80 hover:border-white/30"
        >
          All productions
        </Link>
        <Link
          href="/admin/website"
          className="border border-white/15 px-4 py-2.5 text-sm text-white/80 hover:border-white/30"
        >
          Website builder
        </Link>
      </div>
    </div>
  );
}
