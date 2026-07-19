import type {
  Award,
  ClientLogo,
  Project,
  Service,
  ShowreelConfig,
  TeamMember,
} from "@/types";
import type { NewsPost } from "@/types";

export interface WebsitePreviewPayload {
  projects: Project[];
  services: Service[];
  teamMembers: TeamMember[];
  clientLogos: ClientLogo[];
  news: NewsPost[];
  awards: Award[];
  fallbackMuxId?: string;
  showreelFallback?: ShowreelConfig;
}

export const PREVIEW_DEVICE_WIDTHS = {
  mobile: "390px",
  tablet: "768px",
  laptop: "1280px",
  desktop: "100%",
  ultrawide: "1920px",
} as const;

export type PreviewDevice = keyof typeof PREVIEW_DEVICE_WIDTHS;
