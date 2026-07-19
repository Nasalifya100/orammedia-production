import { redirect } from "next/navigation";
import { readSession } from "@/pams/auth/session";
import { getDb } from "@/pams/db";

export default async function AdminVerificationPage() {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  const db = await getDb();
  const items = await db.verificationItem.findMany({
    where: { status: "open" },
    include: { production: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 md:p-12">
      <p className="text-[10px] uppercase tracking-[0.28em] text-amber-500/90">
        Verification Queue
      </p>
      <h1 className="mt-3 text-3xl tracking-tight">Open items</h1>
      <p className="mt-2 text-sm text-white/50">{items.length} unresolved</p>
      <ul className="mt-10 space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="border border-amber-500/20 bg-[#121216] px-4 py-4 text-sm"
          >
            <p className="text-amber-400/90">
              {item.production?.title || "General"} · {item.field}
            </p>
            <p className="mt-2 text-white/80">{item.claim}</p>
            {item.sourceUrl ? (
              <a
                href={item.sourceUrl}
                className="mt-2 inline-block text-xs text-white/40 hover:text-white"
                target="_blank"
                rel="noreferrer"
              >
                {item.source}
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
