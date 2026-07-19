import { Suspense } from "react";
import { redirect, notFound } from "next/navigation";
import { readSession } from "@/pams/auth/session";
import { wizardService } from "@/pams/services/wizard.service";
import { ProductionWizardShell } from "@/components/wizard/ProductionWizardShell";

export const dynamic = "force-dynamic";

async function WizardContent({ id }: { id: string }) {
  const production = await wizardService.getProduction(id);
  if (!production) notFound();

  const scores = wizardService.getScores(production);
  const progressPercent = wizardService.progressPercent(production);
  const completed = wizardService.completedSteps(production);

  const shellProduction = {
    id: production.id,
    title: production.title,
    slug: production.slug,
    year: production.year,
    kind: production.kind,
    status: production.status,
    archivalCategory: production.archivalCategory,
    synopsis: production.synopsis,
    oramRole: production.oramRole,
    owasRole: production.owasRole,
    broadcaster: production.broadcaster,
    streamingPlatform: production.streamingPlatform,
    runtime: production.runtime,
    seoTitle: production.seoTitle,
    seoDescription: production.seoDescription,
    seoCanonical: production.seoCanonical,
    featured: production.featured,
    sortOrder: production.sortOrder,
    homepageCampaign: production.homepageCampaign,
    flagshipCandidate: production.flagshipCandidate,
    wizardStep: production.wizardStep,
    wizardCompletedJson: JSON.stringify(completed),
    rightsChecklistJson: production.rightsChecklistJson,
    productionNotes: production.productionNotes,
    rightsNotes: production.rightsNotes,
    verificationNotes: production.verificationNotes,
    published: production.published,
    media: production.media.map((m) => ({
      id: m.id,
      path: m.path,
      role: m.role,
      kind: m.kind,
      width: m.width,
      height: m.height,
      approvalStatus: m.approvalStatus,
      variantsJson: m.variantsJson,
    })),
    trailers: production.trailers.map((t) => ({
      id: t.id,
      platform: t.platform,
      title: t.title,
      url: t.url,
      youtubeId: t.youtubeId,
      muxPlaybackId: t.muxPlaybackId,
      preferred: t.preferred,
    })),
    credits: production.credits.map((c) => ({
      id: c.id,
      personName: c.personName,
      role: c.role,
      department: c.department,
      personId: c.personId,
    })),
  };

  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center text-sm text-white/40">
          Loading step…
        </div>
      }
    >
      <ProductionWizardShell
        production={shellProduction}
        progressPercent={progressPercent}
        scores={scores}
      />
    </Suspense>
  );
}

export default async function ProductionWizardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await readSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center text-sm text-white/40">
          Loading wizard…
        </div>
      }
    >
      <WizardContent id={id} />
    </Suspense>
  );
}
