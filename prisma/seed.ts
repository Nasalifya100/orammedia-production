/**
 * PAMS seed — migrates archival mock data into the relational CMS.
 * Run: npm run pams:seed
 */
import "dotenv/config";
import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { hash } from "bcryptjs";
import { projects, services, teamMembers, clientLogos } from "../src/lib/data/mock-data";
import { archivalTitles } from "../src/lib/data/archival-classification";

const dbUrl = process.env.DATABASE_URL ?? "file:./prisma/pams.db";
const absolute =
  dbUrl.startsWith("file:") && !path.isAbsolute(dbUrl.replace(/^file:/, ""))
    ? `file:${path.join(process.cwd(), dbUrl.replace(/^file:/, ""))}`
    : dbUrl;

const adapter = new PrismaBetterSqlite3({ url: absolute });
const db = new PrismaClient({ adapter });

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function seedAuth() {
  const perms = [
    "productions.read",
    "productions.write",
    "productions.publish",
    "people.read",
    "people.write",
    "media.read",
    "media.write",
    "media.approve",
    "filmography.write",
    "users.manage",
    "reports.read",
    "settings.write",
    "settings.read",
  ];

  for (const key of perms) {
    await db.permission.upsert({
      where: { key },
      create: { key, description: key },
      update: {},
    });
  }

  const all = await db.permission.findMany();
  const superRole = await db.role.upsert({
    where: { name: "superadmin" },
    create: { name: "superadmin", description: "Full PAMS access" },
    update: {},
  });
  const editorRole = await db.role.upsert({
    where: { name: "editor" },
    create: { name: "editor", description: "Content editor" },
    update: {},
  });

  for (const p of all) {
    await db.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: superRole.id, permissionId: p.id },
      },
      create: { roleId: superRole.id, permissionId: p.id },
      update: {},
    });
  }

  const editorKeys = perms.filter((k) => !k.startsWith("users."));
  for (const p of all.filter((x) => editorKeys.includes(x.key))) {
    await db.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: editorRole.id, permissionId: p.id },
      },
      create: { roleId: editorRole.id, permissionId: p.id },
      update: {},
    });
  }

  const email = process.env.PAMS_ADMIN_EMAIL || "admin@orammedia.com";
  const password = process.env.PAMS_ADMIN_PASSWORD || "oram-admin-change-me";
  const passwordHash = await hash(password, 12);

  await db.user.upsert({
    where: { email },
    create: {
      email,
      name: "ORAM Archivist",
      passwordHash,
      roleId: superRole.id,
    },
    update: { passwordHash, roleId: superRole.id, active: true },
  });

  console.log(`Admin user: ${email}`);
}

async function ensurePerson(name: string) {
  const slug = slugify(name);
  return db.person.upsert({
    where: { slug },
    create: { name, slug },
    update: {},
  });
}

async function seedTaxonomy() {
  const cats = [
    { name: "Narrative", slug: "narrative" },
    { name: "Branded", slug: "branded" },
    { name: "Commercial", slug: "commercial" },
  ];
  for (const c of cats) {
    await db.category.upsert({
      where: { slug: c.slug },
      create: c,
      update: {},
    });
  }
}

async function seedProductionsFromMock() {
  for (const p of projects) {
    const archival = archivalTitles.find(
      (a) => a.siteSlug === p.slug || a.id === p.slug,
    );

    const production = await db.production.upsert({
      where: { slug: p.slug },
      create: {
        title: p.title,
        slug: p.slug,
        year: p.year,
        kind:
          p.duration?.toLowerCase().includes("series") ||
          p.duration?.toLowerCase().includes("telenovela")
            ? p.duration.toLowerCase().includes("telenovela")
              ? "telenovela"
              : "tv-series"
            : "feature",
        status: "released",
        workflowStatus: p.published === false ? "media-review" : "published",
        archivalCategory:
          p.archivalCategory ||
          archival?.category ||
          "requires-verification",
        synopsis: p.description,
        story: p.fullDescription,
        challenge: p.challenge,
        creativeDirection: p.approach,
        productionProcess: p.productionProcess,
        behindTheScenes: p.behindTheScenes,
        resultsJson: JSON.stringify(p.results ?? []),
        interestingFactsJson: JSON.stringify(p.interestingFacts ?? []),
        alternativeTitles: JSON.stringify(p.alternativeTitles ?? []),
        oramRole: p.oramRole || archival?.oramRole,
        owasRole: archival?.owasRole,
        productionCompanyText: p.productionCompany,
        clientNameText: p.clientName,
        broadcaster: p.broadcaster,
        streamingPlatform: p.streamingPlatform,
        featured: p.featured,
        sortOrder: p.order,
        portraitPoster: Boolean(p.portraitPoster),
        published: p.published !== false,
        runtime: p.duration,
        seoTitle: p.title,
        seoDescription: p.description,
        verificationNotes: archival?.conflicts?.join("\n"),
      },
      update: {
        synopsis: p.description,
        story: p.fullDescription,
        archivalCategory:
          p.archivalCategory ||
          archival?.category ||
          "requires-verification",
        oramRole: p.oramRole || archival?.oramRole,
        owasRole: archival?.owasRole,
        featured: p.featured,
        sortOrder: p.order,
        published: p.published !== false,
        workflowStatus: p.published === false ? "media-review" : "published",
        productionCompanyText: p.productionCompany,
        clientNameText: p.clientName,
        broadcaster: p.broadcaster,
        streamingPlatform: p.streamingPlatform,
        challenge: p.challenge,
        creativeDirection: p.approach,
        productionProcess: p.productionProcess,
        behindTheScenes: p.behindTheScenes,
        resultsJson: JSON.stringify(p.results ?? []),
        interestingFactsJson: JSON.stringify(p.interestingFacts ?? []),
        portraitPoster: Boolean(p.portraitPoster),
      },
    });

    // Clear & reseed credits / media / trailers for idempotent seed
    await db.productionCredit.deleteMany({ where: { productionId: production.id } });
    await db.mediaAsset.deleteMany({ where: { productionId: production.id } });
    await db.trailer.deleteMany({ where: { productionId: production.id } });

    let order = 0;
    for (const c of p.credits ?? []) {
      const person = await ensurePerson(c.name);
      await db.productionCredit.create({
        data: {
          productionId: production.id,
          personId: person.id,
          personName: c.name,
          role: c.role,
          department: /cast/i.test(c.role) ? "cast" : "crew",
          billingOrder: order++,
        },
      });
    }

    const mediaEntries: {
      path: string;
      role: string;
      heroEligible?: boolean;
      ogEligible?: boolean;
      sortOrder: number;
    }[] = [];

    if (p.posterUrl) {
      mediaEntries.push({
        path: p.posterUrl,
        role: "poster",
        heroEligible: p.slug === "inkondo",
        ogEligible: p.slug === "inkondo",
        sortOrder: 0,
      });
    }
    if (p.thumbnail && p.thumbnail !== p.posterUrl) {
      mediaEntries.push({
        path: p.thumbnail,
        role: "hero",
        heroEligible: true,
        sortOrder: 1,
      });
    }
    (p.gallery ?? []).forEach((g, i) => {
      if (mediaEntries.some((m) => m.path === g)) return;
      const role = g.includes("/bts/") ? "bts" : "gallery";
      mediaEntries.push({ path: g, role, sortOrder: 10 + i });
    });

    for (const m of mediaEntries) {
      const filename = m.path.split("/").pop() || m.path;
      await db.mediaAsset.create({
        data: {
          filename,
          originalName: filename,
          path: m.path,
          mimeType: m.path.endsWith(".png") ? "image/png" : "image/jpeg",
          kind: "image",
          role: m.role,
          productionId: production.id,
          approvalStatus: "approved",
          archiveStatus: "active",
          rightsOwner: "ORAM Media Dynamics / cleared archive",
          usageRights: "Website & archive",
          altText: `${p.title} — ${m.role}`,
          heroEligible: Boolean(m.heroEligible),
          socialEligible: Boolean(m.ogEligible || m.heroEligible),
          ogEligible: Boolean(m.ogEligible),
          sortOrder: m.sortOrder,
        },
      });
    }

    if (p.youtubeId || p.videoUrl) {
      await db.trailer.create({
        data: {
          productionId: production.id,
          platform: p.youtubeId ? "youtube" : "other",
          url: p.videoUrl || undefined,
          youtubeId: p.youtubeId,
          officialStatus: p.youtubeId ? "unverified" : "bts-only",
          preferred: true,
          title: `${p.title} trailer`,
          posterUrl: p.posterUrl || p.thumbnail,
        },
      });
    }

    const oramCats = [
      "oram-production",
      "oram-co-production",
      "oram-service",
    ];
    const cat = production.archivalCategory;
    if (oramCats.includes(cat)) {
      const existing = await db.filmographyEntry.findFirst({
        where: { collection: "oram", title: p.title, year: p.year },
      });
      if (existing) {
        await db.filmographyEntry.update({
          where: { id: existing.id },
          data: {
            productionId: production.id,
            oramInvolvement: p.oramRole,
            published: p.published !== false,
            sortOrder: p.order,
          },
        });
      } else {
        await db.filmographyEntry.create({
          data: {
            collection: "oram",
            productionId: production.id,
            title: p.title,
            year: p.year,
            kind: production.kind,
            oramInvolvement: p.oramRole,
            published: p.published !== false,
            sortOrder: p.order,
          },
        });
      }
    }
  }

  // Owas personal filmography — separate collection, linked when possible
  for (const a of archivalTitles) {
    const existingProd = a.siteSlug
      ? await db.production.findUnique({ where: { slug: a.siteSlug } })
      : null;
    const year = a.year ?? 0;
    const existing = await db.filmographyEntry.findFirst({
      where: { collection: "owas", title: a.title, year },
    });
    if (existing) {
      await db.filmographyEntry.update({
        where: { id: existing.id },
        data: {
          productionId: existingProd?.id,
          notes: a.researchNotes || a.owasRole,
          oramInvolvement: a.oramRole,
        },
      });
    } else {
      await db.filmographyEntry.create({
        data: {
          collection: "owas",
          productionId: existingProd?.id,
          title: a.title,
          year,
          yearNote: a.yearNote,
          kind: a.kind,
          notes: a.researchNotes || a.owasRole,
          oramInvolvement: a.oramRole,
          published: false,
          sortOrder: a.year ? 3000 - a.year : 9999,
        },
      });
    }
  }
}

async function seedPeopleTeam() {
  for (const m of teamMembers) {
    await db.person.upsert({
      where: { slug: slugify(m.name) },
      create: {
        name: m.name,
        slug: slugify(m.name),
        bio: m.bio,
        photoUrl: m.photo,
      },
      update: { bio: m.bio, photoUrl: m.photo },
    });
  }
}

async function seedPartnersClients() {
  for (const [i, logo] of clientLogos.entries()) {
    await db.partner.upsert({
      where: { slug: slugify(logo.name) },
      create: {
        name: logo.name,
        slug: slugify(logo.name),
        logoUrl: logo.logoSrc,
        website: logo.url,
        order: i + 1,
        featured: true,
      },
      update: { logoUrl: logo.logoSrc, website: logo.url, order: i + 1 },
    });
  }
}

async function seedServices() {
  for (const [i, s] of services.entries()) {
    await db.serviceOffering.upsert({
      where: { slug: s.slug },
      create: {
        title: s.title,
        slug: s.slug,
        description: s.description,
        icon: s.icon,
        order: i + 1,
      },
      update: {
        title: s.title,
        description: s.description,
        icon: s.icon,
        order: i + 1,
      },
    });
  }
}

async function seedWebsiteConfig() {
  const { createDefaultWebsiteConfiguration } = await import(
    "../src/pams/types/website-config"
  );

  const defaults = createDefaultWebsiteConfiguration();
  const inkondo = await db.production.findUnique({
    where: { slug: "inkondo" },
    include: { media: true, trailers: true },
  });

  if (inkondo) {
    const billboard = inkondo.media.find((m) =>
      m.path.includes("inkondo-billboard"),
    );
    const poster = inkondo.media.find(
      (m) => m.role === "poster" || m.role === "hero",
    );
    const preferredTrailer = inkondo.trailers.find((t) => t.preferred);

    defaults.flagship = {
      productionSlug: "inkondo",
      heroPosterMediaId: billboard?.id ?? poster?.id ?? null,
      heroVideoTrailerId: preferredTrailer?.id ?? null,
      heroThumbnailMediaId: poster?.id ?? billboard?.id ?? null,
      shareImageMediaId: billboard?.id ?? poster?.id ?? null,
      featuredPosition: 1,
    };
    defaults.openGraph.imagePath =
      billboard?.path ?? poster?.path ?? defaults.openGraph.imagePath;
  }

  const json = JSON.stringify(defaults);

  try {
    for (const scope of ["draft", "published"] as const) {
      await db.websiteConfig.upsert({
        where: { id: scope },
        create: { id: scope, configJson: json },
        update: { configJson: json },
      });
    }

    const snapshotNames = [
      "2025 Launch",
      "Inkondo Campaign",
      "ZAFTA Awards",
      "Christmas Campaign",
      "Festival Edition",
    ];
    for (const name of snapshotNames) {
      const exists = await db.websiteSnapshot.findFirst({ where: { name } });
      if (!exists) {
        await db.websiteSnapshot.create({
          data: { name, configJson: json },
        });
      }
    }
  } catch (e) {
    console.warn(
      "Website config tables not ready — run `npx prisma db push` after stopping dev server:",
      e,
    );
  }
}

async function seedSettingsAndVerifications() {
  await seedWebsiteConfig();

  const defaults = [
    ["homepage.hero.path", "/projects/inkondo-billboard.jpg"],
    ["homepage.og.path", "/projects/inkondo-billboard.jpg"],
    ["showreel.poster.path", "/projects/inkondo-billboard.jpg"],
    ["flagship.production.slug", "inkondo"],
  ] as const;

  for (const [key, value] of defaults) {
    await db.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }

  // Open verification items from archival conflicts
  for (const a of archivalTitles) {
    if (!a.conflicts?.length) continue;
    const prod = a.siteSlug
      ? await db.production.findUnique({ where: { slug: a.siteSlug } })
      : null;
    for (const claim of a.conflicts) {
      const existing = await db.verificationItem.findFirst({
        where: { claim, productionId: prod?.id },
      });
      if (existing) continue;
      await db.verificationItem.create({
        data: {
          productionId: prod?.id,
          field: "conflict",
          claim,
          status: "open",
          source: a.sources[0]?.label,
          sourceUrl: a.sources[0]?.url,
        },
      });
    }
  }
}

async function main() {
  console.log("Seeding PAMS…");
  await seedAuth();
  await seedTaxonomy();
  await seedPeopleTeam();
  await seedProductionsFromMock();
  await seedPartnersClients();
  await seedServices();
  await seedSettingsAndVerifications();

  const counts = {
    productions: await db.production.count(),
    published: await db.production.count({ where: { published: true } }),
    people: await db.person.count(),
    media: await db.mediaAsset.count(),
    trailers: await db.trailer.count(),
    filmography: await db.filmographyEntry.count(),
    verification: await db.verificationItem.count(),
  };
  console.log("Seed complete:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
