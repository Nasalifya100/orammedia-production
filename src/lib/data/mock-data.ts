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
      "A Zambezi Magic original: rival families, bus-war territory, and a love that crosses the line — premiered 5 May 2025.",
    fullDescription:
      "Inkondo is a dramatic tale of forbidden love between the children of two rival families torn apart by years of betrayal, violence, and secrets. MultiChoice Studios frames the series as a rivalry that began generations ago — until fate joins Chiyumba’s daughter Nampindi and Mazoka’s son Dimuna. The series premiered 5 May 2025 at 20:00 CAT on Zambezi Magic (DStv Channel 162 / GOtv Channel 3 Supa), airing Mondays, Tuesdays and Wednesdays, with MultiChoice’s Power of Three platforms (DStv, GOtv, Showmax) carrying the local slate.",
    clientName: "Zambezi Magic / MultiChoice",
    year: 2025,
    duration: "Drama series",
    genre: "Drama",
    productionCompany: "MultiChoice / Zambezi Magic original",
    broadcaster: "Zambezi Magic (DStv 162 · GOtv 3 Supa)",
    streamingPlatform: "Showmax",
    thumbnail: "/projects/inkondo-billboard.jpg",
    gallery: [
      "/projects/inkondo-billboard.jpg",
      "/media/bts/inkondo-shoot-s2.jpg",
      "/media/bts/inkondo-shoot-s2-b.jpg",
      "/media/bts/inkondo-shoot-lilian.jpg",
      "/media/bts/inkondo-lighting-crew.jpg",
      "/media/bts/inkondo-jay-rox-owas.jpg",
      "/media/bts/inkondo-shoot-s2-c.jpg",
    ],
    youtubeId: "SDtK15xguG8",
    previewYoutubeId: "SDtK15xguG8",
    videoUrl: "https://www.youtube.com/watch?v=SDtK15xguG8",
    posterUrl: "/projects/inkondo-billboard.jpg",
    challenge:
      "Replace the vacated Zuba slot with a new Zambezi Magic original that could hold a three-night weekly appointment — large ensemble, local politics of power, romance under pressure — for linear broadcast and Showmax.",
    approach:
      "An all-local creative leadership pairing of Jackson (Jay Rox) Banda and film director Owas Ray Mwape. Premiere materials describe the series as mirroring “the real tensions, passions, and hopes of our communities,” with a cast mixing established and rising Zambian performers.",
    productionProcess:
      "Shot and finished for MultiChoice’s Zambezi Magic pipeline. Oram TV documented production for audiences through on-set InLens-Inkondo coverage across Lusaka locations, including outdoor quarry/set work and interior multi-camera days preserved in the ORAM stills archive.",
    behindTheScenes:
      "ORAM’s archive holds Season 2 set photography: camera and boom teams on red earth locations, lighting crew at work indoors, and cast/process frames from the shoot. Public premiere cast named in announcement materials includes Luke Mumba, Rosheni Mwemba, Evans Phiri, Sophia Chapeshamano and Zen Vlahakis.",
    results: [
      { value: "5 May 2025", label: "Premiere · 20:00 CAT" },
      { value: "DStv 162", label: "Zambezi Magic · GOtv 3 Supa" },
      { value: "Showmax", label: "Streaming home" },
      { value: "Mon–Wed", label: "Weekly slot" },
    ],
    credits: [
      { role: "Creative lead", name: "Jackson (Jay Rox) Banda" },
      { role: "Director", name: "Owas Ray Mwape" },
      { role: "Network", name: "Zambezi Magic (MultiChoice)" },
      { role: "Cast", name: "Luke Mumba" },
      { role: "Cast", name: "Rosheni Mwemba" },
      { role: "Cast", name: "Evans Phiri" },
      { role: "Cast", name: "Sophia Chapeshamano" },
      { role: "Cast", name: "Zen Vlahakis" },
    ],
    relatedProjectSlugs: ["zuba", "pa-maliketi", "graft"],
    officialLinks: [
      {
        label: "Zambezi Magic — Inkondo",
        url: "https://www.dstv.com/zambezimagic/en-mu/show/inkondo",
      },
      {
        label: "MultiChoice Studios — Inkondo",
        url: "https://www.multichoicestudios.com/show/inkondo",
      },
    ],
    sources: [
      {
        label: "Zambezi Magic show page",
        url: "https://www.dstv.com/zambezimagic/en-mu/show/inkondo",
      },
      {
        label: "MultiChoice Studios",
        url: "https://www.multichoicestudios.com/show/inkondo",
      },
      {
        label: "Zambian Business Times — MultiChoice Zambia showcase",
        url: "https://zambianbusinesstimes.com/multichoice-zambia-unveils-new-local-content-lineup-across-its-power-of-three-platforms/",
      },
    ],
    featured: true,
    order: 1,
    archivalCategory: "directed-by-owas",
    oramRole:
      "Creative leadership — Jackson (Jay Rox) Banda and director Owas Ray Mwape (public materials). Classified as Directed by Owas Ray Mwape.",
    interestingFacts: [
      "Premiere slot: Mondays–Wednesdays at 20:00 CAT on Zambezi Magic.",
      "Announced in MultiChoice Zambia’s 2025 local content showcase alongside Pa Maliketi Season 2.",
      "Oram TV documented production as InLens-Inkondo set coverage.",
    ],
  },
  {
    id: "2",
    title: "Graft",
    slug: "graft",
    category: "narrative",
    description:
      "2024 Zambian feature — “When Corruption Sinks Everyone.” Directed and produced by Owas Ray Mwape.",
    fullDescription:
      "Graft (2024) is a Zambian drama feature directed and produced by Owas Ray Mwape. The theatrical key art is presented by Oram Media Works and Owas Films Production in association with Oram Film Training Academy. The poster tagline — “When Corruption Sinks Everyone” — frames a story that sets a family unit against archetypes of power: business, medicine, and academia. IMDbPro lists Kangwa Chileshe and Sophie Mbao among the cast.",
    clientName: "Owas Films / Oram Media Dynamics",
    year: 2024,
    duration: "Feature",
    genre: "Drama",
    productionCompany:
      "Oram Media Works · Owas Films · Oram Film Training Academy",
    thumbnail: "/projects/graft-poster-hd.jpg",
    portraitPoster: true,
    gallery: ["/projects/graft-poster-hd.jpg"],
    videoUrl:
      "https://www.facebook.com/oramtv/posts/life-on-set-️owas-ray-mwape-film-director-alfred-njovu-graft-orammedia-oramtv/1721962718165889/",
    posterUrl: "/projects/graft-poster-hd.jpg",
    challenge:
      "Mount an independent Zambian feature under the Owas Films / Oram banner — a corruption drama with theatrical key art and a cast drawn from Zambian screen talent — without the marketing machine of a network original.",
    approach:
      "Owas Ray Mwape directed and produced. Key art centres on a portrait theatrical poster with full billing. Oram TV published life-on-set documentation during the shoot, including work with Alfred Njovu on camera.",
    productionProcess:
      "Independent feature workflow under Oram Media Works / Owas Films, with Oram Film Training Academy associated on the public billing. Unit photography beyond the poster collage remains thin in the public web archive — the HD poster is the primary official image asset.",
    behindTheScenes:
      "Oram TV’s Facebook set documentation records the Lusaka shoot. Cleared production stills for the public site are still outstanding; until then the gallery leads with the official theatrical poster only.",
    results: [
      { value: "2024", label: "Feature year (IMDbPro)" },
      { value: "Owas Ray Mwape", label: "Director · Producer" },
      { value: "Theatrical", label: "Portrait key art" },
    ],
    credits: [
      { role: "Director", name: "Owas Ray Mwape" },
      { role: "Producer", name: "Owas Ray Mwape" },
      { role: "Production", name: "Oram Media Works / Owas Films" },
      { role: "In association with", name: "Oram Film Training Academy" },
      { role: "Cast", name: "Kangwa Chileshe" },
      { role: "Cast", name: "Sophie Mbao" },
    ],
    relatedProjectSlugs: ["look-in-the-mirror", "secrets-untold", "inkondo"],
    officialLinks: [
      {
        label: "IMDbPro — Graft",
        url: "https://pro.imdb.com/title/tt31797916/",
      },
      {
        label: "Oram TV — Life on set",
        url: "https://www.facebook.com/oramtv/posts/life-on-set-️owas-ray-mwape-film-director-alfred-njovu-graft-orammedia-oramtv/1721962718165889/",
      },
    ],
    sources: [
      {
        label: "IMDbPro — Graft (2024)",
        url: "https://pro.imdb.com/title/tt31797916/",
      },
      { label: "Official Graft poster billing (ORAM archive)" },
    ],
    featured: true,
    order: 3,
    archivalCategory: "oram-co-production",
    oramRole:
      "Oram Media Works · Oram Film Training Academy billed with Owas Films on official poster — ORAM Media Dynamics Co-Production.",
  },
  {
    id: "3",
    title: "Zuba",
    slug: "zuba",
    category: "narrative",
    description:
      "Zambia’s first telenovela for Zambezi Magic — directed by Owas Ray Mwape across eight seasons.",
    fullDescription:
      "Zuba is a Zambian telenovela produced for Zambezi Magic (MultiChoice). MultiChoice Studios describes it as Zambia’s first telenovela and names award-winning filmmaker Owas Ray Mwape as director. The story follows a young woman who leaves her rural life to work for a wealthy urban family — and falls in love with the family’s son, drawing her into class conflict, secrecy and household drama. Showmax lists eight seasons. The series concluded in 2025 after a multi-year run that began in 2017.",
    clientName: "Zambezi Magic / MultiChoice",
    year: 2017,
    duration: "Telenovela · 8 seasons",
    genre: "Telenovela / Drama",
    productionCompany: "Zambezi Magic / MultiChoice",
    broadcaster: "Zambezi Magic",
    streamingPlatform: "Showmax",
    thumbnail: "/projects/zuba-billboard.jpg",
    gallery: ["/projects/zuba-billboard.jpg", "/projects/zuba.jpg"],
    youtubeId: "yz1rA4evuzA",
    previewYoutubeId: "10QYkQV3KFU",
    videoUrl: "https://www.youtube.com/watch?v=yz1rA4evuzA",
    posterUrl: "/projects/zuba.jpg",
    challenge:
      "Build and sustain Zambia’s first daily telenovela for Zambezi Magic — episode after episode, season after season — at the polish and cadence MultiChoice audiences expect.",
    approach:
      "Direction by Owas Ray Mwape. Zambezi Magic channel leadership publicly credited the show’s dynamic storylines and cultural hold as it reached later seasons. Delivery sat inside the MultiChoice broadcast and Showmax streaming pipeline.",
    productionProcess:
      "Long-form television: multi-season production for Zambezi Magic with later seasons available on Showmax.",
    behindTheScenes:
      "MultiChoice Studios profiled the series as it passed six seasons, highlighting Mwape’s direction. Oram TV and social channels carried cast and set documentation across the run. The ORAM archive holds cast key art and the network’s “Zikomo / 8 years” farewell graphic.",
    results: [
      { value: "8", label: "Seasons (Showmax)" },
      { value: "2017–2025", label: "On air" },
      { value: "First", label: "Zambian telenovela (MultiChoice)" },
      { value: "Showmax", label: "Full-series streaming" },
    ],
    credits: [
      { role: "Director", name: "Owas Ray Mwape" },
      { role: "Network", name: "Zambezi Magic (MultiChoice)" },
      { role: "Cast", name: "Mwaka Mugala" },
      { role: "Cast", name: "Sophia Chapeshamano" },
      { role: "Cast", name: "Sam Sakala" },
    ],
    relatedProjectSlugs: ["inkondo", "pa-maliketi", "graft"],
    officialLinks: [
      {
        label: "MultiChoice Studios — Zuba",
        url: "https://www.multichoicestudios.com/news/zuba-six-seasons-strong-96",
      },
      {
        label: "Showmax — Zuba",
        url: "https://www.showmax.com/et/stream/series/zuba/b3785e05-c758-3ae8-84c3-194d91cbd0b9/seasons/1",
      },
      {
        label: "Official launch trailer",
        url: "https://www.youtube.com/watch?v=yz1rA4evuzA",
      },
    ],
    sources: [
      {
        label: "MultiChoice Studios news",
        url: "https://www.multichoicestudios.com/news/zuba-six-seasons-strong-96",
      },
      {
        label: "Showmax series page",
        url: "https://www.showmax.com/et/stream/series/zuba/b3785e05-c758-3ae8-84c3-194d91cbd0b9/seasons/1",
      },
    ],
    featured: true,
    order: 2,
    archivalCategory: "directed-by-owas",
    oramRole:
      "Director credit verified in MultiChoice / Showmax press. Classified as Directed by Owas Ray Mwape.",
  },
  {
    id: "4",
    title: "Look in the Mirror",
    slug: "look-in-the-mirror",
    category: "narrative",
    description:
      "An Owas Ray Mwape film — Oram Media Dynamics in association with Owas Films. 2024 feature drama.",
    fullDescription:
      "Look in the Mirror (2024) is a Zambian drama feature directed by Owas Ray Mwape. Official key art credits Oram Media Dynamics in association with Owas Films, and names Owas Ray Mwape and Mutinta Mari above the title. The poster’s split-face composition states the film’s psychological premise without spoilers. Maxwell Mwape is credited as Director of Photography on the billing block. A Lusaka premiere night is widely reported for 5 October 2024.",
    clientName: "Oram Media Dynamics / Owas Films",
    year: 2024,
    duration: "Feature",
    genre: "Drama",
    productionCompany: "Oram Media Dynamics in association with Owas Films",
    thumbnail: "/projects/look-in-the-mirror-film.jpg",
    gallery: [
      "/projects/look-in-the-mirror-film.jpg",
      "/projects/look-in-the-mirror-poster.jpg",
    ],
    youtubeId: "NBg0Q-TqNf8",
    previewYoutubeId: "4HAj6fyKcJg",
    videoUrl: "https://www.youtube.com/watch?v=NBg0Q-TqNf8",
    posterUrl: "/projects/look-in-the-mirror-poster.jpg",
    archivalCategory: "oram-co-production",
    oramRole:
      "Official poster: Oram Media Dynamics in association with Owas Films — ORAM Media Dynamics Co-Production. Kinorium also lists Owas Crystal Films / Tylenol Studios (noted as conflict).",
    challenge:
      "Bring an independent Zambian feature to a public Lusaka premiere — with studio-grade key art and a clear Oram Media Dynamics / Owas Films identity on the poster.",
    approach:
      "Owas Ray Mwape directed. Key art leans into a low-key, night-city psychological frame rather than a busy cast collage. Billing places Oram Media Dynamics and Owas Films on the same card as the director and leads.",
    productionProcess:
      "Independent feature under Oram Media Dynamics / Owas Films. Public stills beyond the official poster remain limited; premiere and unit photography should be added from the cleared press set when available.",
    behindTheScenes:
      "Social and Oram channels promoted the Lusaka premiere. Root-archive premiere photography exists but must be title-verified before gallery use. Until then the media gallery leads with the official poster only.",
    results: [
      { value: "2024", label: "Feature year" },
      { value: "Lusaka", label: "Premiere city (reported)" },
      { value: "Oram Media Dynamics", label: "Production credit (poster)" },
    ],
    credits: [
      { role: "Director", name: "Owas Ray Mwape" },
      { role: "Writer", name: "Chris Mukuli" },
      { role: "Production", name: "Oram Media Dynamics / Owas Films" },
      { role: "Director of Photography", name: "Maxwell Mwape" },
      { role: "Cast", name: "Owas Ray Mwape" },
      { role: "Cast", name: "Mutinta Mari" },
    ],
    relatedProjectSlugs: ["graft", "secrets-untold", "inkondo"],
    officialLinks: [
      {
        label: "Trailer (YouTube)",
        url: "https://www.youtube.com/watch?v=NBg0Q-TqNf8",
      },
    ],
    sources: [
      { label: "Official Look in the Mirror poster (ORAM archive)" },
      {
        label: "News Diggers — writer Chris Mukuli / premiere promotion",
        url: "https://diggers.news/lifestyle/2024/09/21/i-want-to-compete-mentality-makes-it-hard-to-help-upcoming-filmmakers-owas/",
      },
      {
        label: "Kinorium — Mutinta Marie filmography",
        url: "https://en.kinorium.com/name/6386268/",
      },
    ],
    featured: true,
    order: 4,
  },
  {
    id: "5",
    title: "Secrets Untold",
    slug: "secrets-untold",
    category: "narrative",
    description:
      "2015 feature — written and directed by Owas Ray Mwape. Ster Kinekor, Lusaka premiere.",
    fullDescription:
      "Secrets Untold (also billed as Secrets Untold: The Wife 2) is a 2015 Zambian drama written and directed by Owas Ray Mwape, with screenplay credit to Ivory van der Boom in contemporary press. Lusaka Times reported a Ster Kinekor red-carpet premiere in Lusaka (coverage dated 17 November 2015; listings also place a 30 October 2015 premiere). The film examines secrets inside marriage — what breaks a couple and what holds them. Cast named in press includes Owas Ray Mwape, Cassie Kabwita, Catherine Soko, Wanga Zulu, James Banda, Adorah Mwape, Chilala Mainza, Gift Muneka, Max Owas and Titus Sinyangwe. Poster billing lists Owas Crystal Films, Old Age Productions and X-Konvict Pictures, with ORAM as Executive Producer.",
    clientName: "Owas Films / Owas Crystal Films",
    year: 2015,
    duration: "Feature",
    genre: "Drama",
    productionCompany: "Owas Crystal Films · Old Age Productions · X-Konvict Pictures",
    thumbnail: "/projects/secrets-untold-poster.jpg",
    portraitPoster: true,
    gallery: ["/projects/secrets-untold-poster.jpg"],
    videoUrl: "",
    posterUrl: "/projects/secrets-untold-poster.jpg",
    challenge:
      "Premiere an independent Zambian feature in a commercial cinema when local theatrical pathways were still narrow — and treat marriage drama as subject matter worth a red carpet.",
    approach:
      "Owas Ray Mwape wrote and directed after founding Owas Films in 2013. The Ster Kinekor Lusaka premiere positioned the film for a paying public audience, not only a private industry screening.",
    productionProcess:
      "Independent feature under Owas Crystal Films / associated labels. No official YouTube trailer is wired; do not substitute the studio showreel as the film trailer.",
    behindTheScenes:
      "Press coverage of the premiere survives in Lusaka Times. Cleared BTS stills are not yet in the public web gallery.",
    results: [
      { value: "2015", label: "Release year" },
      { value: "Ster Kinekor", label: "Lusaka premiere" },
      { value: "ORAM", label: "Executive Producer (poster)" },
    ],
    credits: [
      { role: "Director", name: "Owas Ray Mwape" },
      { role: "Writer", name: "Owas Ray Mwape" },
      { role: "Screenplay", name: "Ivory van der Boom" },
      { role: "Executive Producer", name: "ORAM" },
      { role: "Cast", name: "Owas Ray Mwape" },
      { role: "Cast", name: "Cassie Kabwita" },
      { role: "Cast", name: "Catherine Soko" },
      { role: "Cast", name: "Adorah Mwape" },
    ],
    relatedProjectSlugs: ["hang", "girls-to-ladies", "look-in-the-mirror"],
    officialLinks: [
      {
        label: "Lusaka Times — premiere coverage",
        url: "https://www.lusakatimes.com/2015/11/17/owas-premieres-secrets-untold/",
      },
    ],
    sources: [
      {
        label: "Lusaka Times",
        url: "https://www.lusakatimes.com/2015/11/17/owas-premieres-secrets-untold/",
      },
      {
        label: "Wikipedia — Owas Ray Mwape",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
      { label: "Official Secrets Untold poster (ORAM archive)" },
    ],
    featured: true,
    order: 8,
    archivalCategory: "oram-co-production",
    oramRole: "Executive Producer (poster billing: ORAM) — ORAM Media Dynamics Co-Production.",
  },
  {
    id: "6",
    title: "Hang!",
    slug: "hang",
    category: "narrative",
    description:
      "2018 comedy-drama — “A Cry of an Artist.” Directed by Owas Ray Mwape; ORAM as Executive Producer.",
    fullDescription:
      "Hang! (2018) is a Zambian comedy-drama directed by Owas Ray Mwape. IMDbPro summarises the plot: an unemployed artist creates a storm of media attention when he threatens to hang himself on an area of disputed land. The official poster bills the film as “hang! A CRY OF AN ARTIST,” presented by Owas Crystal Films and Old Age Productions as an Owas Ray Mwape film, with Owas Films / Owas Crystal Films / Old Age Productions on the production line and ORAM.EXP.MARKETING LTD as Executive Producer. Zambia release is listed as 10 February 2018 (IMDbPro).",
    clientName: "Owas Films / ORAM",
    year: 2018,
    duration: "Feature",
    genre: "Comedy / Drama",
    productionCompany: "Owas Films · Owas Crystal Films · Old Age Productions",
    thumbnail: "/projects/hang-poster.jpg",
    portraitPoster: true,
    gallery: ["/projects/hang-poster.jpg"],
    videoUrl: "",
    posterUrl: "/projects/hang-poster.jpg",
    challenge:
      "Tell a darkly comic story about an artist, disputed land and media spectacle — and put it on a theatrical poster with a clear ORAM executive-producer credit.",
    approach:
      "Owas Ray Mwape directed and co-wrote with Adorah Mwape. Adorah produced. Key art centres on a single confrontational portrait rather than a cast collage.",
    productionProcess:
      "Independent feature under Owas Crystal Films / Old Age Productions / Owas Films. No official YouTube trailer is wired on this site yet.",
    behindTheScenes:
      "Alternate poster frames exist in the ORAM vault (Hang 2). Cleared unit stills are not yet in the public gallery.",
    results: [
      { value: "10 Feb 2018", label: "Zambia release (IMDbPro)" },
      { value: "ORAM", label: "Executive Producer (poster)" },
      { value: "Feature", label: "Comedy-drama" },
    ],
    credits: [
      { role: "Director", name: "Owas Ray Mwape" },
      { role: "Writer", name: "Owas Ray Mwape" },
      { role: "Writer", name: "Adorah Mwape" },
      { role: "Producer", name: "Adorah Mwape" },
      { role: "Executive Producer", name: "ORAM.EXP.MARKETING LTD" },
      { role: "Director of Photography", name: "Macrony Kasitu" },
      { role: "Cast", name: "Maxwell Mwape" },
      { role: "Cast", name: "Evans Nkoya" },
      { role: "Cast", name: "Adorah Mwape" },
      { role: "Cast", name: "Philomena Nyirenda" },
    ],
    relatedProjectSlugs: ["secrets-untold", "girls-to-ladies", "graft"],
    officialLinks: [
      {
        label: "IMDbPro — Hang!",
        url: "https://pro.imdb.com/title/tt22114760/",
      },
    ],
    sources: [
      {
        label: "IMDbPro — Hang! (2018)",
        url: "https://pro.imdb.com/title/tt22114760/",
      },
      { label: "Official Hang! poster billing (ORAM archive)" },
    ],
    featured: true,
    order: 6,
    archivalCategory: "oram-co-production",
    alternativeTitles: ["hang! A Cry of an Artist"],
    oramRole: "Executive Producer — ORAM.EXP.MARKETING LTD (official poster) — ORAM Media Dynamics Co-Production.",
    interestingFacts: [
      "IMDbPro Zambia release date: 10 February 2018.",
      "Poster presents the film as “An Owas Ray Mwape Film.”",
      "DoP on poster: Macrony Kasitu.",
    ],
  },
  {
    id: "7",
    title: "Pa Maliketi",
    slug: "pa-maliketi",
    category: "narrative",
    description:
      "Zambezi Magic market comedy — when Mwansa inherits her mother’s stand at Fyakubantu market.",
    fullDescription:
      "Pa Maliketi is a Zambian comedy series for Zambezi Magic. Official DStv / Zambezi Magic promos introduce Bana Mwansa inheriting her mother’s market stand at Fyakubantu market and navigating the drama around her. Kinorium lists Owas Ray Mwape as director and names cast including Elizabeth Chisela, Philomena Nyirenda, Robert Nyirenda, Taonga Phiri and Innocent Tembo. MultiChoice Zambia announced Pa Maliketi Season 2 among its April 2025 local slate (premiere cited 24 April 2025). Season 1 promotional key art in the ORAM archive carries Zambezi Magic / DStv 162 / GOtv Supa branding.",
    clientName: "Zambezi Magic / MultiChoice",
    year: 2023,
    duration: "TV series",
    genre: "Comedy",
    productionCompany: "Zambezi Magic (production company per Kinorium listing)",
    broadcaster: "Zambezi Magic (DStv 162)",
    thumbnail: "/projects/pa-maliketi-cover.jpg",
    gallery: [
      "/projects/pa-maliketi-cover.jpg",
      "/projects/pa-maliketi-s1-cover.jpg",
    ],
    videoUrl: "https://www.dstv.com/zambezimagic/en-za/video/this-week-pa-maliketi",
    posterUrl: "/projects/pa-maliketi-s1-cover.jpg",
    challenge:
      "Deliver a weekly market comedy for Zambezi Magic that could hold a Friday night appointment and later return for a second season in MultiChoice’s local slate.",
    approach:
      "Direction credited to Owas Ray Mwape (Kinorium). Story world centres on Fyakubantu market life — inheritance, gossip and community pressure — under Zambezi Magic’s “Sharing Our Stories” brand.",
    productionProcess:
      "Network television for Zambezi Magic. Season 2 return confirmed in MultiChoice Zambia’s 2025 showcase reporting.",
    behindTheScenes:
      "ORAM vault holds Season 1 cover art and additional Pa Maliketi key frames. Cleared BTS stills are not yet wired on the public gallery.",
    results: [
      { value: "2023", label: "Series start (listed)" },
      { value: "S2 Apr 2025", label: "Season 2 (MultiChoice slate)" },
      { value: "DStv 162", label: "Zambezi Magic" },
      { value: "Friday", label: "Weekly slot (promo)" },
    ],
    credits: [
      { role: "Director", name: "Owas Ray Mwape" },
      { role: "Network", name: "Zambezi Magic (MultiChoice)" },
      { role: "Cast", name: "Elizabeth Chisela" },
      { role: "Cast", name: "Philomena Nyirenda" },
      { role: "Cast", name: "Robert Nyirenda" },
      { role: "Cast", name: "Taonga Phiri" },
      { role: "Cast", name: "Innocent Tembo" },
    ],
    relatedProjectSlugs: ["inkondo", "zuba", "hang"],
    officialLinks: [
      {
        label: "Zambezi Magic — This Week Pa Maliketi",
        url: "https://www.dstv.com/zambezimagic/en-za/video/this-week-pa-maliketi",
      },
      {
        label: "MultiChoice Zambia 2025 slate (Zambian Business Times)",
        url: "https://zambianbusinesstimes.com/multichoice-zambia-unveils-new-local-content-lineup-across-its-power-of-three-platforms/",
      },
    ],
    sources: [
      {
        label: "DStv / Zambezi Magic promo",
        url: "https://www.dstv.com/zambezimagic/en-za/video/this-week-pa-maliketi",
      },
      {
        label: "Kinorium — Pa Maliketi",
        url: "https://en.kinorium.com/11584311/",
      },
      {
        label: "Zambian Business Times — MultiChoice Zambia showcase",
        url: "https://zambianbusinesstimes.com/multichoice-zambia-unveils-new-local-content-lineup-across-its-power-of-three-platforms/",
      },
      { label: "Pa Maliketi S1 cover (ORAM archive)" },
    ],
    featured: true,
    order: 5,
    archivalCategory: "directed-by-owas",
    oramRole:
      "Director credit (Kinorium). Classified as Directed by Owas Ray Mwape.",
  },
  {
    id: "8",
    title: "Girls to Ladies",
    slug: "girls-to-ladies",
    category: "narrative",
    description:
      "Feature directed by Owas Ray Mwape — Owas Films / Old Age Pictures. Tagline: “Who Will Find Them.”",
    fullDescription:
      "Girls to Ladies (also billed Girls 2 Ladies) is a Zambian feature directed by Owas Ray Mwape for Owas Films Productions and Old Age Pictures. The official poster tagline reads “WHO WILL FIND THEM.” Writer credit on the poster: Ivory van der Boom. Executive producers: Adorah Mwape and Owas Ray Mwape. Cast named on the poster includes Sophie Mbao, Taonga Phiri, Chimwemwe Zulumeta Tshamala, Mooka Sibbuku, Mutinta Hachuma and Owas Ray Mwape. DOP: Maxwell Mwape.",
    clientName: "Owas Films / Old Age Pictures",
    year: 2020,
    duration: "Feature",
    genre: "Drama",
    productionCompany: "Owas Films Productions · Old Age Pictures",
    thumbnail: "/projects/girls-to-ladies-poster.jpg",
    portraitPoster: true,
    gallery: ["/projects/girls-to-ladies-poster.jpg"],
    videoUrl: "",
    posterUrl: "/projects/girls-to-ladies-poster.jpg",
    challenge:
      "Mount an independent feature about young women under pressure — with guild affiliation and a full theatrical credit block — without a network marketing machine.",
    approach:
      "Owas Ray Mwape directed; Ivory van der Boom wrote; Adorah and Owas executive-produced. Poster montage contrasts schoolgirls with adult archetypes (faith, law, medicine).",
    productionProcess:
      "Independent feature. Archive poster resolution is limited; a higher-resolution master should replace the web file when located. No official trailer is wired.",
    behindTheScenes:
      "Alternate poster frame (Girls to Ladies 1) sits in the ORAM vault. Unit stills not yet on the public gallery.",
    results: [
      { value: "Feature", label: "Drama" },
      { value: "Owas Ray Mwape", label: "Director" },
      { value: "Poster", label: "Official key art in archive" },
    ],
    credits: [
      { role: "Director", name: "Owas Ray Mwape" },
      { role: "Writer", name: "Ivory van der Boom" },
      { role: "Executive Producer", name: "Adorah Mwape" },
      { role: "Executive Producer", name: "Owas Ray Mwape" },
      { role: "Director of Photography", name: "Maxwell Mwape" },
      { role: "Cast", name: "Sophie Mbao" },
      { role: "Cast", name: "Taonga Phiri" },
      { role: "Cast", name: "Owas Ray Mwape" },
    ],
    relatedProjectSlugs: ["hang", "secrets-untold", "graft"],
    sources: [
      { label: "Official Girls 2 Ladies poster (ORAM archive)" },
    ],
    featured: true,
    order: 7,
    archivalCategory: "personal-filmography",
    alternativeTitles: ["Girls 2 Ladies"],
    oramRole:
      "Owas Films Productions / Old Age Pictures on poster — no ORAM Media Dynamics company credit. Personal filmography / Directed by Owas Ray Mwape.",
    interestingFacts: [
      "Poster tagline: “WHO WILL FIND THEM.”",
      "Poster lists Films Guild of Zambia (NAMA affiliates) membership.",
      "Release year commonly cited as 2020 in secondary profiles — not printed on the theatrical poster.",
    ],
  },
  {
    id: "9",
    title: "The Wife",
    slug: "the-wife",
    category: "narrative",
    description:
      "Early Owas Films feature — “For better, for worse…” Directed and executive-produced by Owas Ray Mwape.",
    fullDescription:
      "The Wife is a Zambian feature presented by Old Age Productions, Owas Films and Maynarj Films. The official poster tagline reads “For better, for worse…”. Owas Ray Mwape is credited as director and executive producer, and appears in the cast. Production is billed as Owas Films and Old Age Productions in conjunction with Maynarj Films. Cast named on the poster includes Meyer Nyirenda, Owas Ray Mwape, Webster Chiluba, Adora Mwape, Charles Simusokwe, and introducing Mwelwa Muswema. Director of Cinematography: Maynard Muchangwe. Industry biographies place the film around the 2013 founding of Owas Films; the poster itself does not print a release year.",
    clientName: "Owas Films / Old Age Productions",
    year: 2013,
    duration: "Feature",
    genre: "Drama",
    productionCompany: "Owas Films · Old Age Productions · Maynarj Films",
    thumbnail: "/projects/the-wife-poster.jpg",
    portraitPoster: true,
    gallery: ["/projects/the-wife-poster.jpg"],
    videoUrl: "",
    posterUrl: "/projects/the-wife-poster.jpg",
    archivalCategory: "personal-filmography",
    oramRole:
      "Owas Films / Old Age Productions / Maynarj Films on poster — no ORAM Media Dynamics branding. Personal filmography. Do not claim as ORAM production.",
    challenge:
      "Launch an independent Zambian feature under the new Owas Films banner — domestic drama with theatrical key art and a full billing block.",
    approach:
      "Owas Ray Mwape directed and executive-produced while also appearing on screen. Key art places a hard-hat central figure against a city skyline with three women — a domestic triangle under urban pressure.",
    productionProcess:
      "Independent feature: Owas Films / Old Age Productions in conjunction with Maynarj Films. No official trailer is wired on this site. A YouTube upload titled “Wife from above” exists in public search results but is a different title and must not be confused with The Wife without verification.",
    behindTheScenes:
      "Official poster is the primary cleared still in the ORAM vault. Unit photography not yet on the public gallery.",
    results: [
      { value: "~2013", label: "Cited era (verify premiere)" },
      { value: "Owas Films", label: "Production banner" },
      { value: "Feature", label: "Drama" },
    ],
    credits: [
      { role: "Director", name: "Owas Ray Mwape" },
      { role: "Executive Producer", name: "Owas Ray Mwape" },
      { role: "Production", name: "Owas Films / Old Age Productions" },
      { role: "In conjunction with", name: "Maynarj Films" },
      { role: "Director of Cinematography", name: "Maynard Muchangwe" },
      { role: "Sound", name: "Jeff Simeja" },
      { role: "Cast", name: "Meyer Nyirenda" },
      { role: "Cast", name: "Owas Ray Mwape" },
      { role: "Cast", name: "Webster Chiluba" },
      { role: "Cast", name: "Adora Mwape" },
      { role: "Cast", name: "Charles Simusokwe" },
      { role: "Cast", name: "Mwelwa Muswema" },
    ],
    relatedProjectSlugs: ["secrets-untold", "hang", "strictly-by-invitation"],
    sources: [
      { label: "Official The Wife poster (ORAM archive)" },
      {
        label: "Wikipedia — Owas Ray Mwape (founding era context)",
        url: "https://en.wikipedia.org/wiki/Owas_Ray_Mwape",
      },
    ],
    interestingFacts: [
      "Poster tagline: “For better, for worse…”",
      "Design credit on poster: Pule Mulenga.",
      "Executive Associate Producers listed: Elizabeth Njobvu, Mutinta Chisiya, Ibrahim Mabvuto Kaumba.",
    ],
    featured: true,
    order: 9,
  },
  {
    id: "10",
    title: "Strictly By Invitation",
    slug: "strictly-by-invitation",
    category: "narrative",
    description:
      "2016 thriller-drama — Mwape family production. Ster Kinekor Arcades premiere, 28 July 2016.",
    fullDescription:
      "Strictly By Invitation (2016) is a Zambian thriller-drama from Owas Crystal Films / Old Age Productions. Lusaka Times reported a Ster Kinekor Arcades (Lusaka) red-carpet premiere on 28 July 2016. The story follows Michael Lungu and Catherine — a couple who appear perfect until Catherine is found dead with her husband in the room — and asks whether the violence is marital, supernatural, or something the media will decide first. IMDbPro lists Owas Ray Mwape and Robam Mwape as directors and Adora Mwape as producer. Press names family cast including Clive, Mercy, Prudence, Katongo and Maxwell Mwape alongside Owas, Robam and Adorah, plus Webby Chiluba, Huruma Sungula, Poliana Tembo and Hellen Kayuni.",
    clientName: "Owas Crystal Films / Old Age Productions",
    year: 2016,
    duration: "Feature",
    genre: "Thriller / Drama",
    productionCompany: "Owas Crystal Films / Old Age Productions",
    thumbnail: "",
    portraitPoster: true,
    gallery: [],
    videoUrl: "",
    posterUrl: "",
    published: false,
    challenge:
      "Make a feature about marital violence and media scrutiny with a creative team drawn largely from one family — and premiere it on a commercial Lusaka screen.",
    approach:
      "Co-direction credited to Owas Ray Mwape and Robam Mwape (IMDbPro / Lusaka Times). Adorah (Adora) Mwape produced. The film was framed in press as speaking to gender-based violence and the questions society asks when a marriage ends in death.",
    productionProcess:
      "Independent feature; premiere pathway via Ster Kinekor Arcades. Official poster and trailer are missing from the web archive — a prior site thumb was a mislabeled ZAFTA red-carpet photo and has been removed. This case study stays unpublished until honest key art is attached.",
    behindTheScenes:
      "Premiere coverage exists in Lusaka Times (20 July 2016). No cleared BTS stills are wired on the public site.",
    results: [
      { value: "28 Jul 2016", label: "Lusaka premiere" },
      { value: "Ster Kinekor", label: "Arcades, Lusaka" },
      { value: "Family cast", label: "Mwape ensemble" },
    ],
    credits: [
      { role: "Director", name: "Owas Ray Mwape" },
      { role: "Director", name: "Robam Mwape" },
      { role: "Producer", name: "Adorah Mwape" },
      { role: "Cast", name: "Owas Ray Mwape" },
      { role: "Cast", name: "Robam Mwape" },
      { role: "Cast", name: "Adorah Mwape" },
      { role: "Cast", name: "Webby Chiluba" },
      { role: "Cast", name: "Huruma Sungula" },
    ],
    relatedProjectSlugs: ["secrets-untold", "graft", "look-in-the-mirror"],
    officialLinks: [
      {
        label: "Lusaka Times — premiere preview",
        url: "https://www.lusakatimes.com/2016/07/20/mwape-family-stars-strictly-invitation/",
      },
      {
        label: "IMDbPro — Strictly by Invitation",
        url: "https://pro.imdb.com/title/tt22087442/",
      },
    ],
    sources: [
      {
        label: "Lusaka Times",
        url: "https://www.lusakatimes.com/2016/07/20/mwape-family-stars-strictly-invitation/",
      },
      {
        label: "IMDbPro",
        url: "https://pro.imdb.com/title/tt22087442/",
      },
    ],
    featured: false,
    order: 10,
    archivalCategory: "personal-filmography",
    oramRole:
      "Owas Crystal Films / Old Age Productions — personal / family filmography. Not published as an ORAM Media Dynamics company production.",
    interestingFacts: [
      "Premiere: Ster Kinekor Arcades, Lusaka — 28 July 2016 (Lusaka Times).",
      "IMDbPro lists Owas Ray Mwape and Robam Mwape as directors; Adora Mwape as producer.",
    ],
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
    relatedProjectSlugs: ["zuba", "inkondo", "pa-maliketi"],
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
    relatedProjectSlugs: ["graft", "look-in-the-mirror", "hang"],
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
    relatedProjectSlugs: ["secrets-untold", "graft"],
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
    photo: "/media/team/owas-ray-mwape-ep.jpg",
    social: {
      facebook: "https://www.facebook.com/owas.mwape/",
      instagram: "https://www.instagram.com/owasmwape/",
    },
  },
  {
    id: "2",
    name: "Adorah Mwape",
    role: "Executive Producer",
    bio: "Actress, scriptwriter, producer, and director behind Owas Crystal Films. Producer of Strictly By Invitation; credits associated with Secrets Untold and related Owas Films titles.",
    photo: "/about/adorah-mwape.png",
    social: { facebook: "https://www.facebook.com/oramtv/" },
  },
  {
    id: "3",
    name: "Production Team",
    role: "Oram Media Dynamics Crew",
    bio: "Camera, lighting and production teams delivering Oram TV and Oram Entertainment work across Lusaka sets and locations.",
    photo: "/media/bts/inkondo-shoot-s2-b.jpg",
    social: { instagram: "https://www.instagram.com/orammediad/" },
  },
];

export const studioImages = [
  "/media/bts/inkondo-shoot-s2.jpg",
  "/media/bts/inkondo-shoot-s2-b.jpg",
  "/media/team/owas-ray-mwape-ep.jpg",
  "/projects/inkondo-billboard.jpg",
  "/projects/zuba.jpg",
  "/media/bts/inkondo-lighting-crew.jpg",
] as const;

export const studioImageAlts = [
  "Inkondo Season 2 shoot — Oram Media Dynamics on set for Zambezi Magic",
  "Golden-hour crew on the Inkondo Season 2 location",
  "Owas Ray Mwape reviewing playback on set",
  "Inkondo billboard key art for Zambezi Magic",
  "Zuba cast key art for Zambezi Magic",
  "Lighting crew on the Inkondo set",
];

export const siteConfig = fb.siteConfig;

function isPublishedProject(p: Project): boolean {
  return p.published !== false;
}

export function getFeaturedProjects(): Project[] {
  return projects
    .filter((p) => p.featured && isPublishedProject(p))
    .sort((a, b) => a.order - b.order);
}

export function getProjectBySlug(slug: string): Project | undefined {
  const project = projects.find((p) => p.slug === slug);
  if (!project || !isPublishedProject(project)) return undefined;
  return project;
}

export function getProjectsByCategory(category: string): Project[] {
  const sorted = [...projects]
    .filter(isPublishedProject)
    .sort((a, b) => a.order - b.order);
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
