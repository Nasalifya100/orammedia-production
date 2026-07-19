"use client";

import { useState } from "react";

const DEVICES = [
  { id: "desktop", label: "Desktop", width: "100%", height: "70vh" },
  { id: "laptop", label: "Laptop", width: "1024px", height: "640px" },
  { id: "tablet", label: "Tablet", width: "768px", height: "1024px" },
  { id: "mobile", label: "Mobile", width: "390px", height: "844px" },
] as const;

export function WizardPreviewStep({
  slug,
  productionId,
}: {
  slug: string;
  productionId: string;
}) {
  const [device, setDevice] = useState<(typeof DEVICES)[number]["id"]>("desktop");
  const [split, setSplit] = useState(false);
  const cfg = DEVICES.find((d) => d.id === device) ?? DEVICES[0];
  const previewUrl = `/preview/projects/${slug}?_rev=${productionId}`;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h2 className="text-xl tracking-tight">Preview</h2>
        <p className="mt-2 text-sm text-white/50">
          Renders the real production page through the same pipeline — not a mock.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {DEVICES.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setDevice(d.id)}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider ${
              device === d.id
                ? "bg-amber-600 text-black"
                : "border border-white/15 text-white/60"
            }`}
          >
            {d.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setSplit((s) => !s)}
          className={`ml-auto px-3 py-1.5 text-xs uppercase tracking-wider ${
            split ? "bg-white/10 text-white" : "border border-white/15 text-white/60"
          }`}
        >
          Split view
        </button>
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 text-xs uppercase tracking-wider text-amber-400 hover:text-amber-300"
        >
          Open full page ↗
        </a>
      </div>

      {split ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <PreviewFrame url={previewUrl} label="Draft" width="100%" height="60vh" />
          <PreviewFrame
            url={`/projects/${slug}`}
            label="Published (if live)"
            width="100%"
            height="60vh"
          />
        </div>
      ) : (
        <div className="flex justify-center overflow-auto rounded border border-white/10 bg-[#08080a] p-4">
          <PreviewFrame url={previewUrl} width={cfg.width} height={cfg.height} />
        </div>
      )}
    </div>
  );
}

function PreviewFrame({
  url,
  label,
  width,
  height,
}: {
  url: string;
  label?: string;
  width: string;
  height: string;
}) {
  return (
    <div className="mx-auto w-full" style={{ maxWidth: width }}>
      {label ? (
        <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-white/40">{label}</p>
      ) : null}
      <iframe
        title={label ?? "Preview"}
        src={url}
        className="w-full rounded border border-white/10 bg-white"
        style={{ height }}
      />
    </div>
  );
}
