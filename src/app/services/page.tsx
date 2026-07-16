import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { getServices } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Services — TV & Film Production Zambia",
  description:
    "Pre-production, production and post for film and television in Lusaka — drama series, features and institutional video for Zambia and the region.",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Full-spectrum production."
        description="From concept to final grade — end-to-end production tailored to broadcast, film and branded content."
        minHeight="tall"
        image="/projects/look-in-the-mirror.jpg"
        imageAlt="Cinematic still from Look in the Mirror, directed by Owas Ray Mwape"
      />

      <section className="section bg-surface-0">
        <Container>
          <div className="flex flex-col">
            {services.map((service, index) => (
              <Reveal key={service.id} variant="up">
                <Link
                  href={`/services/${service.slug}`}
                  className="group grid gap-8 border-t border-line py-14 transition-colors last:border-b hover:bg-ink/[0.02] md:grid-cols-12 md:gap-10 md:py-20"
                >
                  <div className="flex items-start gap-6 md:col-span-5">
                    <span className="numeral pt-3 text-sm text-ink-faint">
                      0{index + 1}
                    </span>
                    <h2 className="display display-md text-foreground transition-colors group-hover:text-accent">
                      {service.title}
                    </h2>
                  </div>
                  <div className="md:col-span-6">
                    <p className="max-w-xl leading-relaxed text-ink-dim">
                      {service.description}
                    </p>
                    <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                      {service.features.slice(0, 4).map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm text-ink-dim"
                        >
                          <span className="h-1 w-1 rounded-full bg-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-start justify-end md:col-span-1">
                    <ArrowUpRight
                      size={24}
                      strokeWidth={1.25}
                      className="-translate-x-2 text-ink-faint opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:text-accent group-hover:opacity-100"
                    />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
