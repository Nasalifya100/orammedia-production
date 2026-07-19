import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { siteConfig } from "@/lib/data/mock-data";

const columns = [
  {
    heading: "Explore",
    links: [
      { href: "/projects", label: "Work" },
      { href: "/about", label: "Studio" },
      { href: "/services", label: "Services" },
      { href: "/blog", label: "Journal" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { href: "/contact", label: "Start a Project" },
      { href: `mailto:${siteConfig.email}`, label: "Email", external: true },
      { href: `tel:${siteConfig.phone.replace(/\s/g, "")}`, label: "Call", external: true },
    ],
  },
];

const socialOrder: { key: string; label: string }[] = [
  { key: "instagram", label: "Instagram" },
  { key: "youtube", label: "YouTube" },
  { key: "facebook", label: "Facebook" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "twitter", label: "X" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const social = siteConfig.social as Record<string, string>;

  return (
    <footer className="relative border-t border-line bg-surface-0">
      <Container className="py-20 md:py-28">
        {/* CTA line */}
        <div className="max-w-5xl">
          <p className="eyebrow mb-6">Let&apos;s make something cinematic</p>
          <Link href="/contact" className="group inline-block">
            <SplitHeading
              as="h2"
              text="Tell us your story."
              className="display display-lg text-foreground transition-colors group-hover:text-accent"
            />
          </Link>
          <MagneticButton className="mt-10">
            <Link href="/contact" className="btn btn-line">
              Start a Project
              <ArrowUpRight size={15} strokeWidth={1.5} />
            </Link>
          </MagneticButton>
        </div>

        {/* Columns */}
        <div className="mt-20 grid gap-12 border-t border-line pt-14 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <BrandLogo size="sm" />
              <span className="text-sm font-medium tracking-tight">
                Oram Media Dynamics
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-dim">
              {siteConfig.description}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="eyebrow mb-5">{col.heading}</h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="link-line text-sm text-ink-dim hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="eyebrow mb-5">Social</h3>
            <ul className="space-y-3">
              {socialOrder
                .filter((s) => social[s.key])
                .map((s) => (
                  <li key={s.key}>
                    <a
                      href={social[s.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-line inline-flex items-center gap-1 text-sm text-ink-dim hover:text-foreground"
                    >
                      {s.label}
                      <ArrowUpRight size={13} strokeWidth={1.5} />
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-8 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <address className="not-italic">
            {siteConfig.address.street}, {siteConfig.address.city},{" "}
            {siteConfig.address.country}
          </address>
        </div>
      </Container>
    </footer>
  );
}
