"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import {
  getFacebookVideoEmbedUrl,
  isFacebookVideoUrl,
  isFacebookPostUrl,
} from "@/lib/facebook/oram-media-curated";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";

const MuxPlayer = dynamic(
  () => import("@mux/mux-player-react").then((mod) => mod.default),
  { ssr: false },
);

interface MuxVideoPlayerProps {
  playbackId: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  priority?: boolean;
}

export function MuxVideoPlayer({
  playbackId,
  poster,
  className,
  autoPlay = false,
  muted = true,
  loop = true,
  controls = false,
  priority = false,
}: MuxVideoPlayerProps) {
  return (
    <MuxPlayer
      playbackId={playbackId}
      streamType="on-demand"
      autoPlay={autoPlay ? "muted" : false}
      muted={muted}
      loop={loop}
      poster={poster}
      preload={priority ? "auto" : "metadata"}
      thumbnailTime={0}
      style={{
        "--controls": controls ? "" : "none",
        "--media-object-fit": "cover",
        height: "100%",
        width: "100%",
      }}
      className={cn("mux-player-cover", className)}
    />
  );
}

interface FacebookVideoEmbedProps {
  facebookUrl: string;
  className?: string;
  poster?: string;
}

/** Facebook post with link to watch (non-embeddable post URLs) */
function FacebookPostLink({
  facebookUrl,
  poster,
  className,
}: FacebookVideoEmbedProps & { facebookUrl: string }) {
  return (
    <a
      href={facebookUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative flex h-full w-full items-center justify-center overflow-hidden bg-charcoal",
        className,
      )}
    >
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-charcoal/40 transition-colors group-hover:bg-charcoal/25" />
      <span className="relative z-10 rounded-full glass px-6 py-3 text-sm uppercase tracking-wider text-foreground">
        Watch on Facebook
      </span>
    </a>
  );
}
/** Embed Facebook videos from @oramtv and Oram Media Dynamics pages */
function FacebookVideoEmbed({
  facebookUrl,
  className,
  poster,
}: FacebookVideoEmbedProps) {
  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-charcoal", className)}>
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          aria-hidden
        />
      )}
      <iframe
        src={getFacebookVideoEmbedUrl(facebookUrl)}
        className="absolute inset-0 h-full w-full border-0"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
        title="Oram Media video"
      />
    </div>
  );
}

interface MediaPlayerProps {
  muxPlaybackId?: string;
  youtubeId?: string;
  src?: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  lazy?: boolean;
  priority?: boolean;
  controls?: boolean;
}

/** Unified player — Mux → Facebook embed → HTML5 fallback */
export function MediaPlayer({
  muxPlaybackId,
  youtubeId,
  src,
  poster,
  className,
  autoPlay = false,
  muted = true,
  loop = true,
  playsInline = true,
  lazy = false,
  priority = false,
  controls = false,
}: MediaPlayerProps) {
  if (youtubeId) {
    return (
      <YouTubeEmbed
        videoId={youtubeId}
        title="Project trailer"
        controls={controls}
        autoPlay={autoPlay}
        preview={autoPlay && !controls}
        className={className}
      />
    );
  }

  if (muxPlaybackId) {
    return (
      <MuxVideoPlayer
        playbackId={muxPlaybackId}
        poster={poster}
        className={className}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        priority={priority}
      />
    );
  }

  if (src && isFacebookVideoUrl(src)) {
    return (
      <FacebookVideoEmbed
        facebookUrl={src}
        poster={poster}
        className={className}
      />
    );
  }

  if (src && isFacebookPostUrl(src)) {
    return (
      <FacebookPostLink
        facebookUrl={src}
        poster={poster}
        className={className}
      />
    );
  }

  if (!src) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-charcoal-light",
          className,
        )}
      >
        {poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt="" aria-hidden className="h-full w-full object-cover" />
        )}
      </div>
    );
  }

  return (
    <VideoPlayer
      src={src}
      poster={poster}
      className={className}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      lazy={lazy}
      priority={priority}
    />
  );
}
