import Link from "next/link";
import { readSession } from "@/pams/auth/session";
import { logoutAction } from "@/pams/auth/actions";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/website", label: "Website Builder" },
  { href: "/admin/productions/wizard", label: "Production Wizard" },
  { href: "/admin/productions", label: "Productions" },
  { href: "/admin/filmography", label: "Filmography" },
  { href: "/admin/people", label: "People" },
  { href: "/admin/media", label: "DAM / Media" },
  { href: "/admin/trailers", label: "Trailers" },
  { href: "/admin/verification", label: "Verification" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await readSession();

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#f2f2f0]">
      <div className="flex min-h-screen">
        {session ? (
          <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#101014] p-6 md:block">
            <p className="text-[10px] uppercase tracking-[0.28em] text-amber-500/90">
              PAMS
            </p>
            <h1 className="mt-2 text-lg font-medium tracking-tight">
              ORAM Archive
            </h1>
            <p className="mt-1 text-xs text-white/40">{session.name}</p>
            <nav className="mt-10 flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <form action={logoutAction} className="mt-10">
              <button
                type="submit"
                className="text-xs uppercase tracking-[0.18em] text-white/40 hover:text-white"
              >
                Sign out
              </button>
            </form>
            <Link
              href="/"
              className="mt-4 block text-xs text-white/30 hover:text-white/60"
            >
              ← Public site
            </Link>
          </aside>
        ) : null}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
