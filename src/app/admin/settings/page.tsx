import { redirect } from "next/navigation";
import { readSession } from "@/pams/auth/session";
import { siteSettingsService } from "@/pams/services/site-settings.service";
import { updateSiteSettingsAction } from "@/app/admin/actions";

export default async function AdminSettingsPage() {
  const session = await readSession();
  if (!session) redirect("/admin/login");

  const [hero, poster, flagship] = await Promise.all([
    siteSettingsService.getHomepageHero(),
    siteSettingsService.getShowreelPoster(),
    siteSettingsService.getFlagshipSlug(),
  ]);

  return (
    <div className="p-8 md:p-12">
      <p className="text-[10px] uppercase tracking-[0.28em] text-amber-500/90">
        Settings
      </p>
      <h1 className="mt-3 text-3xl tracking-tight">Site settings (legacy)</h1>
      <p className="mt-2 max-w-xl text-sm text-white/50">
        Homepage hero, flagship and featured content are managed in{" "}
        <a href="/admin/website" className="text-amber-400 hover:underline">
          Website Builder
        </a>
        . These fields remain for backward compatibility.
      </p>

      <form action={updateSiteSettingsAction} className="mt-10 max-w-xl space-y-5">
        <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
          Homepage hero path
          <input
            name="homepageHero"
            defaultValue={hero}
            className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
          Showreel / video poster path
          <input
            name="showreelPoster"
            defaultValue={poster}
            className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.14em] text-white/40">
          Flagship production slug
          <input
            name="flagshipSlug"
            defaultValue={flagship}
            className="mt-2 w-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
          />
        </label>
        <button
          type="submit"
          className="bg-amber-600 px-5 py-2.5 text-sm font-medium text-black"
        >
          Save settings
        </button>
      </form>
    </div>
  );
}
