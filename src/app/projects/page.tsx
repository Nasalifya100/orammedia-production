import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { getProjects } from "@/lib/data";
import type { ProjectCategoryFilter } from "@/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Work — Film & TV Production Zambia",
  description:
    "Portfolio from Oram Media Dynamics, Lusaka: Inkondo and Zuba for Zambezi Magic, features Graft and Look in the Mirror, and institutional films across Zambia.",
};

interface ProjectsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const category = (params.category ?? "all") as ProjectCategoryFilter;
  const projects = await getProjects();
  const sorted = [...projects].sort((a, b) => a.order - b.order);

  return (
    <>
      <PageHero
        eyebrow="Selected Work"
        title="Our Work"
        description="Original content that captivates audiences across TV and digital platforms — from Zambezi Magic dramas to feature films and national campaigns."
        minHeight="tall"
        image="/media/bts/inkondo-shoot-s2.jpg"
        imageAlt="Inkondo Season 2 shoot — Oram Media Dynamics for Zambezi Magic"
      />

      <section className="section bg-surface-0">
        <Container>
          <ProjectGrid projects={sorted} initialCategory={category} />
        </Container>
      </section>
    </>
  );
}
