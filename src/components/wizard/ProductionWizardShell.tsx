"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WizardSidebar } from "@/components/wizard/WizardSidebar";
import { WizardProgressBar } from "@/components/wizard/WizardProgressBar";
import { WizardOverviewStep } from "@/components/wizard/steps/WizardOverviewStep";
import { WizardMediaStep } from "@/components/wizard/steps/WizardMediaStep";
import { WizardCreditsStep } from "@/components/wizard/steps/WizardCreditsStep";
import { WizardAwardsStep } from "@/components/wizard/steps/WizardAwardsStep";
import { WizardSeoStep } from "@/components/wizard/steps/WizardSeoStep";
import { WizardRightsStep } from "@/components/wizard/steps/WizardRightsStep";
import { WizardPreviewStep } from "@/components/wizard/steps/WizardPreviewStep";
import { WizardPublishStep } from "@/components/wizard/steps/WizardPublishStep";
import {
  WIZARD_STEPS,
  type WizardStepId,
  parseCompletedSteps,
  parseRightsChecklist,
} from "@/pams/types/wizard";
import { setWizardStepAction } from "@/app/admin/productions/wizard/actions";

export type WizardProduction = {
  id: string;
  title: string;
  slug: string;
  year: number | null;
  kind: string;
  status: string;
  archivalCategory: string;
  synopsis: string | null;
  oramRole: string | null;
  owasRole: string | null;
  broadcaster: string | null;
  streamingPlatform: string | null;
  runtime: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoCanonical: string | null;
  featured: boolean;
  sortOrder: number;
  homepageCampaign: string | null;
  flagshipCandidate: boolean;
  wizardStep: string;
  wizardCompletedJson: string | null;
  rightsChecklistJson: string | null;
  productionNotes: string | null;
  rightsNotes: string | null;
  verificationNotes: string | null;
  published: boolean;
  media: {
    id: string;
    path: string;
    role: string;
    kind: string;
    width: number | null;
    height: number | null;
    approvalStatus: string;
    variantsJson: string | null;
  }[];
  trailers: {
    id: string;
    platform: string;
    title: string | null;
    url: string | null;
    youtubeId: string | null;
    muxPlaybackId: string | null;
    preferred: boolean;
  }[];
  credits: {
    id: string;
    personName: string;
    role: string;
    department: string | null;
    personId: string | null;
  }[];
};

interface ProductionWizardShellProps {
  production: WizardProduction;
  progressPercent: number;
  scores: {
    production: number;
    media: number;
    seo: number;
    rights: number;
    archive: number;
    overall: number;
  };
}

export function ProductionWizardShell({
  production,
  progressPercent,
  scores,
}: ProductionWizardShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = (searchParams.get("step") || production.wizardStep || "overview") as WizardStepId;
  const currentStep = WIZARD_STEPS.some((s) => s.id === stepParam)
    ? stepParam
    : "overview";

  const completed = parseCompletedSteps(production.wizardCompletedJson);
  const [, startTransition] = useTransition();

  const goToStep = (step: WizardStepId) => {
    startTransition(async () => {
      await setWizardStepAction(production.id, step);
      router.push(`/admin/productions/${production.id}/wizard?step=${step}`);
    });
  };

  const rights = parseRightsChecklist(production.rightsChecklistJson);

  return (
    <div className="flex min-h-[calc(100vh-0px)] flex-col lg:flex-row">
      <WizardSidebar
        productionTitle={production.title}
        currentStep={currentStep}
        completedSteps={completed}
        onStepClick={goToStep}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b border-white/10 bg-[#0c0c0e] px-6 py-4 lg:px-10">
          <WizardProgressBar percent={progressPercent} />
          <p className="mt-2 text-xs text-white/40">
            Step {WIZARD_STEPS.find((s) => s.id === currentStep)?.number} of{" "}
            {WIZARD_STEPS.length} · {production.title}
          </p>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
          {currentStep === "overview" ? (
            <WizardOverviewStep production={production} />
          ) : null}
          {currentStep === "media" ? (
            <WizardMediaStep production={production} onRefresh={() => router.refresh()} />
          ) : null}
          {currentStep === "credits" ? (
            <WizardCreditsStep production={production} />
          ) : null}
          {currentStep === "awards" ? (
            <WizardAwardsStep production={production} />
          ) : null}
          {currentStep === "seo" ? (
            <WizardSeoStep production={production} />
          ) : null}
          {currentStep === "rights" ? (
            <WizardRightsStep productionId={production.id} checklist={rights} />
          ) : null}
          {currentStep === "preview" ? (
            <WizardPreviewStep slug={production.slug} productionId={production.id} />
          ) : null}
          {currentStep === "publish" ? (
            <WizardPublishStep
              production={production}
              scores={scores}
              onGoPreview={() => goToStep("preview")}
            />
          ) : null}
        </div>

        <footer className="flex items-center justify-between border-t border-white/10 bg-[#0c0c0e] px-6 py-4 lg:px-10">
          <StepNav
            current={currentStep}
            onNav={goToStep}
            direction="prev"
          />
          <StepNav
            current={currentStep}
            onNav={goToStep}
            direction="next"
          />
        </footer>
      </div>
    </div>
  );
}

function StepNav({
  current,
  onNav,
  direction,
}: {
  current: WizardStepId;
  onNav: (s: WizardStepId) => void;
  direction: "prev" | "next";
}) {
  const idx = WIZARD_STEPS.findIndex((s) => s.id === current);
  const target =
    direction === "prev"
      ? idx > 0
        ? WIZARD_STEPS[idx - 1].id
        : null
      : idx < WIZARD_STEPS.length - 1
        ? WIZARD_STEPS[idx + 1].id
        : null;

  if (!target) return <span />;

  return (
    <button
      type="button"
      onClick={() => onNav(target)}
      className="border border-white/15 px-4 py-2 text-xs uppercase tracking-wider text-white/70 hover:border-white/30"
    >
      {direction === "prev" ? "← Previous" : "Next →"}
    </button>
  );
}
