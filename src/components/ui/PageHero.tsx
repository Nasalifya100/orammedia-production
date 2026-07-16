import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  minHeight?: "default" | "tall";
  image?: string;
  imageAlt?: string;
}

export function PageHero({
  eyebrow,
  title,
  description,
  className,
  minHeight = "default",
  image,
  imageAlt = "",
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative flex items-end overflow-hidden bg-surface-0 pt-40 pb-16 md:pb-24",
        minHeight === "tall" ? "min-h-[78vh]" : "min-h-[60vh]",
        className,
      )}
    >
      {image ? (
        <>
          <ParallaxMedia className="absolute inset-0" strength={10}>
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover opacity-45"
            />
          </ParallaxMedia>
          <div className="absolute inset-0 bg-gradient-to-t from-surface-0 via-surface-0/60 to-surface-0/40" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-surface to-surface-0" />
      )}
      <div className="vignette absolute inset-0" />

      <Container className="relative z-10">
        <p className="eyebrow eyebrow-accent mb-6">{eyebrow}</p>
        <SplitHeading
          as="h1"
          text={title}
          className="display display-xl max-w-[16ch] text-foreground"
        />
        {description && (
          <Reveal variant="up" delay={0.2}>
            <p className="lede mt-8 max-w-2xl">{description}</p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
