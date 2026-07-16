import { HeroShowreel } from "@/components/home/HeroShowreel";
import { ManifestoSection } from "@/components/home/ManifestoSection";
import { SelectedWork } from "@/components/home/SelectedWork";
import { CapabilitiesSection } from "@/components/home/CapabilitiesSection";
import { PartnersMarquee } from "@/components/home/PartnersMarquee";
import { FounderSection } from "@/components/home/FounderSection";
import { NewsSection } from "@/components/home/NewsSection";
import { CTASection } from "@/components/home/CTASection";
import {
  getProjects,
  getServices,
  getTeamMembers,
  getClientLogos,
  getShowreelConfig,
  getNewsPosts,
} from "@/lib/data";

export const revalidate = 3600;

export default async function HomePage() {
  const [allProjects, services, teamMembers, clientLogos, showreel, news] =
    await Promise.all([
      getProjects(),
      getServices(),
      getTeamMembers(),
      getClientLogos(),
      getShowreelConfig(),
      getNewsPosts(),
    ]);

  return (
    <>
      <HeroShowreel showreel={showreel} />
      <ManifestoSection />
      <SelectedWork projects={allProjects} />
      <CapabilitiesSection services={services} />
      <PartnersMarquee logos={clientLogos} />
      <FounderSection members={teamMembers} />
      <NewsSection posts={news} />
      <CTASection />
    </>
  );
}
