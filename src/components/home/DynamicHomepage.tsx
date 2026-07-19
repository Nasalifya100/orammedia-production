import { HeroShowreel } from "@/components/home/HeroShowreel";
import { ManifestoSection } from "@/components/home/ManifestoSection";
import { SelectedWork } from "@/components/home/SelectedWork";
import { CapabilitiesSection } from "@/components/home/CapabilitiesSection";
import { PartnersMarquee } from "@/components/home/PartnersMarquee";
import { FounderSection } from "@/components/home/FounderSection";
import { NewsSection } from "@/components/home/NewsSection";
import { CTASection } from "@/components/home/CTASection";
import { AwardsSection } from "@/components/home/AwardsSection";
import { AnnouncementBanner } from "@/components/home/AnnouncementBanner";
import type { WebsiteConfiguration } from "@/pams/types/website-config";
import type {
  Award,
  ClientLogo,
  Project,
  Service,
  ShowreelConfig,
  TeamMember,
} from "@/types";
import type { NewsPost } from "@/types";

interface DynamicHomepageProps {
  config: WebsiteConfiguration;
  showreel: ShowreelConfig;
  projects: Project[];
  services: Service[];
  teamMembers: TeamMember[];
  clientLogos: ClientLogo[];
  news: NewsPost[];
  awards: Award[];
}

function sortedSections(config: WebsiteConfiguration) {
  return [...config.sections]
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);
}

export function DynamicHomepage({
  config,
  showreel,
  projects,
  services,
  teamMembers,
  clientLogos,
  news,
  awards,
}: DynamicHomepageProps) {
  const sections = sortedSections(config);
  const resolved = config.resolvedFlagship;
  const heroAlt = resolved?.productionTitle
    ? `${resolved.productionTitle} — ${config.siteName}`
    : config.siteName;

  return (
    <>
      {config.announcementBanner.enabled ? (
        <AnnouncementBanner banner={config.announcementBanner} />
      ) : null}

      {sections.map((section) => {
        switch (section.type) {
          case "hero":
            return (
              <HeroShowreel
                key={section.id}
                showreel={showreel}
                headline={config.homepageHeadline}
                subheadline={config.homepageSubheadline}
                eyebrow={config.homepageEyebrow}
                ctaPrimary={config.homepageCtaPrimary}
                ctaSecondary={config.homepageCtaSecondary}
                heroAlt={heroAlt}
              />
            );
          case "about":
            if (section.settings?.variant === "founder") {
              return (
                <FounderSection key={section.id} members={teamMembers} />
              );
            }
            return <ManifestoSection key={section.id} />;
          case "featured":
            return (
              <SelectedWork
                key={section.id}
                projects={projects}
                eyebrow="Selected Work"
                heading="Recent releases"
              />
            );
          case "services":
            return (
              <CapabilitiesSection key={section.id} services={services} />
            );
          case "partners":
            return (
              <PartnersMarquee key={section.id} logos={clientLogos} />
            );
          case "journal":
            return <NewsSection key={section.id} posts={news} />;
          case "contact-cta":
            return <CTASection key={section.id} />;
          case "awards":
            return <AwardsSection key={section.id} awards={awards} />;
          case "bts":
            return null;
          case "footer":
            return null;
          default:
            return null;
        }
      })}
    </>
  );
}
