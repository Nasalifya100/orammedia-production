"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  contactFormSchema,
  type ContactFormValues,
  budgetLabels,
  projectTypeLabels,
} from "@/lib/validations/contact";
import { cn } from "@/lib/utils";

const STEPS = ["Project Details", "Your Information", "Review"];

export function ContactForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      projectType: undefined,
      budgetRange: undefined,
      timeline: "",
      description: "",
      companyName: "",
      fullName: "",
      email: "",
      phone: "",
    },
  });

  const values = watch();

  const stepFields: (keyof ContactFormValues)[][] = [
    ["projectType", "budgetRange", "timeline", "description"],
    ["companyName", "fullName", "email", "phone"],
    [],
  ];

  const nextStep = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Submission failed");
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border border-line bg-surface-2 p-12 text-center"
      >
        <CheckCircle size={64} strokeWidth={1.25} className="mx-auto text-accent" />
        <h3 className="display display-md mt-6 text-foreground">Thank you</h3>
        <p className="mt-3 text-ink-dim">
          We&apos;ve received your inquiry and will be in touch within 24 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border border-line bg-surface-2 p-8 md:p-12">
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-between">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                i <= step
                  ? "bg-accent text-surface-0"
                  : "bg-surface-3 text-ink-dim",
              )}
            >
              {i + 1}
            </div>
            <span
              className={cn(
                "hidden text-sm md:inline",
                i <= step ? "text-foreground" : "text-muted",
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 && (
            <div className="space-y-6">
              <Field label="Project Type" error={errors.projectType?.message}>
                <select
                  {...register("projectType")}
                  className="field"
                >
                  <option value="">Select project type</option>
                  {Object.entries(projectTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Budget Range" error={errors.budgetRange?.message}>
                <select
                  {...register("budgetRange")}
                  className="field"
                >
                  <option value="">Select budget range</option>
                  {Object.entries(budgetLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Project Timeline" error={errors.timeline?.message}>
                <input
                  {...register("timeline")}
                  placeholder="e.g. Q3 2025, 6-week turnaround"
                  className="field"
                />
              </Field>

              <Field label="Project Brief" error={errors.description?.message}>
                <textarea
                  {...register("description")}
                  rows={5}
                  placeholder="Tell us about your project, goals, and vision..."
                  className="field resize-none"
                />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <Field label="Company Name" error={errors.companyName?.message}>
                <input
                  {...register("companyName")}
                  placeholder="Your company or organization"
                  className="field"
                />
              </Field>

              <Field label="Full Name" error={errors.fullName?.message}>
                <input
                  {...register("fullName")}
                  placeholder="Your full name"
                  className="field"
                />
              </Field>

              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Email" error={errors.email?.message}>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@company.com"
                    className="field"
                  />
                </Field>

                <Field label="Phone" error={errors.phone?.message}>
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="field"
                  />
                </Field>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 text-sm">
              <ReviewRow label="Project Type" value={projectTypeLabels[values.projectType]} />
              <ReviewRow label="Budget" value={budgetLabels[values.budgetRange]} />
              <ReviewRow label="Timeline" value={values.timeline} />
              <ReviewRow label="Brief" value={values.description} />
              <hr className="my-6 border-line" />
              <ReviewRow label="Company" value={values.companyName} />
              <ReviewRow label="Name" value={values.fullName} />
              <ReviewRow label="Email" value={values.email} />
              <ReviewRow label="Phone" value={values.phone} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {submitError && (
        <p className="mt-4 text-sm text-red-400">{submitError}</p>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={prevStep}>
            <ArrowLeft size={16} />
            Back
          </Button>
        ) : (
          <div />
        )}

        {step < STEPS.length - 1 ? (
          <Button type="button" variant="primary" onClick={nextStep}>
            Continue
            <ArrowRight size={16} />
          </Button>
        ) : (
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Inquiry"
            )}
          </Button>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink-dim">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-ink-dim">{label}</span>
      <span className="text-right text-foreground">{value || "—"}</span>
    </div>
  );
}
