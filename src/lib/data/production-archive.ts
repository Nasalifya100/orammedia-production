import type { Project } from "@/types";
import {
  mediaRightsRegister,
  trailerRegister,
} from "@/lib/data/media-rights-register";
import {
  ARCHIVAL_CATEGORY_LABELS,
  getArchivalTitle,
  type ArchivalCategory,
} from "@/lib/data/archival-classification";

/** Per-dimension archive status for the production file */
export type ArchiveFieldStatus =
  | "complete"
  | "partial"
  | "missing"
  | "hold"
  | "review";

export interface ArchiveField {
  key: string;
  label: string;
  status: ArchiveFieldStatus;
  summary: string;
  detail?: string;
}

export interface ProductionArchive {
  slug: string;
  title: string;
  publicationStatus: "Published" | "Archive Hold" | "Draft";
  fields: ArchiveField[];
  completeCount: number;
  totalCount: number;
}

const BTS_PATH = /\/media\/bts\//;

function statusLabel(s: ArchiveFieldStatus): string {
  switch (s) {
    case "complete":
      return "Complete";
    case "partial":
      return "Partial";
    case "missing":
      return "Missing";
    case "hold":
      return "On hold";
    case "review":
      return "Requires verification";
  }
}

export { statusLabel as archiveStatusLabel };

function directors(project: Project): string {
  return (
    project.credits
      ?.filter((c) => /director/i.test(c.role))
      .map((c) => c.name)
      .join(", ") || "—"
  );
}

function producers(project: Project): string {
  return (
    project.credits
      ?.filter((c) => /producer|executive producer/i.test(c.role))
      .map((c) => c.name)
      .join(", ") || "—"
  );
}

function crew(project: Project): string {
  const crewCredits =
    project.credits?.filter(
      (c) =>
        !/director|producer|executive producer|cast|network|client|production$/i.test(
          c.role,
        ),
    ) ?? [];
  if (crewCredits.length === 0) return "—";
  return crewCredits.map((c) => `${c.role}: ${c.name}`).join(" · ");
}

function inferLocations(project: Project): { text: string; status: ArchiveFieldStatus } {
  const haystack = [
    project.productionProcess,
    project.behindTheScenes,
    project.fullDescription,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/lusaka|chainama|zambia|fyakubantu|quarry|location/i.test(haystack)) {
    const locs: string[] = [];
    if (/lusaka/i.test(haystack)) locs.push("Lusaka");
    if (/zambia/i.test(haystack) && !locs.includes("Zambia"))
      locs.push("Zambia");
    if (/fyakubantu/i.test(haystack)) locs.push("Fyakubantu market");
    return {
      text: locs.length ? locs.join(" · ") : "Zambia (referenced in production notes)",
      status: locs.length >= 2 ? "complete" : "partial",
    };
  }
  return { text: "Not documented on public record", status: "missing" };
}

function trailerField(project: Project): ArchiveField {
  const reg = trailerRegister.find((t) => t.projectSlug === project.slug);
  if (project.youtubeId) {
    return {
      key: "trailer",
      label: "Trailer",
      status: reg?.status === "confirm-channel" ? "review" : "complete",
      summary: `YouTube · ${project.youtubeId}`,
      detail:
        reg?.status === "confirm-channel"
          ? "Embed wired — confirm official channel ownership before launch"
          : reg?.officialSource,
    };
  }
  if (project.videoUrl && /facebook|dstv|youtube/i.test(project.videoUrl)) {
    const isBts = reg?.status === "bts-only";
    return {
      key: "trailer",
      label: "Trailer",
      status: isBts ? "partial" : "partial",
      summary: isBts ? "BTS / promo only (not a cut trailer)" : "Official link",
      detail: project.videoUrl,
    };
  }
  return {
    key: "trailer",
    label: "Trailer",
    status: "missing",
    summary: "No official trailer wired",
    detail: "Recommend cut from ORAM masters",
  };
}

function posterField(project: Project): ArchiveField {
  if (!project.posterUrl && !project.thumbnail) {
    return {
      key: "poster",
      label: "Poster",
      status: "missing",
      summary: "No official poster",
    };
  }
  const path = project.posterUrl || project.thumbnail;
  const rights = mediaRightsRegister.find(
    (m) => m.projectSlug === project.slug && m.role === "poster",
  );
  return {
    key: "poster",
    label: "Poster",
    status: rights?.resolutionNote?.includes("Low") ? "partial" : "complete",
    summary: path,
    detail: rights
      ? `${rights.owner} · ${rights.resolutionNote}`
      : undefined,
  };
}

function galleryField(project: Project): ArchiveField {
  const n = project.gallery?.length ?? 0;
  if (n === 0)
    return {
      key: "gallery",
      label: "Gallery",
      status: "missing",
      summary: "No gallery assets",
    };
  if (n === 1)
    return {
      key: "gallery",
      label: "Gallery",
      status: "partial",
      summary: `${n} asset (poster only)`,
    };
  return {
    key: "gallery",
    label: "Gallery",
    status: "complete",
    summary: `${n} assets live`,
  };
}

function btsField(project: Project): ArchiveField {
  const btsImages =
    project.gallery?.filter((g) => BTS_PATH.test(g)).length ?? 0;
  const hasNotes = Boolean(project.behindTheScenes);
  if (btsImages >= 2 && hasNotes)
    return {
      key: "bts",
      label: "BTS",
      status: "complete",
      summary: `${btsImages} set stills + production notes`,
    };
  if (btsImages >= 1 || hasNotes)
    return {
      key: "bts",
      label: "BTS",
      status: "partial",
      summary: hasNotes
        ? `${btsImages} stills · notes on file`
        : `${btsImages} still(s)`,
    };
  return {
    key: "bts",
    label: "BTS",
    status: "missing",
    summary: "No cleared BTS gallery",
  };
}

function rightsField(project: Project): ArchiveField {
  const entries = mediaRightsRegister.filter(
    (m) => m.projectSlug === project.slug,
  );
  if (entries.length === 0)
    return {
      key: "rights",
      label: "Rights",
      status: "review",
      summary: "Not yet logged in media register",
    };
  const blocked = entries.some((e) => e.rights === "do-not-use");
  if (blocked)
    return {
      key: "rights",
      label: "Rights",
      status: "hold",
      summary: `${entries.length} asset(s) · includes archived mislabels`,
    };
  return {
    key: "rights",
    label: "Rights",
    status: "complete",
    summary: `${entries.length} asset(s) · ORAM cleared where applicable`,
    detail: entries.map((e) => `${e.path}: ${e.rights}`).join("\n"),
  };
}

function approvalField(project: Project): ArchiveField {
  if (project.published === false)
    return {
      key: "approval",
      label: "Approval",
      status: "hold",
      summary: "Not approved for public archive",
      detail: "Awaiting honest key art / rights clearance",
    };
  const needsReview =
    project.interestingFacts?.some((f) =>
      /REQUIRES VERIFICATION/i.test(f),
    ) ||
    project.oramRole?.includes("REQUIRES VERIFICATION") ||
    project.productionProcess?.includes("REQUIRES VERIFICATION");
  if (needsReview)
    return {
      key: "approval",
      label: "Approval",
      status: "review",
      summary: "ORAM media permission confirmed · facts under review",
    };
  return {
    key: "approval",
    label: "Approval",
    status: "complete",
    summary: "ORAM confirmed project media permission",
  };
}

/** Build the full production archive file for a project */
export function buildProductionArchive(project: Project): ProductionArchive {
  const loc = inferLocations(project);
  const awardsCount = project.awardsList?.length ?? 0;
  const pressLinks =
    project.officialLinks?.filter((l) =>
      /times|facebook|imdb|dstv|showmax|multichoice/i.test(l.url),
    ) ?? [];

  const archival = getArchivalTitle(project.slug);
  const category =
    project.archivalCategory ||
    (archival?.category as ArchivalCategory | undefined);
  const categoryLabel = category
    ? ARCHIVAL_CATEGORY_LABELS[category]
    : undefined;

  const fields: ArchiveField[] = [
    {
      key: "production",
      label: "Production",
      status: project.productionCompany || categoryLabel ? "complete" : "partial",
      summary:
        categoryLabel ||
        project.productionCompany ||
        project.clientName,
      detail: [
        project.productionCompany,
        project.oramRole || archival?.oramRole,
        archival?.owasRole ? `Owas Ray Mwape: ${archival.owasRole}` : undefined,
      ]
        .filter(Boolean)
        .join(" · "),
    },
    {
      key: "synopsis",
      label: "Synopsis",
      status: project.fullDescription.length > 120 ? "complete" : "partial",
      summary:
        project.fullDescription.slice(0, 140) +
        (project.fullDescription.length > 140 ? "…" : ""),
    },
    {
      key: "client",
      label: "Client",
      status: project.clientName ? "complete" : "missing",
      summary: project.clientName || "—",
    },
    {
      key: "director",
      label: "Director",
      status: directors(project) !== "—" ? "complete" : "missing",
      summary: directors(project),
    },
    {
      key: "producer",
      label: "Producer",
      status: producers(project) !== "—" ? "complete" : "partial",
      summary: producers(project),
    },
    {
      key: "crew",
      label: "Crew",
      status:
        crew(project) !== "—"
          ? crew(project).split("·").length >= 3
            ? "complete"
            : "partial"
          : "missing",
      summary: crew(project),
    },
    {
      key: "locations",
      label: "Locations",
      status: loc.status,
      summary: loc.text,
    },
    {
      key: "awards",
      label: "Awards",
      status: awardsCount > 0 ? "complete" : "missing",
      summary:
        awardsCount > 0
          ? project.awardsList!.map((a) => a.name).join(", ")
          : "No title awards on public record",
    },
    {
      key: "festival",
      label: "Festival",
      status: "missing",
      summary: "No festival selections verified for this title",
    },
    trailerField(project),
    posterField(project),
    galleryField(project),
    btsField(project),
    {
      key: "scripts",
      label: "Scripts",
      status: "missing",
      summary: "Not published (contact ORAM for clearance)",
    },
    {
      key: "press",
      label: "Press",
      status: pressLinks.length > 0 ? "complete" : "partial",
      summary:
        pressLinks.length > 0
          ? `${pressLinks.length} official / verified link(s)`
          : project.officialLinks?.length
            ? `${project.officialLinks.length} link(s) on file`
            : "No press links wired",
    },
    {
      key: "downloads",
      label: "Downloads",
      status: "missing",
      summary: "No public download pack",
    },
    rightsField(project),
    approvalField(project),
  ];

  const publicationStatus: ProductionArchive["publicationStatus"] =
    project.published === false
      ? "Archive Hold"
      : fields.filter((f) => f.status === "missing" || f.status === "hold")
            .length > 6
        ? "Draft"
        : "Published";

  fields.push({
    key: "publication",
    label: "Publication Status",
    status:
      publicationStatus === "Published"
        ? "complete"
        : publicationStatus === "Archive Hold"
          ? "hold"
          : "partial",
    summary: publicationStatus,
    detail: `${fields.filter((f) => f.status === "complete").length} of ${fields.length - 1} archive dimensions complete`,
  });

  const completeCount = fields.filter((f) => f.status === "complete").length;

  return {
    slug: project.slug,
    title: project.title,
    publicationStatus,
    fields,
    completeCount,
    totalCount: fields.length,
  };
}

export function buildAllProductionArchives(projects: Project[]): ProductionArchive[] {
  return projects.map(buildProductionArchive);
}
