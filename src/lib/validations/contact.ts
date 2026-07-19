import { z } from "zod";

export const contactFormSchema = z.object({
  projectType: z.enum([
    "commercial",
    "narrative",
    "music-video",
    "corporate",
    "other",
  ], { message: "Please select a project type" }),
  budgetRange: z.enum([
    "under-50k",
    "50k-100k",
    "100k-250k",
    "250k-500k",
    "500k-plus",
  ], { message: "Please select a budget range" }),
  timeline: z
    .string()
    .min(1, "Timeline is required")
    .max(200, "Timeline must be under 200 characters"),
  description: z
    .string()
    .min(20, "Please provide at least 20 characters describing your project")
    .max(2000, "Description must be under 2000 characters"),
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name must be under 100 characters"),
  fullName: z
    .string()
    .min(2, "Full name is required")
    .max(100, "Name must be under 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .max(20, "Phone number is too long"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const budgetLabels: Record<ContactFormValues["budgetRange"], string> = {
  "under-50k": "Under $50,000",
  "50k-100k": "$50,000 – $100,000",
  "100k-250k": "$100,000 – $250,000",
  "250k-500k": "$250,000 – $500,000",
  "500k-plus": "$500,000+",
};

export const projectTypeLabels: Record<ContactFormValues["projectType"], string> = {
  commercial: "Commercial",
  narrative: "Narrative Film",
  "music-video": "Music Video",
  corporate: "Corporate / Branded",
  other: "Other",
};
