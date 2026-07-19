import { redirect } from "next/navigation";
import { readSession } from "@/pams/auth/session";
import { getDb } from "@/pams/db";

export default async function AdminPeoplePage() {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  const db = await getDb();
  const people = await db.person.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="p-8 md:p-12">
      <p className="text-[10px] uppercase tracking-[0.28em] text-amber-500/90">
        People Manager
      </p>
      <h1 className="mt-3 text-3xl tracking-tight">People</h1>
      <p className="mt-2 text-sm text-white/50">{people.length} records</p>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p) => (
          <li key={p.id} className="border border-white/10 bg-[#121216] p-4">
            <p className="text-white">{p.name}</p>
            <p className="mt-1 text-xs text-white/40">{p.slug}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
