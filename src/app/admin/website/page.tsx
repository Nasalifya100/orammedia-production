import { redirect } from "next/navigation";
import { readSession } from "@/pams/auth/session";
import { websiteConfigService } from "@/pams/services/website-config.service";
import { loadWebsitePreviewPayload } from "@/lib/data/homepage-loader";
import { WebsiteBuilder } from "@/app/admin/website/WebsiteBuilder";

export default async function AdminWebsitePage({
  searchParams,
}: {
  searchParams: Promise<{ published?: string; restored?: string; warn?: string }>;
}) {
  const session = await readSession();
  if (!session) redirect("/admin/login");

  const sp = await searchParams;
  const [draft, published, productions, previewPayload] = await Promise.all([
    websiteConfigService.getDraft(),
    websiteConfigService.getPublished(),
    websiteConfigService.listProductionOptions(),
    loadWebsitePreviewPayload(),
  ]);

  return (
    <div className="p-8 md:p-12">
      <p className="text-[10px] uppercase tracking-[0.28em] text-amber-500/90">
        ORAM OS
      </p>
      <h1 className="mt-3 text-3xl tracking-tight">Website Builder</h1>
      <p className="mt-2 max-w-2xl text-sm text-white/50">
        Configure the public homepage, flagship production, featured releases and
        section order. Preview uses the same components as the live site.
      </p>

      {sp.published ? (
        <p className="mt-4 text-sm text-emerald-400">Website published.</p>
      ) : null}
      {sp.restored ? (
        <p className="mt-4 text-sm text-emerald-400">Snapshot restored to draft.</p>
      ) : null}
      {sp.warn ? (
        <p className="mt-4 text-sm text-amber-300">
          {decodeURIComponent(sp.warn).split("|").join(" ")}
        </p>
      ) : null}

      <div className="mt-10">
        <WebsiteBuilder
          initialConfig={draft}
          publishedConfig={published}
          productions={productions}
          previewPayload={previewPayload}
        />
      </div>
    </div>
  );
}
