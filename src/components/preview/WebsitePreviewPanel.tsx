"use client";

import { DynamicHomepage } from "@/components/home/DynamicHomepage";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  resolveFeaturedProjects,
  resolveShowreelFromConfig,
} from "@/lib/preview/resolve-client";
import type { WebsitePreviewPayload, PreviewDevice } from "@/lib/preview/types";
import { PREVIEW_DEVICE_WIDTHS } from "@/lib/preview/types";
import type { WebsiteConfiguration } from "@/pams/types/website-config";

export type { WebsitePreviewPayload, PreviewDevice } from "@/lib/preview/types";
export { PREVIEW_DEVICE_WIDTHS } from "@/lib/preview/types";

interface WebsitePreviewPanelProps {
  config: WebsiteConfiguration;
  payload: WebsitePreviewPayload;
  device?: PreviewDevice;
  label?: string;
  highlight?: boolean;
  changedSections?: string[];
}

/**
 * Inline live preview — same component tree as production.
 * Data comes from builder state (draft) or published config; no iframe, no second renderer.
 */
export function WebsitePreviewPanel({
  config,
  payload,
  device = "desktop",
  label,
  highlight,
  changedSections = [],
}: WebsitePreviewPanelProps) {
  const featuredProjects = resolveFeaturedProjects(
    payload.projects,
    config.featuredSlots,
  );
  const showreel = resolveShowreelFromConfig(config, payload.showreelFallback);

  const width = PREVIEW_DEVICE_WIDTHS[device];

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
            {label}
          </span>
          {changedSections.length > 0 ? (
            <span className="text-[10px] text-amber-300">
              Changed: {changedSections.join(", ")}
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        className={`overflow-hidden rounded border bg-background ${
          highlight ? "border-amber-500/40 ring-1 ring-amber-500/20" : "border-white/10"
        }`}
      >
        <div
          className="mx-auto max-h-[640px] overflow-y-auto overflow-x-hidden"
          style={{ width, maxWidth: "100%" }}
        >
          <SmoothScroll>
            <Header />
            <main>
              <DynamicHomepage
                config={config}
                showreel={showreel}
                projects={featuredProjects}
                services={payload.services}
                teamMembers={payload.teamMembers}
                clientLogos={payload.clientLogos}
                news={payload.news}
                awards={payload.awards}
              />
            </main>
            <Footer />
          </SmoothScroll>
        </div>
      </div>
    </div>
  );
}
