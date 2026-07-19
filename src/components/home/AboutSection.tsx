import Link from "next/link";
import Image from "next/image";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

/** About block — stainedglass.tv “Storytelling is in our DNA” section */
export function AboutSection() {
  return (
    <section id="about" className="section-sg bg-black">
      <div className="sg-container">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <AnimatedSection>
            <p className="text-eyebrow mb-4">About us</p>
            <h2 className="sg-dual-heading">
              <span className="highlight">Storytelling</span>{" "}
              <span className="base">is in our DNA</span>
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.12}>
            <p className="text-sm leading-[1.9] text-muted md:text-base">
              Step into the world of Oram Media Dynamics, where storytelling comes
              to life. Led by multi-award-winning director{" "}
              <strong className="font-medium text-foreground">Owas Ray Mwape</strong>,
              we craft captivating content for broadcast and digital audiences
              across Zambia and Southern Africa.
            </p>
            <p className="mt-5 text-sm leading-[1.9] text-muted md:text-base">
              From acclaimed dramas on Zambezi Magic and Showmax to feature films
              and government campaigns, our partnerships span DStv, MultiChoice,
              and ministries across the region. Behind each frame lies a dedicated
              family of creators pushing limits and etching narratives that
              resonate.
            </p>
            <Link href="/about" className="btn-sg-ghost mt-8 inline-block">
              Read More →
            </Link>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.2} className="relative mt-16 md:mt-20">
          <div className="relative aspect-[21/9] overflow-hidden vignette-strong">
            <Image
              src="/about/mwape-multichoice-awards.jpg"
              alt="Oram Media Dynamics at MultiChoice Zambia Film and Television Awards"
              fill
              className="img-premium object-cover"
              sizes="(max-width: 1440px) 100vw, 1440px"
            />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
