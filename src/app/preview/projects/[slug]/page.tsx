import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDraftProjectBySlug } from "@/lib/data/preview-project";
import { getProjects, getRelatedProjects, siteConfig } from "@/lib/data";
import { ProjectDetailView } from "@/components/projects/ProjectDetailView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PreviewProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PreviewProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getDraftProjectBySlug(slug);
  if (!project) return { title: "Preview Not Found" };

  return {
    title: `[Preview] ${project.title}`,
    robots: { index: false, follow: false },
  };
}

export default async function PreviewProjectPage({ params }: PreviewProjectPageProps) {
  const { slug } = await params;
  const [project, all] = await Promise.all([
    getDraftProjectBySlug(slug),
    getProjects(),
  ]);

  if (!project) notFound();

  const ordered = [...all, project]
    .filter((p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i)
    .sort((a, b) => a.order - b.order);
  const idx = ordered.findIndex((p) => p.slug === project.slug);
  const next = ordered.length > 1 ? ordered[(idx + 1) % ordered.length] : undefined;

  const related = project.relatedProjectSlugs?.length
    ? await getRelatedProjects(project.relatedProjectSlugs)
    : [];

  return (
    <ProjectDetailView
      project={project}
      related={related}
      next={next}
      siteUrl={siteConfig.url}
    />
  );
}
