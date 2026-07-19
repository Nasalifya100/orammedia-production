import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProjects,
  getRelatedProjects,
  siteConfig,
} from "@/lib/data";
import { resolvePublicProject } from "@/lib/data/project-detail";
import { ProjectDetailView } from "@/components/projects/ProjectDetailView";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await resolvePublicProject(slug);
  if (!project) {
    // Call notFound before any streaming commit so HTTP status can be 404.
    notFound();
  }

  const canonical = `${siteConfig.url}/projects/${project.slug}`;

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical },
    openGraph: {
      title: `${project.title} | Oram Media Dynamics`,
      description: project.description,
      url: canonical,
      images: [{ url: project.thumbnail }],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await resolvePublicProject(slug);
  if (!project) notFound();

  const all = await getProjects();
  const ordered = [...all].sort((a, b) => a.order - b.order);
  const idx = ordered.findIndex((p) => p.slug === project.slug);
  const next = ordered[(idx + 1) % ordered.length];

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
