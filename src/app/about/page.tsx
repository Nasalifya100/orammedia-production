import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ParallaxMedia } from "@/components/motion/ParallaxMedia";
import { PartnersMarquee } from "@/components/home/PartnersMarquee";
import { getTeamMembers, getAwards, getClientLogos } from "@/lib/data";
import { studioImages, studioImageAlts } from "@/lib/data/mock-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About — Film Production Studio Lusaka",
  description:
    "Oram Media Dynamics is a Lusaka film and television studio led by Owas Ray Mwape — drama series, features and institutional films for Zambezi Magic, Showmax and Zambian clients.",
};

export default async function AboutPage() {
  const [teamMembers, awards, clientLogos] = await Promise.all([
    getTeamMembers(),
    getAwards(),
    getClientLogos(),
  ]);

  const sortedAwards = [...awards].sort((a, b) => b.year - a.year);

  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="A Lusaka studio for Zambian screens."
        description="Oram Media Dynamics is led by director Owas Ray Mwape. We make television drama, features and institutional films from Chainama, Lusaka — work that has reached Zambezi Magic, DStv, GOtv and Showmax."
        minHeight="tall"
        image="/media/team/owas-ray-mwape-ep.jpg"
        imageAlt="Owas Ray Mwape on set — founder and film director, Oram Media Dynamics"
      />

      {/* Mission */}
      <section className="section bg-surface-0">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
            <div>
              <p className="eyebrow mb-8">Our Mission</p>
              <Reveal variant="clip">
                <p className="display display-md text-foreground">
                  Every frame tells a{" "}
                  <span className="display-italic text-accent">Zambian</span>{" "}
                  story.
                </p>
              </Reveal>
              <Reveal variant="up" delay={0.1}>
                <p className="mt-8 max-w-lg leading-relaxed text-ink-dim">
                  Owas Ray Mwape — Best Actor in 1990, 1991 and 1992; founder of
                  Owas Films (2013) — leads the company. His public acting credits
                  include Mwansa the Great, Suwi and Fever; as a director he is
                  credited on Zuba for Zambezi Magic and on features including
                  Graft and Look in the Mirror.
                </p>
                <p className="mt-4 max-w-lg leading-relaxed text-ink-dim">
                  Recent television includes creative leadership on Inkondo
                  (Zambezi Magic / Showmax, premiered May 2025). Institutional
                  work includes coverage for the Ministry of Youth, Sport and
                  Arts and related programmes documented on Oram TV.
                </p>
              </Reveal>
            </div>
            <Reveal variant="scale">
              <ParallaxMedia className="relative aspect-[4/3] overflow-hidden bg-surface-2" strength={8}>
                <Image
                  src="/media/awards/zikomo-owas-2025.jpg"
                  alt="Owas Ray Mwape at the Zikomo Awards"
                  fill
                  quality={90}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </ParallaxMedia>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="section border-t border-line bg-surface">
        <Container>
          <div className="mb-16 max-w-2xl">
            <p className="eyebrow mb-5">The Team</p>
            <SplitHeading
              as="h2"
              text="Meet the creators"
              className="display display-lg text-foreground"
            />
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <Reveal key={member.id} variant="up" delay={index * 0.08}>
                <article className="group">
                  <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <h3 className="display display-sm mt-6 text-foreground">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm uppercase tracking-[0.16em] text-ink-faint">
                    {member.role}
                  </p>
                  <p className="mt-4 leading-relaxed text-ink-dim">
                    {member.bio}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* On set */}
      <section className="section border-t border-line bg-surface-0">
        <Container>
          <div className="mb-16 max-w-2xl">
            <p className="eyebrow mb-5">On Set</p>
            <SplitHeading
              as="h2"
              text="Where ideas become film"
              className="display display-lg text-foreground"
            />
          </div>
          <div className="grid gap-5 md:grid-cols-3 md:gap-6">
            {studioImages.map((image, i) => (
              <Reveal key={image} variant="clip" delay={(i % 3) * 0.08}>
                <div className="group relative aspect-[4/3] overflow-hidden bg-surface-2">
                  <Image
                    src={image}
                    alt={studioImageAlts[i] ?? `Production still ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <PartnersMarquee logos={clientLogos} />

      {/* Awards */}
      {sortedAwards.length > 0 && (
        <section className="section border-t border-line bg-surface">
          <Container>
            <div className="grid gap-12 md:grid-cols-[0.6fr_1.4fr] md:gap-20">
              <div>
                <p className="eyebrow mb-5">Recognition</p>
                <SplitHeading
                  as="h2"
                  text="Awards & honours"
                  className="display display-lg text-foreground"
                />
              </div>
              <div className="border-t border-line">
                {sortedAwards.map((award, i) => (
                  <Reveal key={award.id} variant="up" delay={i * 0.04}>
                    <div className="grid grid-cols-[auto_1fr] items-baseline gap-6 border-b border-line py-6 md:grid-cols-[100px_1fr_auto] md:gap-10">
                      <span className="numeral text-ink-faint">{award.year}</span>
                      <span className="display display-sm text-foreground">
                        {award.name}
                      </span>
                      <span className="col-span-2 text-sm uppercase tracking-[0.14em] text-ink-faint md:col-span-1 md:text-right">
                        {award.organization}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
