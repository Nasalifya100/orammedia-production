import type {
  Award,
  ClientLogo,
  Project,
  Service,
  TeamMember,
  Testimonial,
} from "@/types";
import { getFacebookDerivedContent } from "@/lib/facebook/oram-media-curated";

const fb = getFacebookDerivedContent();

/** Homepage showreel — Facebook video from @oramtv */
export const SHOWREEL_VIDEO = fb.showreelVideoUrl;
export const SHOWREEL_POSTER = fb.showreelPoster;

export const projects: Project[] = [
  {
    id: "1",
    title: "Inkondo",
    slug: "inkondo",
    category: "narrative",
    description:
      "Zambezi Magic original drama of bus wars, rival families, and a love that crosses the divide — premiered 5 May 2025.",
    fullDescription:
      "Inkondo follows a multi-generational rivalry between two powerful families in a world shaped by bus wars, betrayal, and power. Fate intervenes when Chiyumba’s daughter Nampindi and Mazoka’s son Dimuna fall in love — a story told with a proudly Zambian lens. The series premiered on 5 May 2025 at 20:00 CAT on Zambezi Magic (DStv Channel 162 / GOtv Channel 3 Supa), airing Mondays, Tuesdays and Wednesdays, and streams on Showmax. An all-local creative team is led by Jackson (Jay Rox) Banda and director Owas Ray Mwape.",
    clientName: "Zambezi Magic / MultiChoice",
    year: 2025,
    duration: "Series",
    thumbnail: "/projects/inkondo-billboard.jpg",
    gallery: [
      "/projects/inkondo-billboard.jpg",
      "/projects/inkondo-maxres.jpg",
    ],
    youtubeId: "SDtK15xguG8",
    previewYoutubeId: "SDtK15xguG8",
    videoUrl: "https://www.youtube.com/watch?v=SDtK15xguG8",
    posterUrl: "/projects/inkondo-billboard.jpg",
    behindTheScenes:
      "Public announcement materials describe an all-local creative team. Oram TV documented production under the InLens-Inkondo Series across Lusaka. Named cast in the premiere announcement includes Luke Mumba, Rosheni Mwemba, Evans Phiri, Sophia Chapeshamano and Zen Vlahakis.",
    challenge:
      "Launch a new Zambezi Magic original in the wake of Zuba — a large-ensemble drama rooted in Zambian bus wars, family rivalry and romance, built for both linear broadcast and Showmax streaming.",
    approach:
      "A local creative leadership pairing of Jackson (Jay Rox) Banda and Owas Ray Mwape, with a cast mixing established and rising Zambian performers. Production was documented for audiences through Oram TV’s InLens-Inkondo Series.",
    results: [
      { value: "5 May 2025", label: "Premiere (20:00 CAT)" },
      { value: "DStv 162", label: "Zambezi Magic · GOtv 3 Supa" },
      { value: "Showmax", label: "Streaming" },
      { value: "Mon–Wed", label: "Weekly slot" },
    ],
    credits: [
      { role: "Creative lead", name: "Jackson (Jay Rox) Banda" },
      { role: "Director", name: "Owas Ray Mwape" },
      { role: "Cast", name: "Luke Mumba" },
      { role: "Cast", name: "Rosheni Mwemba" },
      { role: "Cast", name: "Evans Phiri" },
      { role: "Cast", name: "Sophia Chapeshamano" },
      { role: "Cast", name: "Zen Vlahakis" },
    ],
    featured: true,
    order: 1,
  },
  {
    id: "2",
    title: "Graft",
    slug: "graft",
    category: "narrative",
    description:
      "2024 Zambian feature drama directed and produced by Owas Ray Mwape.",
    fullDescription:
      "Graft (2024) is a Zambian drama feature listed on IMDbPro with Owas Ray Mwape as director and producer. Oram TV documented life on the Graft set during production. Public cast listings associated with the film include Sophie Mbao; additional cast names published on Oram channels await full call-sheet confirmation for the public record.",
    clientName: "Owas Films / Oram Media Dynamics",
    year: 2024,
    duration: "Feature",
    thumbnail: "/projects/graft-poster-hd.jpg",
    portraitPoster: true,
    gallery: ["/projects/graft-trailer-thumb.jpg"],
    videoUrl:
      "https://www.facebook.com/oramtv/posts/life-on-set-️owas-ray-mwape-film-director-alfred-njovu-graft-orammedia-oramtv/1721962718165889/",
    posterUrl: "/projects/graft-poster-hd.jpg",
    behindTheScenes:
      "Oram TV published on-set documentation from the Graft shoot, including footage with director Owas Ray Mwape. Formal crew credits beyond director/producer are not fully published on IMDbPro’s public summary.",
    challenge:
      "Deliver an independent Zambian feature under Owas Films / Oram Media Dynamics — a drama built for theatrical and festival-facing presentation.",
    approach:
      "Owas Ray Mwape directed and produced. Production stills and social documentation were captured during the Lusaka shoot; key art centres on a portrait theatrical poster.",
    results: [
      { value: "2024", label: "Feature (IMDbPro)" },
      { value: "Director", label: "Owas Ray Mwape" },
      { value: "Producer", label: "Owas Ray Mwape" },
    ],
    credits: [
      { role: "Director", name: "Owas Ray Mwape" },
      { role: "Producer", name: "Owas Ray Mwape" },
      { role: "Cast", name: "Sophie Mbao" },
    ],
    featured: true,
    order: 2,
  },
  {
    id: "3",
    title: "Zuba",
    slug: "zuba",
    category: "narrative",
    description:
      "Zambia’s first telenovela for Zambezi Magic — directed by Owas Ray Mwape across a landmark multi-season run.",
    fullDescription:
      "Zuba is a Zambian telenovela produced for Zambezi Magic (MultiChoice). MultiChoice Studios and press coverage describe it as Zambia’s first telenovela and name award-winning filmmaker Owas Ray Mwape as director. The series followed a young woman drawn into the drama of a wealthy urban household — love, class and power colliding in Lusaka. Public records place the show across eight seasons before its 2025 close, with episode counts reported in the thousands. Oram Media Dynamics’ fuller production scope on the series (beyond Mwape’s directing credit) should be confirmed from contracts before claiming subcontract language on the public site.",
    clientName: "Zambezi Magic / MultiChoice",
    year: 2023,
    duration: "Telenovela",
    thumbnail: "/projects/zuba-maxres.jpg",
    gallery: [
      "/projects/zuba-maxres.jpg",
      "/projects/zuba.jpg",
      "/projects/zuba-preview-maxres.jpg",
    ],
    youtubeId: "Ar2-0A16Pc8",
    previewYoutubeId: "10QYkQV3KFU",
    videoUrl: "https://www.youtube.com/watch?v=Ar2-0A16Pc8",
    posterUrl: "/projects/zuba-maxres.jpg",
    behindTheScenes:
      "MultiChoice Studios profiled the series as it reached later seasons, highlighting Mwape’s direction and the show’s hold on Zambian audiences. Oram TV and social channels carried cast and set documentation across the run.",
    challenge:
      "Sustain a daily Zambian telenovela for Zambezi Magic — Zambia’s first in the form — at the cadence and polish audiences expect from MultiChoice.",
    approach:
      "Direction led by Owas Ray Mwape, with production delivered into the Zambezi Magic / MultiChoice pipeline and later seasons available via Showmax and DStv platforms.",
    results: [
      { value: "8", label: "Seasons (series total)" },
      { value: "2017–2025", label: "On air (reported)" },
      { value: "Showmax", label: "Streaming" },
      { value: "Zambezi Magic", label: "Original home" },
    ],
    credits: [
      { role: "Director", name: "Owas Ray Mwape" },
      { role: "Network", name: "Zambezi Magic (MultiChoice)" },
    ],
    featured: true,
    order: 3,
  },
  {
    id: "4",
    title: "Look in the Mirror",
    slug: "look-in-the-mirror",
    category: "narrative",
    description:
      "2024 Zambian feature directed by Owas Ray Mwape — Lusaka premiere 5 October 2024.",
    fullDescription:
      "Look in the Mirror (2024) is a Zambian drama feature directed by Owas Ray Mwape. Public listings record a Lusaka premiere on 5 October 2024. The film sits in the Owas Films / Oram Media Dynamics slate of contemporary Zambian features alongside Graft. Cast credits beyond the director should be published from the official premiere programme when available.",
    clientName: "Owas Films / Oram Media Dynamics",
    year: 2024,
    duration: "Feature",
    thumbnail: "/projects/look-in-the-mirror.png",
    gallery: [
      "/projects/look-in-the-mirror.png",
      "/projects/look-in-the-mirror.jpg",
      "/projects/look-in-the-mirror-film.jpg",
    ],
    youtubeId: "NBg0Q-TqNf8",
    previewYoutubeId: "4HAj6fyKcJg",
    videoUrl: "https://www.youtube.com/watch?v=NBg0Q-TqNf8",
    posterUrl: "/projects/look-in-the-mirror.png",
    behindTheScenes:
      "Oram TV and social channels promoted the Lusaka premiere. Higher-resolution red-carpet photography should be added from the official press set when released.",
    challenge:
      "Bring an independent Zambian feature to a public Lusaka premiere — proving local cinema can own a premiere night with conviction.",
    approach:
      "Directed by Owas Ray Mwape under the Owas Films / Oram Media Dynamics banner, with premiere positioning in Lusaka on 5 October 2024.",
    results: [
      { value: "5 Oct 2024", label: "Lusaka premiere" },
      { value: "Feature", label: "Drama" },
      { value: "Owas Ray Mwape", label: "Director" },
    ],
    credits: [
      { role: "Director", name: "Owas Ray Mwape" },
      { role: "Production", name: "Owas Films / Oram Media Dynamics" },
    ],
    featured: true,
    order: 4,
  },
  {
    id: "5",
    title: "Youth Expo 2023",
    slug: "youth-expo-2023",
    category: "branded",
    description:
      "Event coverage for the Ministry of Youth, Sport and Arts — Youth Expo & Umuntuni Youth Week (Oram TV).",
    fullDescription:
      "Oram TV published production coverage naming the Ministry of Youth, Sport and Arts as client for Youth Expo 2023 and Umuntuni Youth Week. Independent government press kits confirming scope were not located in this research pass — treat production stills and a fuller brief as outstanding assets from Oram’s archive.",
    clientName: "Ministry of Youth, Sport and Arts",
    year: 2023,
    duration: "Event",
    thumbnail: "/partners/moysa-hd.png",
    gallery: ["/partners/moysa-hd.png"],
    videoUrl:
      "https://www.facebook.com/oramtv/videos/oram-media-dynamics-client-ministry-of-youth-sport-and-arts-youthexpo2023umuntun/747038756815619/",
    posterUrl: "/partners/moysa-hd.png",
    challenge:
      "Cover a national youth programme for ministerial and social distribution — on schedule, on brief.",
    approach:
      "Oram Media Dynamics filmed and published coverage for Youth Expo 2023 / Umuntuni Youth Week as documented on Oram TV.",
    results: [
      { value: "2023", label: "Youth Expo" },
      { value: "MoYSA", label: "Client (Oram TV)" },
    ],
    credits: [
      { role: "Production", name: "Oram Media Dynamics" },
      { role: "Client", name: "Ministry of Youth, Sport and Arts" },
    ],
    featured: false,
    order: 5,
  },
  {
    id: "6",
    title: "Zambia–India Skills Transfer",
    slug: "zambia-india-skills-transfer",
    category: "branded",
    description:
      "Film documentation of the inaugural Zambia–India skills transfer programme (Oram Media Group).",
    fullDescription:
      "Oram Media Group published coverage from the inaugural Zambia–India Skills Transfer programme, with director Owas Ray Mwape leading the production team on site. Exact commissioning ministry/agency should be confirmed before tighter client labelling.",
    clientName: "Institutional (Zambia–India programme)",
    year: 2024,
    duration: "Documentary",
    thumbnail: "/projects/zambia-india.png",
    gallery: ["/projects/zambia-india.png"],
    videoUrl:
      "https://www.facebook.com/oramtv/posts/the-oram-media-group-partners-at-the-inaugural-of-zambia-india-skills-transfer-w/1690059708022857/",
    posterUrl: "/projects/zambia-india.png",
    challenge:
      "Document a bilateral skills-transfer programme for institutional stakeholders with clear, usable film records.",
    approach:
      "Oram Media Group covered the inaugural programme on location, led by Owas Ray Mwape, as published on Oram channels.",
    results: [
      { value: "2024", label: "Programme year" },
      { value: "Inaugural", label: "Edition covered" },
    ],
    credits: [
      { role: "Director", name: "Owas Ray Mwape" },
      { role: "Production", name: "Oram Media Group" },
    ],
    featured: false,
    order: 6,
  },
  {
    id: "7",
    title: "Secrets Untold",
    slug: "secrets-untold",
    category: "narrative",
    description:
      "2015 feature directed by Owas Ray Mwape — premiered at Ster Kinekor, Lusaka.",
    fullDescription:
      "In 2015, Owas Ray Mwape directed Secrets Untold under Owas Films. The film premiered at Ster Kinekor in Lusaka — an early marker of Mwape’s shift from acting into full-time filmmaking after founding Owas Films in 2013.",
    clientName: "Owas Films",
    year: 2015,
    duration: "Feature",
    thumbnail: "/projects/secrets-untold.png",
    gallery: ["/projects/secrets-untold.png"],
    videoUrl: SHOWREEL_VIDEO,
    posterUrl: "/projects/secrets-untold.png",
    challenge:
      "Premiere an independent Zambian feature in a commercial cinema environment when local theatrical pathways were limited.",
    approach:
      "Directed by Owas Ray Mwape for Owas Films, with a Ster Kinekor Lusaka premiere positioning the film for a public audience.",
    results: [
      { value: "2015", label: "Release year" },
      { value: "Ster Kinekor", label: "Lusaka premiere" },
    ],
    credits: [
      { role: "Director", name: "Owas Ray Mwape" },
      { role: "Production", name: "Owas Films" },
    ],
    featured: false,
    order: 7,
  },
  {
    id: "8",
    title: "Strictly By Invitation",
    slug: "strictly-by-invitation",
    category: "narrative",
    description:
      "2016 feature directed by Owas Ray Mwape — written by Robam Mwape, produced by Adorah Mwape.",
    fullDescription:
      "Strictly By Invitation (2016) was directed by Owas Ray Mwape, written by Robam Mwape and produced by Adorah Mwape. The film features members of the Mwape family — including Clive, Mercy, Prudence, Katongo and Maxwell Mwape — alongside Owas, Robam and Adorah.",
    clientName: "Owas Films",
    year: 2016,
    duration: "Feature",
    thumbnail: "/projects/strictly-by-invitation.jpg",
    gallery: ["/projects/strictly-by-invitation.jpg"],
    videoUrl: SHOWREEL_VIDEO,
    posterUrl: "/projects/strictly-by-invitation.jpg",
    challenge:
      "Produce a family-centred Zambian feature with a creative team drawn from the same household — writing, producing and directing in concert.",
    approach:
      "Owas directed; Robam wrote; Adorah produced; family performers filled key roles — a closed creative unit built for intimate storytelling.",
    results: [
      { value: "2016", label: "Release year" },
      { value: "Family cast", label: "Mwape ensemble" },
    ],
    credits: [
      { role: "Director", name: "Owas Ray Mwape" },
      { role: "Writer", name: "Robam Mwape" },
      { role: "Producer", name: "Adorah Mwape" },
    ],
    featured: false,
    order: 8,
  },
];

export const services: Service[] = [
  {
    id: "1",
    title: "Pre-Production",
    slug: "pre-production",
    icon: "clapperboard",
    description:
      "Casting, script development, and production planning — from first treatment to call sheet.",
    features: [
      "Casting and talent development",
      "Script editing and story development",
      "Production management and scheduling",
      "Location scouting across Zambia",
      "Budgeting and resource planning",
      "Creative treatment writing",
    ],
    differentiators: [
      "Casting and story development experience on Zambezi Magic drama (Zuba, Inkondo)",
      "Script and schedule discipline shaped by multi-season television cadence",
      "Location and crew network across Lusaka",
    ],
    relatedProjectSlugs: ["zuba", "inkondo"],
  },
  {
    id: "2",
    title: "Production",
    slug: "production",
    icon: "camera",
    description:
      "Direction and on-set production for television drama, features, and branded films in Zambia.",
    features: [
      "Director & showrunner services",
      "Full crew and equipment packages",
      "TV series and feature film production",
      "Event and institutional video coverage",
      "Multi-camera setups",
      "On-set supervision",
    ],
    differentiators: [
      "Direction by Owas Ray Mwape — Zambezi Magic / feature credits",
      "Work delivered into DStv, GOtv and Showmax pipelines",
      "On-set documentation practice via Oram TV (e.g. InLens-Inkondo)",
    ],
    relatedProjectSlugs: ["graft", "look-in-the-mirror"],
  },
  {
    id: "3",
    title: "Post-Production",
    slug: "post-production",
    icon: "film",
    description:
      "Edit, grade and deliver for broadcast, streaming and social platforms.",
    features: [
      "Offline and online editing",
      "Color grading and finishing",
      "Sound design and mixing",
      "Motion graphics and titles",
      "Social media cuts",
      "Delivery for DStv, Showmax and digital platforms",
    ],
    differentiators: [
      "Delivery into MultiChoice broadcast workflows",
      "Social cuts for Oram TV channels",
      "Institutional and event turnaround for government clients",
    ],
    relatedProjectSlugs: ["youth-expo-2023", "zambia-india-skills-transfer"],
  },
];

/**
 * Testimonials intentionally empty until Oram supplies written permission
 * and real headshots. Do not use Unsplash faces for named people.
 */
export const testimonials: Testimonial[] = [];

export const awards: Award[] = [
  {
    id: "1",
    name: "Best Actor",
    year: 1992,
    organization: "Zambian National Film Awards",
  },
  {
    id: "2",
    name: "Best Actor",
    year: 1991,
    organization: "Zambian National Film Awards",
  },
  {
    id: "3",
    name: "Best Actor",
    year: 1990,
    organization: "Zambian National Film Awards",
  },
  {
    id: "4",
    name: "Zambian Oscars Committee",
    year: 2022,
    organization: "Film Industry Leadership",
  },
  {
    id: "5",
    name: "Ster Kinekor Premiere",
    year: 2015,
    organization: "Secrets Untold — Lusaka",
  },
];

export const clientLogos: ClientLogo[] = [
  {
    id: "1",
    name: "Zambezi Magic",
    logo: "Zambezi Magic",
    logoSrc: "/partners/zambezi-magic.png",
    url: "https://www.dstv.com/zambezi-magic/",
  },
  {
    id: "2",
    name: "DStv",
    logo: "DStv",
    logoSrc: "/partners/dstv.svg",
    url: "https://www.dstv.com/",
  },
  {
    id: "3",
    name: "Showmax",
    logo: "Showmax",
    logoSrc: "/partners/showmax-color.png",
    url: "https://www.showmax.com/",
  },
  {
    id: "4",
    name: "Elixir Media",
    logo: "Elixir Media",
    logoSrc: "/partners/elixir-media.svg",
    monochrome: true,
  },
  {
    id: "5",
    name: "MultiChoice",
    logo: "MultiChoice",
    logoSrc: "/partners/multichoice.svg",
    url: "https://www.multichoice.com/",
  },
  {
    id: "6",
    name: "Ministry of Youth Sport and Arts",
    logo: "MoYSA",
    logoSrc: "/partners/moysa-hd.png",
    url: "https://www.mysa.gov.zm/",
  },
  {
    id: "7",
    name: "Owas Films",
    logo: "Owas Films",
    logoSrc: "/partners/owas-films.svg",
    monochrome: true,
    url: "https://www.facebook.com/owas.mwape/",
  },
  {
    id: "8",
    name: "Oram TV",
    logo: "Oram TV",
    logoSrc: "/brand/oram-media-logo.png",
    url: "https://www.facebook.com/oramtv/",
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Owas Ray Mwape",
    role: "CEO & Film Director",
    bio: "Zambian actor, director and producer. National Best Actor awards in 1990, 1991 and 1992. Founded Owas Films in 2013; leads Oram Media Dynamics. Public credits include directing Zuba for Zambezi Magic, creative leadership on Inkondo, and features Graft and Look in the Mirror.",
    photo: "/about/owas-ray-mwape.webp",
    social: {
      facebook: "https://www.facebook.com/owas.mwape/",
      instagram: "https://www.instagram.com/owasmwape/",
    },
  },
  {
    id: "2",
    name: "Adorah Mwape",
    role: "Executive Producer",
    bio: "Actress, scriptwriter, producer, and director behind Owas Crystal Films. Producer of Strictly By Invitation and award-winning titles including Secrets Untold, Mufaya, and Chenda.",
    photo: "/about/adorah-mwape.png",
    social: { facebook: "https://www.facebook.com/oramtv/" },
  },
  {
    id: "3",
    name: "Production Team",
    role: "Oram Media Dynamics Crew",
    bio: "A production team ever on the move to create content — delivering a creative edge to viewers across Zambia and Southern Africa via Oram TV and Oram Entertainment TV.",
    photo: "/about/mwape-multichoice-awards.jpg",
    social: { instagram: "https://www.instagram.com/orammediad/" },
  },
];

export const studioImages = [
  "/projects/inkondo-maxres.jpg",
  "/projects/look-in-the-mirror.jpg",
  "/projects/zuba-preview-maxres.jpg",
] as const;

export const studioImageAlts = [
  "On set for Inkondo — a tense scene captured during production for Zambezi Magic",
  "Cinematic still from Look in the Mirror, directed by Owas Ray Mwape",
  "Production still from Zuba — Oram Media Dynamics for Zambezi Magic",
];

export const siteConfig = fb.siteConfig;

export function getFeaturedProjects(): Project[] {
  return projects
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectsByCategory(category: string): Project[] {
  const sorted = [...projects].sort((a, b) => a.order - b.order);
  if (category === "all") return sorted;
  return sorted.filter((p) => p.category === category);
}

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getTestimonialsByService(slug: string): Testimonial[] {
  return testimonials.filter((t) => t.relatedService === slug);
}

/** Blog/news items derived from Facebook posts */
export function getNewsFromFacebook() {
  return fb.posts.map((post, i) => ({
    id: post.id,
    title: post.message?.split("\n")[0]?.slice(0, 80) ?? `Update ${i + 1}`,
    excerpt: post.message ?? "",
    date: post.createdTime,
    url: post.permalinkUrl,
    image: post.fullPicture,
  }));
}
