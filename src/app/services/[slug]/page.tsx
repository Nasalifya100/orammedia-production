import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumbs } from "@/components/projects/Breadcrumbs";
import { ProjectPoster } from "@/components/projects/ProjectPoster";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import {
  getServiceBySlug,
  getServiceSlugs,
  getRelatedProjects,
  getTestimonialsByService,
} from "@/lib/data";

export const revalidate = 3600;

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service Not Found" };

  return {
    title: service.title,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) notFound();

  const [relatedProjects, serviceTestimonials] = await Promise.all([
    getRelatedProjects(service.relatedProjectSlugs),
    getTestimonialsByService(slug),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Services"
        title={service.title}
        description={service.description}
        minHeight="tall"
        image="/about/studio-zuba.png"
        imageAlt={service.title}
      />

      <section className="section bg-surface-0">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Services", href: "/services" },
              { label: service.title },
            ]}
          />

          <div className="mt-16 grid gap-14 lg:grid-cols-2 lg:gap-24">
            <Reveal variant="up">
              <p className="eyebrow mb-8">What we offer</p>
              <ul className="border-t border-line">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="border-b border-line py-4 text-lg text-foreground"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal variant="up" delay={0.1}>
              <p className="eyebrow mb-8">What sets us apart</p>
              <ul className="space-y-6">
                {service.differentiators.map((diff) => (
                  <li
                    key={diff}
                    className="border-l border-accent/40 pl-6 leading-relaxed text-ink-dim"
                  >
                    {diff}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      {relatedProjects.length > 0 && (
        <section className="section border-t border-line bg-surface">
          <Container>
            <div className="mb-14">
              <p className="eyebrow mb-5">Related work</p>
              <SplitHeading
                as="h2"
                text="Seen on screen"
                className="display display-lg text-foreground"
              />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 md:gap-10">
              {relatedProjects.map((project, i) => (
                <ProjectPoster key={project.id} project={project} index={i} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {serviceTestimonials.length > 0 && (
        <section className="section border-t border-line bg-surface-0">
          <Container>
            <p className="eyebrow mb-12">Client testimonials</p>
            <div className="grid gap-10 md:grid-cols-2">
              {serviceTestimonials.map((t) => (
                <Reveal key={t.id} variant="up">
                  <blockquote>
                    <p className="display display-sm leading-snug text-foreground">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <footer className="mt-6 text-sm uppercase tracking-[0.14em] text-ink-faint">
                      {t.clientName}, {t.company}
                    </footer>
                  </blockquote>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
