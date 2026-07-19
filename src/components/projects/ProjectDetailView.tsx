import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/projects/Breadcrumbs";
import { TrailerButton } from "@/components/projects/TrailerButton";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatCategory } from "@/lib/utils";
import { buildProductionArchive } from "@/lib/data/production-archive";
import { ProductionArchiveRecord } from "@/components/projects/ProductionArchiveRecord";
import type { Project } from "@/types";

interface ProjectDetailViewProps {
  project: Project;
  related: Project[];
  next?: Project;
  siteUrl: string;
}

export function ProjectDetailView({
  project,
  related,
  next,
  siteUrl,
}: ProjectDetailViewProps) {
  const productionArchive = buildProductionArchive(project);

  const galleryImages = project.gallery.filter(
    (image) => image !== project.thumbnail,
  );

  const meta = [
    { label: "Client", value: project.clientName },
    { label: "Year", value: String(project.year) },
    { label: "Format", value: project.duration },
    ...(project.genre
      ? [{ label: "Genre", value: project.genre }]
      : [{ label: "Category", value: formatCategory(project.category) }]),
    ...(project.broadcaster
      ? [{ label: "Broadcaster", value: project.broadcaster }]
      : []),
    ...(project.streamingPlatform
      ? [{ label: "Streaming", value: project.streamingPlatform }]
      : []),
  ];

  const absThumb = project.thumbnail.startsWith("http")
    ? project.thumbnail
    : `${siteUrl}${project.thumbnail}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Work",
        item: `${siteUrl}/projects`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `${siteUrl}/projects/${project.slug}`,
      },
    ],
  };

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: project.title,
    description: project.description,
    thumbnailUrl: absThumb,
    uploadDate: `${project.year}-01-01`,
    ...(project.youtubeId
      ? {
          embedUrl: `https://www.youtube.com/embed/${project.youtubeId}`,
          contentUrl: `https://www.youtube.com/watch?v=${project.youtubeId}`,
        }
      : project.videoUrl
        ? { contentUrl: project.videoUrl }
        : {}),
  };

  return (
    <article className="bg-surface-0">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={videoSchema} />
      {project.portraitPoster ? (
        <section className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24">
          <Container>
            <div className="grid items-center gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
              <Reveal variant="scale">
                <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden bg-surface-2">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    priority
                    quality={92}
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
              <div>
                <p className="eyebrow eyebrow-accent mb-5">
                  {formatCategory(project.category)} · {project.year}
                </p>
                <SplitHeading
                  as="h1"
                  text={project.title}
                  className="display display-xl text-foreground"
                />
                <Reveal variant="up" delay={0.15}>
                  <p className="lede mt-8 max-w-xl">{project.description}</p>
                  <div className="mt-10">
                    <TrailerButton project={project} />
                  </div>
                </Reveal>
              </div>
            </div>
          </Container>
        </section>
      ) : (
        <section className="relative flex min-h-[88vh] flex-col justify-end overflow-hidden">
          <ParallaxMedia className="absolute inset-0" strength={10}>
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              priority
              quality={92}
              sizes="100vw"
              className="object-cover"
            />
          </ParallaxMedia>
          <div className="absolute inset-0 bg-gradient-to-t from-surface-0 via-surface-0/40 to-surface-0/30" />
          <div className="vignette absolute inset-0" />
          <Container className="relative z-10 pb-16 md:pb-20">
            <p className="eyebrow eyebrow-accent mb-5">
              {formatCategory(project.category)} · {project.year}
            </p>
            <SplitHeading
              as="h1"
              text={project.title}
              className="display display-xl max-w-[14ch] text-foreground"
            />
            <Reveal variant="up" delay={0.15}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <TrailerButton project={project} />
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      <Container>
        <div className="grid grid-cols-2 gap-8 border-y border-line py-10 md:grid-cols-3 lg:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label}>
              <p className="eyebrow mb-2">{m.label}</p>
              <p className="text-foreground">{m.value}</p>
            </div>
          ))}
        </div>
      </Container>

      <section className="section">
        <Container>
          <div className="grid gap-10 md:grid-cols-[0.5fr_1fr] md:gap-20">
            <Reveal variant="up">
              <p className="eyebrow">Synopsis</p>
            </Reveal>
            <Reveal variant="up" delay={0.1}>
              <p className="display display-sm max-w-3xl text-foreground">
                {project.fullDescription}
              </p>
              {project.productionCompany && (
                <p className="mt-8 text-sm uppercase tracking-[0.16em] text-ink-faint">
                  {project.productionCompany}
                </p>
              )}
            </Reveal>
          </div>
        </Container>
      </section>

      {(project.challenge || project.approach) && (
        <section className="section border-t border-line bg-surface">
          <Container>
            <div className="grid gap-14 md:grid-cols-2 md:gap-20">
              {project.challenge && (
                <Reveal variant="up">
                  <p className="eyebrow mb-6">The Challenge</p>
                  <p className="text-xl leading-relaxed text-ink-dim">
                    {project.challenge}
                  </p>
                </Reveal>
              )}
              {project.approach && (
                <Reveal variant="up" delay={0.1}>
                  <p className="eyebrow mb-6">Creative Direction</p>
                  <p className="text-xl leading-relaxed text-ink-dim">
                    {project.approach}
                  </p>
                </Reveal>
              )}
            </div>
          </Container>
        </section>
      )}

      {project.productionProcess && (
        <section className="section border-t border-line">
          <Container>
            <div className="grid gap-10 md:grid-cols-[0.5fr_1fr] md:gap-20">
              <Reveal variant="up">
                <p className="eyebrow">Production Process</p>
              </Reveal>
              <Reveal variant="up" delay={0.1}>
                <p className="max-w-3xl text-xl leading-relaxed text-ink-dim">
                  {project.productionProcess}
                </p>
              </Reveal>
            </div>
          </Container>
        </section>
      )}

      {project.behindTheScenes && (
        <section className="section border-t border-line bg-surface">
          <Container>
            <div className="grid gap-10 md:grid-cols-[0.5fr_1fr] md:gap-20">
              <Reveal variant="up">
                <p className="eyebrow">Behind the Scenes</p>
              </Reveal>
              <Reveal variant="up" delay={0.1}>
                <p className="max-w-3xl text-xl leading-relaxed text-ink-dim">
                  {project.behindTheScenes}
                </p>
              </Reveal>
            </div>
          </Container>
        </section>
      )}

      {project.results && project.results.length > 0 && (
        <section className="section border-t border-line">
          <Container>
            <p className="eyebrow mb-12">The Result</p>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {project.results.map((r) => (
                <Reveal key={r.label} variant="up">
                  <p className="numeral display display-lg text-foreground">
                    {r.value}
                  </p>
                  <p className="mt-3 text-sm uppercase tracking-[0.16em] text-ink-faint">
                    {r.label}
                  </p>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {project.awardsList && project.awardsList.length > 0 && (
        <section className="section border-t border-line bg-surface">
          <Container>
            <p className="eyebrow mb-12">Awards</p>
            <ul className="max-w-2xl space-y-6">
              {project.awardsList.map((a) => (
                <li key={`${a.name}-${a.year ?? ""}`}>
                  <p className="text-xl text-foreground">{a.name}</p>
                  <p className="mt-1 text-sm uppercase tracking-[0.16em] text-ink-faint">
                    {[a.organization, a.year].filter(Boolean).join(" · ")}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {project.credits && project.credits.length > 0 && (
        <section className="section border-t border-line">
          <Container>
            <div className="grid gap-10 md:grid-cols-[0.5fr_1fr] md:gap-20">
              <Reveal variant="up">
                <p className="eyebrow">Credits</p>
              </Reveal>
              <div className="max-w-2xl">
                {project.oramRole && (
                  <p className="mb-8 text-sm leading-relaxed text-ink-dim">
                    <span className="uppercase tracking-[0.16em] text-ink-faint">
                      ORAM role ·{" "}
                    </span>
                    {project.oramRole}
                  </p>
                )}
                {project.credits.map((c, i) => (
                  <Reveal key={`${c.role}-${c.name}-${i}`} variant="up" delay={i * 0.04}>
                    <div className="flex items-baseline justify-between gap-6 border-b border-line py-5">
                      <span className="text-sm uppercase tracking-[0.16em] text-ink-faint">
                        {c.role}
                      </span>
                      <span className="text-right text-lg text-foreground">
                        {c.name}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {project.interestingFacts && project.interestingFacts.length > 0 && (
        <section className="section border-t border-line bg-surface">
          <Container>
            <div className="grid gap-10 md:grid-cols-[0.5fr_1fr] md:gap-20">
              <Reveal variant="up">
                <p className="eyebrow">Interesting Facts</p>
              </Reveal>
              <ul className="max-w-3xl space-y-5">
                {project.interestingFacts.map((fact) => (
                  <li
                    key={fact}
                    className="border-b border-line pb-5 text-xl leading-relaxed text-ink-dim last:border-0"
                  >
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      )}

      {galleryImages.length > 0 && (
        <section className="section border-t border-line">
          <Container>
            <p className="eyebrow mb-12">Media Gallery</p>
            <div className="grid gap-5 md:gap-8">
              {galleryImages.map((image, i) => (
                <Reveal key={image} variant="clip" delay={(i % 2) * 0.08}>
                  <div className="relative aspect-cinema-tall w-full overflow-hidden bg-surface-2">
                    <Image
                      src={image}
                      alt={`${project.title} — media ${i + 1}`}
                      fill
                      quality={88}
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {project.officialLinks && project.officialLinks.length > 0 && (
        <section className="section border-t border-line bg-surface">
          <Container>
            <p className="eyebrow mb-10">Watch &amp; Links</p>
            <ul className="max-w-2xl space-y-4">
              {project.officialLinks.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost link-line inline-flex items-center gap-2 text-foreground"
                  >
                    {link.label}
                    <ArrowUpRight size={15} strokeWidth={1.5} />
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {related.length > 0 && (
        <section className="section border-t border-line">
          <Container>
            <p className="eyebrow mb-12">Related Projects</p>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {related.map((r, i) => (
                <Reveal key={r.slug} variant="up" delay={i * 0.06}>
                  <Link href={`/projects/${r.slug}`} className="group block">
                    <div className="relative mb-5 aspect-video overflow-hidden bg-surface-2">
                      {r.thumbnail ? (
                        <Image
                          src={r.thumbnail}
                          alt={r.title}
                          fill
                          quality={85}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : null}
                    </div>
                    <p className="text-sm uppercase tracking-[0.16em] text-ink-faint">
                      {r.year}
                    </p>
                    <h3 className="mt-2 text-xl text-foreground transition-colors group-hover:text-accent">
                      {r.title}
                    </h3>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      <ProductionArchiveRecord archive={productionArchive} />

      {next && (
        <section className="border-t border-line">
          <Link
            href={`/projects/${next.slug}`}
            className="group block py-20 transition-colors hover:bg-ink/[0.02] md:py-28"
          >
            <Container className="flex flex-col items-center text-center">
              <p className="eyebrow mb-6">Next Project</p>
              <h2 className="display display-lg text-foreground transition-colors group-hover:text-accent">
                {next.title}
              </h2>
              <span className="btn-ghost link-line mt-8 inline-flex items-center gap-2 text-foreground">
                View project
                <ArrowUpRight size={15} strokeWidth={1.5} />
              </span>
            </Container>
          </Link>
        </section>
      )}

      <Container className="pb-16">
        <Breadcrumbs
          items={[
            { label: "Work", href: "/projects" },
            { label: project.title },
          ]}
        />
      </Container>
    </article>
  );
}
