import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/projects/Breadcrumbs";
import { TrailerButton } from "@/components/projects/TrailerButton";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatCategory } from "@/lib/utils";
import {
  getProjectBySlug,
  getProjectSlugs,
  getProjects,
  siteConfig,
} from "@/lib/data";

export const revalidate = 3600;

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} | Oram Media Dynamics`,
      description: project.description,
      images: [{ url: project.thumbnail }],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, all] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
  ]);

  if (!project) notFound();

  const ordered = [...all].sort((a, b) => a.order - b.order);
  const idx = ordered.findIndex((p) => p.slug === project.slug);
  const next = ordered[(idx + 1) % ordered.length];

  const meta = [
    { label: "Client", value: project.clientName },
    { label: "Year", value: String(project.year) },
    { label: "Format", value: project.duration },
    { label: "Category", value: formatCategory(project.category) },
  ];

  const absThumb = project.thumbnail.startsWith("http")
    ? project.thumbnail
    : `${siteConfig.url}${project.thumbnail}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Work",
        item: `${siteConfig.url}/projects`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `${siteConfig.url}/projects/${project.slug}`,
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
      {/* Title sequence */}
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

      {/* Meta strip */}
      <Container>
        <div className="grid grid-cols-2 gap-8 border-y border-line py-10 md:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label}>
              <p className="eyebrow mb-2">{m.label}</p>
              <p className="text-foreground">{m.value}</p>
            </div>
          ))}
        </div>
      </Container>

      {/* Overview */}
      <section className="section">
        <Container>
          <div className="grid gap-10 md:grid-cols-[0.5fr_1fr] md:gap-20">
            <Reveal variant="up">
              <p className="eyebrow">Overview</p>
            </Reveal>
            <Reveal variant="up" delay={0.1}>
              <p className="display display-sm max-w-3xl text-foreground">
                {project.fullDescription}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Challenge / Approach */}
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
                  <p className="eyebrow mb-6">Our Approach</p>
                  <p className="text-xl leading-relaxed text-ink-dim">
                    {project.approach}
                  </p>
                </Reveal>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* Behind the scenes */}
      {project.behindTheScenes && (
        <section className="section border-t border-line">
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

      {/* Gallery */}
      {project.gallery.length > 0 && (
        <section className="section border-t border-line">
          <Container>
            <p className="eyebrow mb-12">Gallery</p>
            <div className="grid gap-5 md:gap-8">
              {project.gallery.map((image, i) => (
                <Reveal key={image} variant="clip" delay={(i % 2) * 0.08}>
                  <div className="relative aspect-cinema-tall w-full overflow-hidden bg-surface-2">
                    <Image
                      src={image}
                      alt={`${project.title} still ${i + 1}`}
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

      {/* Results */}
      {project.results && project.results.length > 0 && (
        <section className="section border-t border-line bg-surface">
          <Container>
            <p className="eyebrow mb-12">Results</p>
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

      {/* Credits */}
      {project.credits && project.credits.length > 0 && (
        <section className="section border-t border-line">
          <Container>
            <div className="grid gap-10 md:grid-cols-[0.5fr_1fr] md:gap-20">
              <Reveal variant="up">
                <p className="eyebrow">Credits</p>
              </Reveal>
              <div className="max-w-2xl">
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

      {/* Next project */}
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
