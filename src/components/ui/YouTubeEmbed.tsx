"use client";

import { cn } from "@/lib/utils";

interface YouTubeEmbedProps {
  videoId: string;
  className?: string;
  /** Muted autoplay loop — for hover previews */
  preview?: boolean;
  /** Show player controls */
  controls?: boolean;
  /** Start playback automatically */
  autoPlay?: boolean;
  title?: string;
}

export function getYouTubeEmbedUrl(
  videoId: string,
  options?: { preview?: boolean; controls?: boolean; autoPlay?: boolean },
) {
  const params = new URLSearchParams({
    autoplay: options?.autoPlay || options?.preview ? "1" : "0",
    mute: options?.preview ? "1" : "0",
    controls: options?.controls ? "1" : "0",
    modestbranding: "1",
    rel: "0",
    playsinline: "1",
    enablejsapi: "1",
  });

  if (options?.preview) {
    params.set("loop", "1");
    params.set("playlist", videoId);
  }

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export function getYouTubeThumbnail(videoId: string, quality: "max" | "hq" = "max") {
  return quality === "max"
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function YouTubeEmbed({
  videoId,
  className,
  preview = false,
  controls = true,
  autoPlay = false,
  title = "Video",
}: YouTubeEmbedProps) {
  return (
    <iframe
      src={getYouTubeEmbedUrl(videoId, { preview, controls, autoPlay })}
      title={title}
      className={cn("h-full w-full border-0", className)}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );
}
