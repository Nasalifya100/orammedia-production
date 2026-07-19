/** Production Wizard — step definitions and progress */

export const WIZARD_STEPS = [
  { id: "overview", label: "Overview", number: 1 },
  { id: "media", label: "Media", number: 2 },
  { id: "credits", label: "Credits", number: 3 },
  { id: "awards", label: "Awards", number: 4 },
  { id: "seo", label: "SEO", number: 5 },
  { id: "rights", label: "Rights", number: 6 },
  { id: "preview", label: "Preview", number: 7 },
  { id: "publish", label: "Publish", number: 8 },
] as const;

export type WizardStepId = (typeof WIZARD_STEPS)[number]["id"];

export interface RightsChecklist {
  posterRights: boolean;
  trailerRights: boolean;
  galleryRights: boolean;
  musicRights: boolean;
  broadcastRights: boolean;
  approvalStatus: string;
  verificationStatus: string;
}

export const DEFAULT_RIGHTS_CHECKLIST: RightsChecklist = {
  posterRights: false,
  trailerRights: false,
  galleryRights: false,
  musicRights: false,
  broadcastRights: false,
  approvalStatus: "pending",
  verificationStatus: "unverified",
};

export interface WizardScores {
  production: number;
  media: number;
  seo: number;
  rights: number;
  archive: number;
  overall: number;
}

export interface WizardValidation {
  errors: string[];
  warnings: string[];
  scores: WizardScores;
  canPublish: boolean;
}

export function parseCompletedSteps(json: string | null | undefined): WizardStepId[] {
  if (!json) return [];
  try {
    const arr = JSON.parse(json) as string[];
    return arr.filter((s) =>
      WIZARD_STEPS.some((w) => w.id === s),
    ) as WizardStepId[];
  } catch {
    return [];
  }
}

export function parseRightsChecklist(json: string | null | undefined): RightsChecklist {
  if (!json) return { ...DEFAULT_RIGHTS_CHECKLIST };
  try {
    return { ...DEFAULT_RIGHTS_CHECKLIST, ...JSON.parse(json) };
  } catch {
    return { ...DEFAULT_RIGHTS_CHECKLIST };
  }
}

export function stepIndex(id: WizardStepId): number {
  return WIZARD_STEPS.findIndex((s) => s.id === id);
}

export function nextStep(id: WizardStepId): WizardStepId | null {
  const i = stepIndex(id);
  return i >= 0 && i < WIZARD_STEPS.length - 1
    ? WIZARD_STEPS[i + 1].id
    : null;
}

export function prevStep(id: WizardStepId): WizardStepId | null {
  const i = stepIndex(id);
  return i > 0 ? WIZARD_STEPS[i - 1].id : null;
}
