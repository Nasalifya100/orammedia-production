"use client";

import { cn } from "@/lib/utils";
import { useRef, useEffect, useState } from "react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  lazy?: boolean;
  priority?: boolean;
}

/** High-quality video player with lazy loading and poster fallback */
export function VideoPlayer({
  src,
  poster,
  className,
  autoPlay = false,
  muted = true,
  loop = true,
  playsInline = true,
  lazy = false,
  priority = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(!lazy || priority);

  useEffect(() => {
    if (!lazy || priority) return;

    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [lazy, priority]);

  useEffect(() => {
    if (shouldLoad && autoPlay && videoRef.current) {
      videoRef.current.play().catch(() => {
        /* Autoplay blocked — poster remains visible */
      });
    }
  }, [shouldLoad, autoPlay]);

  return (
    <video
      ref={videoRef}
      className={cn("h-full w-full object-cover", className)}
      poster={poster}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      autoPlay={shouldLoad && autoPlay}
      preload={priority ? "auto" : "metadata"}
      {...(shouldLoad ? { src } : {})}
    />
  );
}
