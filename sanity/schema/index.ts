import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Commercial", value: "commercial" },
          { title: "Narrative", value: "narrative" },
          { title: "Music Video", value: "music-video" },
          { title: "Branded", value: "branded" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", title: "Short Description", type: "text", rows: 3 }),
    defineField({
      name: "fullDescription",
      title: "Full Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "fullDescriptionPlain",
      title: "Full Description (Plain Text Fallback)",
      type: "text",
      rows: 6,
      description: "Used if rich text is empty",
    }),
    defineField({ name: "clientName", title: "Client Name", type: "string" }),
    defineField({ name: "year", title: "Year", type: "number" }),
    defineField({ name: "duration", title: "Duration", type: "string" }),
    defineField({ name: "thumbnail", title: "Thumbnail", type: "image", options: { hotspot: true } }),
    defineField({ name: "gallery", title: "Gallery Images", type: "array", of: [{ type: "image" }] }),
    defineField({
      name: "muxPlaybackId",
      title: "Mux Playback ID",
      type: "string",
      description: "Preferred — paste from Mux dashboard for adaptive high-bitrate streaming",
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL (Fallback)",
      type: "url",
      description: "Direct MP4/WebM URL if Mux playback ID is not set",
    }),
    defineField({ name: "poster", title: "Video Poster", type: "image" }),
    defineField({ name: "behindTheScenes", title: "Behind the Scenes", type: "text" }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
    defineField({ name: "order", title: "Display Order", type: "number", initialValue: 0 }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "showreelMuxPlaybackId",
      title: "Showreel Mux Playback ID",
      type: "string",
      description: "Homepage hero showreel — high-bitrate Mux stream",
    }),
    defineField({
      name: "showreelVideoUrl",
      title: "Showreel Video URL (Fallback)",
      type: "url",
    }),
    defineField({
      name: "showreelPoster",
      title: "Showreel Poster Image",
      type: "image",
    }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "description", title: "Site Description", type: "text" }),
  ],
});

export const clientLogo = defineType({
  name: "clientLogo",
  title: "Client Logo",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Client Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "logoText",
      title: "Logo Text",
      type: "string",
      description: "Text displayed in marquee (or upload image below)",
    }),
    defineField({ name: "logoImage", title: "Logo Image", type: "image" }),
    defineField({ name: "url", title: "Partner Website", type: "url" }),
    defineField({ name: "order", title: "Display Order", type: "number", initialValue: 0 }),
  ],
});

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "bio", title: "Bio", type: "text" }),
    defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({
      name: "social",
      title: "Social Links",
      type: "object",
      fields: [
        { name: "linkedin", type: "url", title: "LinkedIn" },
        { name: "instagram", type: "url", title: "Instagram" },
        { name: "twitter", type: "url", title: "Twitter" },
      ],
    }),
  ],
});

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    }),
    defineField({ name: "icon", title: "Icon Name", type: "string", description: "clapperboard | camera | film" }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "features", title: "Features", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "differentiators", title: "Key Differentiators", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "relatedProjects",
      title: "Related Projects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
    }),
  ],
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "clientName", title: "Client Name", type: "string" }),
    defineField({ name: "company", title: "Company", type: "string" }),
    defineField({ name: "quote", title: "Quote", type: "text" }),
    defineField({ name: "photo", title: "Photo", type: "image" }),
    defineField({
      name: "relatedService",
      title: "Related Service",
      type: "reference",
      to: [{ type: "service" }],
    }),
  ],
});

export const award = defineType({
  name: "award",
  title: "Award",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Award Name", type: "string" }),
    defineField({ name: "year", title: "Year", type: "number" }),
    defineField({ name: "organization", title: "Organization", type: "string" }),
    defineField({ name: "logo", title: "Logo", type: "image" }),
  ],
});
