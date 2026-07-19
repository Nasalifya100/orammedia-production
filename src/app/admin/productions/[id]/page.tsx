import { redirect } from "next/navigation";
import { readSession } from "@/pams/auth/session";
import { productionService } from "@/pams/services/production.service";
import { updateProductionAction } from "@/app/admin/actions";

export default async function AdminProductionEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const session = await readSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const sp = await searchParams;
  const production = await productionService.getAdmin(id);
  if (!production) redirect("/admin/productions");

  const field = (
    name: string,
    label: string,
    value: string | number | null | undefined,
    multiline = false,
  ) => (
    <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
      {label}
      {multiline ? (
        <textarea
          name={name}
          rows={5}
          defaultValue={value ?? ""}
          className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-amber-500/40"
        />
      ) : (
        <input
          name={name}
          defaultValue={value ?? ""}
          className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-amber-500/40"
        />
      )}
    </label>
  );

  return (
    <div className="p-8 md:p-12">
      <p className="text-[10px] uppercase tracking-[0.28em] text-amber-500/90">
        Edit production
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <h1 className="text-3xl tracking-tight">{production.title}</h1>
        <a
          href={`/admin/productions/${production.id}/media`}
          className="border border-amber-500/40 px-4 py-2 text-xs uppercase tracking-wider text-amber-300 hover:bg-amber-500/10"
        >
          Media Manager →
        </a>
      </div>
      {sp.saved ? (
        <p className="mt-2 text-sm text-emerald-400">Saved. Public site will refresh.</p>
      ) : null}

      <form action={updateProductionAction} className="mt-10 max-w-4xl space-y-6">
        <input type="hidden" name="id" value={production.id} />
        <div className="grid gap-6 md:grid-cols-2">
          {field("title", "Title", production.title)}
          {field("slug", "Slug", production.slug)}
          {field("year", "Year", production.year ?? "")}
          {field("sortOrder", "Sort order", production.sortOrder)}
          {field("runtime", "Runtime / format", production.runtime)}
          <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
            Archival classification
            <select
              name="archivalCategory"
              defaultValue={production.archivalCategory}
              className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
            >
              <option value="oram-production">ORAM Production</option>
              <option value="oram-co-production">ORAM Co-Production</option>
              <option value="oram-service">ORAM Service</option>
              <option value="directed-by-owas">Directed by Owas</option>
              <option value="produced-by-owas">Produced by Owas</option>
              <option value="executive-produced-by-owas">
                Executive Produced by Owas
              </option>
              <option value="personal-filmography">Personal Filmography</option>
              <option value="acting-credit-only">Acting Credit Only</option>
              <option value="requires-verification">Requires Verification</option>
            </select>
          </label>
          <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
            Workflow
            <select
              name="workflowStatus"
              defaultValue={production.workflowStatus}
              className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
            >
              {[
                "draft",
                "research",
                "verification",
                "media-review",
                "rights-review",
                "ready",
                "published",
                "archived",
              ].map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </label>
        </div>

        {field("synopsis", "Synopsis", production.synopsis, true)}
        {field("story", "Story / full description", production.story, true)}
        {field("challenge", "Challenge", production.challenge, true)}
        {field(
          "creativeDirection",
          "Creative direction",
          production.creativeDirection,
          true,
        )}
        {field(
          "productionProcess",
          "Production process",
          production.productionProcess,
          true,
        )}
        {field(
          "behindTheScenes",
          "Behind the scenes",
          production.behindTheScenes,
          true,
        )}
        {field("oramRole", "ORAM role", production.oramRole, true)}
        {field("owasRole", "Owas role", production.owasRole, true)}
        {field(
          "productionCompanyText",
          "Production company",
          production.productionCompanyText,
        )}
        {field("clientNameText", "Client", production.clientNameText)}
        {field("broadcaster", "Broadcaster", production.broadcaster)}
        {field(
          "streamingPlatform",
          "Streaming platform",
          production.streamingPlatform,
        )}

        <div className="flex flex-wrap gap-6 text-sm">
          <label className="flex items-center gap-2 text-white/70">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={production.featured}
            />
            Featured on homepage
          </label>
          <label className="flex items-center gap-2 text-white/70">
            <input
              type="checkbox"
              name="published"
              defaultChecked={production.published}
            />
            Published
          </label>
          <label className="flex items-center gap-2 text-white/70">
            <input
              type="checkbox"
              name="portraitPoster"
              defaultChecked={production.portraitPoster}
            />
            Portrait poster
          </label>
        </div>

        <button
          type="submit"
          className="bg-amber-600 px-6 py-3 text-sm font-medium text-black hover:bg-amber-500"
        >
          Save production
        </button>
      </form>

      <section className="mt-14 border-t border-white/10 pt-10">
        <h2 className="text-sm uppercase tracking-[0.18em] text-white/50">
          Media ({production.media.length})
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {production.media.map((m) => (
            <li
              key={m.id}
              className="border border-white/10 bg-[#121216] p-3 text-xs text-white/60"
            >
              <p className="text-white/90">{m.role}</p>
              <p className="mt-1 break-all">{m.path}</p>
              <p className="mt-2 text-white/30">
                {m.approvalStatus} · {m.archiveStatus}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-sm uppercase tracking-[0.18em] text-white/50">
          Trailers ({production.trailers.length})
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-white/60">
          {production.trailers.map((t) => (
            <li key={t.id} className="border border-white/10 px-4 py-3">
              {t.platform} · {t.youtubeId || t.url}{" "}
              {t.preferred ? (
                <span className="text-amber-400">(preferred)</span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
