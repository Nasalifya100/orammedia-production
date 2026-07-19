import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the Oram Media team. Explore open positions in production, post-production, and creative.",
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Join Our Team"
        description="We're always looking for talented creatives, producers, and technicians who share our passion for cinematic storytelling."
        minHeight="tall"
        image="/media/bts/inkondo-shoot-s2-b.jpg"
        imageAlt="On set with Oram Media Dynamics during Inkondo Season 2"
      />

      <section className="section-sg bg-black">
        <Container>
          <div className="mx-auto max-w-2xl card-editorial p-12 text-center">
            <p className="text-sm leading-relaxed text-muted md:text-base">
              No open positions at the moment, but we&apos;d love to hear from you.
              Send your reel and resume to{" "}
              <a
                href="mailto:careers@orammedia.com"
                className="text-[var(--sg-gold)] hover:underline"
              >
                careers@orammedia.com
              </a>
            </p>
            <Link href="/contact" className="btn-sg-accent mt-8 inline-flex">
              Get in Touch
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
