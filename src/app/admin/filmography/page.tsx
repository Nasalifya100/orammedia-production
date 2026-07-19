import { redirect } from "next/navigation";
import { readSession } from "@/pams/auth/session";
import { getDb } from "@/pams/db";

export default async function AdminFilmographyPage() {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  const db = await getDb();

  const [oram, owas] = await Promise.all([
    db.filmographyEntry.findMany({
      where: { collection: "oram" },
      orderBy: { sortOrder: "asc" },
    }),
    db.filmographyEntry.findMany({
      where: { collection: "owas" },
      orderBy: [{ year: "desc" }, { title: "asc" }],
    }),
  ]);

  return (
    <div className="p-8 md:p-12">
      <p className="text-[10px] uppercase tracking-[0.28em] text-amber-500/90">
        Filmography Manager
      </p>
      <h1 className="mt-3 text-3xl tracking-tight">Two collections</h1>
      <p className="mt-2 max-w-2xl text-sm text-white/50">
        ORAM Productions and Owas Ray Mwape Filmography are linked but never
        merged. Accuracy over quantity.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="text-sm uppercase tracking-[0.18em] text-white/60">
            Collection One — ORAM ({oram.length})
          </h2>
          <ul className="mt-4 space-y-2">
            {oram.map((e) => (
              <li
                key={e.id}
                className="border border-white/10 bg-[#121216] px-4 py-3 text-sm"
              >
                <p className="text-white">{e.title}</p>
                <p className="mt-1 text-xs text-white/40">
                  {e.year || "—"} · {e.oramInvolvement || "—"}
                </p>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-sm uppercase tracking-[0.18em] text-white/60">
            Collection Two — Owas ({owas.length})
          </h2>
          <ul className="mt-4 max-h-[70vh] space-y-2 overflow-y-auto">
            {owas.map((e) => (
              <li
                key={e.id}
                className="border border-white/10 bg-[#121216] px-4 py-3 text-sm"
              >
                <p className="text-white">{e.title}</p>
                <p className="mt-1 text-xs text-white/40">
                  {e.year || "—"} · {e.notes || e.oramInvolvement || "—"}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
