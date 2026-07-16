/** Mux playback ID for a video asset */
export type MuxPlaybackId = string;

export interface VideoSource {
  /** Mux playback ID — preferred for high-bitrate streaming */
  muxPlaybackId?: string;
  /** Direct MP4/WebM URL fallback */
  videoUrl?: string;
  /** Poster/thumbnail image URL */
  posterUrl?: string;
}

export type ProjectCategory =
  | "commercial"
  | "narrative"
  | "music-video"
  | "branded";

export type ProjectCategoryFilter = "all" | ProjectCategory;

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  description: string;
  fullDescription: string;
  clientName: string;
  year: number;
  duration: string;
  thumbnail: string;
  gallery: string[];
  videoUrl: string;
  posterUrl: string;
  muxPlaybackId?: string;
  /** Official YouTube trailer ID (Zambezi Magic / Oram TV) */
  youtubeId?: string;
  /** Optional shorter clip for hover preview */
  previewYoutubeId?: string;
  behindTheScenes?: string;
  /** Case-study narrative */
  challenge?: string;
  approach?: string;
  /** Outcome metrics, e.g. { value: "600+", label: "Episodes delivered" } */
  results?: { value: string; label: string }[];
  /** Production credits, e.g. { role: "Director", name: "Owas Ray Mwape" } */
  credits?: { role: string; name: string }[];
  /** True when the key art is a portrait poster (never stretch into landscape) */
  portraitPoster?: boolean;
  featured: boolean;
  order: number;
}

export interface ShowreelConfig {
  muxPlaybackId?: string;
  videoUrl: string;
  posterUrl: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  social: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  icon: string;
  description: string;
  features: string[];
  differentiators: string[];
  relatedProjectSlugs: string[];
}

export interface Testimonial {
  id: string;
  clientName: string;
  company: string;
  quote: string;
  photo: string;
  relatedService?: string;
}

export interface Award {
  id: string;
  name: string;
  year: number;
  organization: string;
  logo?: string;
}

export interface ClientLogo {
  id: string;
  name: string;
  /** Text fallback for accessibility */
  logo: string;
  /** Path or URL to logo image (SVG/PNG) */
  logoSrc: string;
  /** Optional partner website */
  url?: string;
  /** Apply white monochrome treatment on dark backgrounds */
  monochrome?: boolean;
}

export type ProjectType =
  | "commercial"
  | "narrative"
  | "music-video"
  | "corporate"
  | "other";

export type BudgetRange =
  | "under-50k"
  | "50k-100k"
  | "100k-250k"
  | "250k-500k"
  | "500k-plus";

export interface ContactFormData {
  projectType: ProjectType;
  budgetRange: BudgetRange;
  timeline: string;
  description: string;
  companyName: string;
  fullName: string;
  email: string;
  phone: string;
}
