"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { siteConfig } from "@/lib/data";

const navLinks = [
  { href: "/projects", label: "Work" },
  { href: "/about", label: "Studio" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function Header() {
  const pathname = usePathname();
  const { isScrolled } = useScrollPosition();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";
  const solid = isScrolled || !isHome;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <ScrollProgress />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          solid
            ? "glass-strong py-3.5"
            : "bg-gradient-to-b from-black/60 to-transparent py-5 md:py-7",
        )}
      >
        <div className="container-edge flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label={`${siteConfig.name} home`}
          >
            <BrandLogo size="sm" priority className="group-hover:ring-accent/50" />
            <span className="hidden text-[15px] font-medium tracking-tight text-foreground sm:block">
              Oram Media <span className="text-ink-dim">Dynamics</span>
            </span>
          </Link>

          <nav
            className="hidden items-center gap-9 lg:flex"
            aria-label="Primary"
          >
            {navLinks.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "link-line text-sm tracking-tight transition-colors",
                    active ? "text-foreground" : "text-ink-dim hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <MagneticButton>
              <Link href="/contact" className="btn btn-primary">
                Start a Project
              </Link>
            </MagneticButton>
          </nav>

          <button
            type="button"
            className="flex items-center gap-2 text-sm text-foreground lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <span className="hidden sm:inline text-ink-dim">Menu</span>
            <span className="flex flex-col gap-[5px]">
              <span className="block h-px w-6 bg-current" />
              <span className="block h-px w-6 bg-current" />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] flex flex-col bg-surface-0/98 backdrop-blur-xl"
          >
            <div className="container-edge flex items-center justify-between py-5">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3"
              >
                <BrandLogo size="sm" />
                <span className="text-[15px] font-medium tracking-tight">
                  Oram Media <span className="text-ink-dim">Dynamics</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-sm uppercase tracking-[0.2em] text-ink-dim hover:text-foreground"
              >
                Close
              </button>
            </div>

            <nav className="container-edge flex flex-1 flex-col justify-center gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.6, ease: EASE }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="display block py-2 text-[15vw] leading-[1.05] text-foreground transition-colors hover:text-accent sm:text-[12vw] md:text-[8rem]"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="container-edge flex flex-col gap-2 py-8 text-sm text-ink-dim sm:flex-row sm:items-center sm:justify-between">
              <a href={`mailto:${siteConfig.email}`} className="link-line">
                {siteConfig.email}
              </a>
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="link-line">
                {siteConfig.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
