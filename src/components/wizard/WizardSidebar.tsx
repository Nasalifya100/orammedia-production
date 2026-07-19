import Link from "next/link";
import { Check } from "lucide-react";
import {
  WIZARD_STEPS,
  type WizardStepId,
} from "@/pams/types/wizard";

interface WizardSidebarProps {
  productionTitle: string;
  currentStep: WizardStepId;
  completedSteps: WizardStepId[];
  onStepClick: (step: WizardStepId) => void;
}

export function WizardSidebar({
  productionTitle,
  currentStep,
  completedSteps,
  onStepClick,
}: WizardSidebarProps) {
  return (
    <aside className="w-full shrink-0 border-b border-white/10 bg-[#101014] lg:w-56 lg:border-b-0 lg:border-r">
      <div className="p-5">
        <Link
          href="/admin/productions"
          className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white"
        >
          ← Productions
        </Link>
        <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-amber-500/90">
          Wizard
        </p>
        <p className="mt-1 truncate text-sm font-medium text-white/90">
          {productionTitle}
        </p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:gap-0 lg:px-2 lg:pb-6">
        {WIZARD_STEPS.map((step) => {
          const done = completedSteps.includes(step.id);
          const active = currentStep === step.id;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick(step.id)}
              className={`flex shrink-0 items-center gap-2 rounded px-3 py-2.5 text-left text-sm transition lg:w-full ${
                active
                  ? "bg-amber-600/20 text-amber-100"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                  done
                    ? "bg-emerald-600/30 text-emerald-300"
                    : active
                      ? "border border-amber-500/50 text-amber-300"
                      : "border border-white/20 text-white/30"
                }`}
              >
                {done ? <Check size={12} /> : step.number}
              </span>
              {step.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
