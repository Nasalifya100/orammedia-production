import { redirect } from "next/navigation";
import { readSession } from "@/pams/auth/session";
import { getDb } from "@/pams/db";

export default async function AdminTrailersPage() {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  const db = await getDb();
  const trailers = await db.trailer.findMany({
    include: { production: { select: { title: true, slug: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="p-8 md:p-12">
      <p className="text-[10px] uppercase tracking-[0.28em] text-amber-500/90">
        Trailer Manager
      </p>
      <h1 className="mt-3 text-3xl tracking-tight">Trailers</h1>
      <ul className="mt-10 space-y-3">
        {trailers.map((t) => (
          <li
            key={t.id}
            className="border border-white/10 bg-[#121216] px-4 py-4 text-sm"
          >
            <p className="text-white">
              {t.production.title}
              {t.preferred ? (
                <span className="ml-2 text-amber-400">preferred</span>
              ) : null}
            </p>
            <p className="mt-1 text-white/50">
              {t.platform} · {t.officialStatus} · {t.youtubeId || t.url || "—"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
