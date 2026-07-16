"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { MuxVideoPlayer } from "@/components/ui/MediaPlayer";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { MagneticButton } from "@/components/motion/MagneticButton";
import type { ShowreelConfig } from "@/types";

interface HeroShowreelProps {
  showreel: ShowreelConfig;
}

const HERO_STILL = "/projects/look-in-the-mirror.png";
const EASE = [0.22, 1, 0.36, 1] as const;

/** Full-viewport cinematic hero — one confident statement. */
export function HeroShowreel({ showreel }: HeroShowreelProps) {
  const reduced = useReducedMotion();

  return (
    <section className="relative flex h-[100svh] min-h-[640px] w-full flex-col justify-end overflow-hidden bg-surface-0">
      <ParallaxMedia className="absolute inset-0" strength={reduced ? 0 : 10}>
        {showreel.muxPlaybackId ? (
          <MuxVideoPlayer
            playbackId={showreel.muxPlaybackId}
            poster={showreel.posterUrl}
            autoPlay
            muted
            loop
            priority
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={HERO_STILL}
            alt="Oram Media Dynamics cinematic production still"
            fill
            priority
            quality={92}
            sizes="100vw"
            className="object-cover"
          />
        )}
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
          Film &amp; television production · Lusaka, Zambia
        </motion.p>

        <SplitHeading
          as="h1"
          text="Zambian stories, shot for the screen."
          className="display display-xl max-w-[18ch] text-foreground"
          stagger={0.07}
        />

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: EASE }}
          className="mt-8 flex max-w-xl flex-col gap-8"
        >
          <p className="lede">
            Oram Media Dynamics makes drama series, features and branded films
            from Lusaka — work that has aired on Zambezi Magic, DStv, GOtv and
            Showmax.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <MagneticButton>
              <Link href="/projects" className="btn btn-primary">
                View Our Work
                <ArrowUpRight size={15} strokeWidth={1.5} />
              </Link>
            </MagneticButton>
            <Link href="/contact" className="btn-ghost link-line">
              Start a project
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
