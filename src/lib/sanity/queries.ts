/** GROQ queries for Sanity CMS */

const projectFields = `{
  "id": _id,
  title,
  "slug": slug.current,
  category,
  description,
  "fullDescription": coalesce(pt::text(fullDescription), fullDescriptionPlain, description),
  clientName,
  year,
  duration,
  "thumbnail": coalesce(thumbnail.asset->url, ""),
  "gallery": gallery[].asset->url,
  videoUrl,
  muxPlaybackId,
  "posterUrl": coalesce(poster.asset->url, ""),
  behindTheScenes,
  featured,
  order
}`;

export const projectsQuery = `*[_type == "project"] | order(order asc) ${projectFields}`;

export const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0] ${projectFields}`;

export const featuredProjectsQuery = `*[_type == "project" && featured == true] | order(order asc)[0...4] {
  "id": _id,
  title,
  "slug": slug.current,
  category,
  description,
  clientName,
  year,
  duration,
  "thumbnail": coalesce(thumbnail.asset->url, ""),
  featured,
  order
}`;

export const servicesQuery = `*[_type == "service"] | order(_createdAt asc) {
  "id": _id,
  title,
  "slug": slug.current,
  icon,
  description,
  features,
  differentiators,
  "relatedProjectSlugs": relatedProjects[]->slug.current
}`;

export const serviceBySlugQuery = `*[_type == "service" && slug.current == $slug][0] {
  "id": _id,
  title,
  "slug": slug.current,
  icon,
  description,
  features,
  differentiators,
  "relatedProjectSlugs": relatedProjects[]->slug.current
}`;

export const testimonialsQuery = `*[_type == "testimonial"] {
  "id": _id,
  clientName,
  company,
  quote,
  "photo": coalesce(photo.asset->url, ""),
  "relatedService": relatedService->slug.current
}`;

export const teamQuery = `*[_type == "teamMember"] {
  "id": _id,
  name,
  role,
  bio,
  "photo": coalesce(photo.asset->url, ""),
  social
}`;

export const awardsQuery = `*[_type == "award"] | order(year desc) {
  "id": _id,
  name,
  year,
  organization,
  "logo": logo.asset->url
}`;

export const clientLogosQuery = `*[_type == "clientLogo"] | order(order asc) {
  "id": _id,
  name,
  "logo": coalesce(logoText, name),
  "logoSrc": logoImage.asset->url,
  url
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  showreelMuxPlaybackId,
  showreelVideoUrl,
  "showreelPosterUrl": showreelPoster.asset->url,
  tagline,
  description
}`;

export const projectSlugsQuery = `*[_type == "project"]{ "slug": slug.current }`;

export const serviceSlugsQuery = `*[_type == "service"]{ "slug": slug.current }`;
