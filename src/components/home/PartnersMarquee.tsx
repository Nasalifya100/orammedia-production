import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Marquee } from "@/components/motion/Marquee";
import type { ClientLogo } from "@/types";

interface PartnersMarqueeProps {
  logos: ClientLogo[];
}

/** Continuous partner logo marquee. */
export function PartnersMarquee({ logos }: PartnersMarqueeProps) {
  return (
    <section className="section border-t border-line bg-surface-0">
      <Container>
        <p className="eyebrow mb-14 text-center">
          Trusted by broadcasters, streamers &amp; brands
        </p>
      </Container>

      <Marquee speed={45} className="[mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        {logos.map((client) => (
          <div
            key={client.id}
            className="relative mx-10 h-10 w-[150px] shrink-0 md:mx-14"
          >
            <Image
              src={client.logoSrc}
              alt={client.name}
              fill
              sizes="150px"
              className={
                client.monochrome
                  ? "object-contain opacity-45 brightness-0 invert transition-opacity duration-500 hover:opacity-90"
                  : "object-contain opacity-60 transition-opacity duration-500 hover:opacity-100"
              }
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
