import { redirect } from "next/navigation";
import { readSession } from "@/pams/auth/session";
import { statsService } from "@/pams/services/stats.service";

export default async function AdminReportsPage() {
  const session = await readSession();
  if (!session) redirect("/admin/login");
  const stats = await statsService.dashboard();

  const rows = [
    ["Archive completeness", `${stats.completeness}%`],
    ["Missing posters (published)", String(stats.missingPosters)],
    ["Missing trailers (published)", String(stats.missingTrailers)],
    ["Missing BTS (published)", String(stats.missingBts)],
    ["Open verification items", String(stats.verificationOpen)],
    ["Pending rights records", String(stats.rightsPending)],
    ["Website coverage (published)", String(stats.published)],
    ["Total media assets", String(stats.media)],
  ];

  return (
    <div className="p-8 md:p-12">
      <p className="text-[10px] uppercase tracking-[0.28em] text-amber-500/90">
        Reports
      </p>
      <h1 className="mt-3 text-3xl tracking-tight">Archive statistics</h1>
      <table className="mt-10 w-full max-w-2xl text-sm">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-b border-white/10">
              <td className="py-3 text-white/60">{label}</td>
              <td className="py-3 text-right tabular-nums text-white">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
