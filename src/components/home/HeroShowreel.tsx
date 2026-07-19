"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import dynamic from "next/dynamic";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { MagneticButton } from "@/components/motion/MagneticButton";
import type { ShowreelConfig } from "@/types";
import type { HomepageCta } from "@/pams/types/website-config";

const MuxVideoPlayer = dynamic(
  () =>
    import("@/components/ui/MediaPlayer").then((mod) => mod.MuxVideoPlayer),
  { ssr: false },
);

interface HeroShowreelProps {
  showreel: ShowreelConfig;
  headline?: string;
  subheadline?: string;
  eyebrow?: string;
  ctaPrimary?: HomepageCta;
  ctaSecondary?: HomepageCta;
  heroAlt?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;
const FALLBACK_KEY_ART = "/projects/inkondo-billboard.jpg";

/** Full-viewport cinematic hero — flagship key art from ORAM OS. */
export function HeroShowreel({
  showreel,
  headline = "Zambian stories, shot for the screen.",
  subheadline = "Oram Media Dynamics makes drama series, features and branded films from Lusaka — work that has aired on Zambezi Magic, DStv, GOtv and Showmax.",
  eyebrow = "Film & television production · Lusaka, Zambia",
  ctaPrimary = { label: "View Our Work", href: "/projects" },
  ctaSecondary = { label: "Start a project", href: "/contact" },
  heroAlt = "Oram Media Dynamics",
}: HeroShowreelProps) {
  const reduced = useReducedMotion();
  const heroStill = showreel.posterUrl || FALLBACK_KEY_ART;
  const [mountVideo, setMountVideo] = useState(false);

  useEffect(() => {
    if (reduced || !showreel.muxPlaybackId) return;

    const enable = () => setMountVideo(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(enable, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(enable, 1500);
    return () => window.clearTimeout(t);
  }, [reduced, showreel.muxPlaybackId]);

  return (
    <section className="relative flex h-[100svh] min-h-[640px] w-full flex-col justify-end overflow-hidden bg-surface-0">
      <ParallaxMedia className="absolute inset-0" strength={reduced ? 0 : 10}>
        <Image
          src={heroStill}
          alt={heroAlt}
          fill
          priority
          quality={92}
          sizes="100vw"
          className="object-cover"
        />
        {mountVideo && showreel.muxPlaybackId ? (
          <div className="absolute inset-0">
            <MuxVideoPlayer
              playbackId={showreel.muxPlaybackId}
              autoPlay
              muted
              loop
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}
      </ParallaxMedia>

      {/* Grading — one confident bottom-up wash + soft cinematic vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface-0 via-surface-0/55 via-35% to-transparent" />
      <div className="vignette absolute inset-0 opacity-70" />

      <div className="container-edge relative z-10 pb-16 md:pb-24">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="eyebrow eyebrow-accent mb-6"
        >
          {eyebrow}
        </motion.p>

        <SplitHeading
          as="h1"
          text={headline}
          className="display display-xl max-w-[18ch] text-foreground"
          stagger={0.07}
        />

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: EASE }}
          className="mt-8 flex max-w-xl flex-col gap-8"
        >
          <p className="lede">{subheadline}</p>
          <div className="flex flex-wrap items-center gap-4">
            <MagneticButton>
              <Link href={ctaPrimary.href} className="btn btn-primary">
                {ctaPrimary.label}
                <ArrowUpRight size={15} strokeWidth={1.5} />
              </Link>
            </MagneticButton>
            <Link href={ctaSecondary.href} className="btn-ghost link-line">
              {ctaSecondary.label}
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="pointer-events-none absolute bottom-8 right-[var(--gutter)] z-10 hidden items-center gap-3 text-ink-faint md:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          animate={reduced ? undefined : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
        >
          <ArrowDown size={14} strokeWidth={1.5} />
        </motion.span>
      </motion.div>
    </section>
  );
}
