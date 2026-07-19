import { notFound, redirect } from "next/navigation";
import { HomePageView } from "@/components/pages/HomePageView";
import {
  parsePreviewScope,
  previewPathFromSegments,
} from "@/lib/preview/scope";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function renderPreviewPage(path: string, scope: "draft" | "published") {
  switch (path) {
    case "":
      return <HomePageView scope={scope} />;
    case "projects": {
      const Page = (await import("@/app/projects/page")).default;
      return <Page searchParams={Promise.resolve({})} />;
    }
    case "about": {
      const Page = (await import("@/app/about/page")).default;
      return <Page />;
    }
    case "services": {
      const Page = (await import("@/app/services/page")).default;
      return <Page />;
    }
    case "contact": {
      const Page = (await import("@/app/contact/page")).default;
      return <Page />;
    }
    default:
      return null;
  }
}

export default async function PreviewCatchAllPage({
  params,
  searchParams,
}: {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<{ scope?: string; _rev?: string }>;
}) {
  const [{ path: segments }, sp] = await Promise.all([params, searchParams]);
  const routePath = previewPathFromSegments(segments);

  if (routePath === "homepage") {
    redirect(`/preview?scope=${sp.scope === "published" ? "published" : "draft"}`);
  }

  const scope = parsePreviewScope(sp.scope);
  const view = await renderPreviewPage(routePath, scope);
  if (!view) notFound();

  return view;
}
