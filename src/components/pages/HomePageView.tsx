import { DynamicHomepage } from "@/components/home/DynamicHomepage";
import {
  loadHomepageData,
  type WebsiteDataScope,
} from "@/lib/data/homepage-loader";

interface HomePageViewProps {
  scope: WebsiteDataScope;
}

/** Shared homepage renderer — production and preview use this identical tree */
export async function HomePageView({ scope }: HomePageViewProps) {
  const data = await loadHomepageData(scope);

  if (data.config.maintenanceMode && scope === "published") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <p className="eyebrow mb-4">Maintenance</p>
        <h1 className="display display-md text-foreground">
          {data.config.siteName} is being updated
        </h1>
        <p className="mt-4 max-w-md text-ink-dim">
          We&apos;re refreshing the site. Please check back shortly.
        </p>
      </div>
    );
  }

  return (
    <DynamicHomepage
      config={data.config}
      showreel={data.showreel}
      projects={data.featuredProjects}
      services={data.services}
      teamMembers={data.teamMembers}
      clientLogos={data.clientLogos}
      news={data.news}
      awards={data.awards}
    />
  );
}
