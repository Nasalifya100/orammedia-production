import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import type { NewsPost } from "@/lib/data";

interface NewsSectionProps {
  posts: NewsPost[];
}

/** Journal teaser — latest dispatches as an editorial list. */
export function NewsSection({ posts }: NewsSectionProps) {
  const latest = posts.slice(0, 3);
  if (latest.length === 0) return null;

  return (
    <section className="section border-t border-line bg-surface-0">
      <Container>
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-5">Journal</p>
            <SplitHeading
              as="h2"
              text="Latest from the studio"
              className="display display-lg text-foreground"
            />
          </div>
          <Link
            href="/blog"
            className="btn-ghost link-line inline-flex items-center gap-2 text-foreground"
          >
            All dispatches
            <ArrowUpRight size={15} strokeWidth={1.5} />
          </Link>
        </div>

        <div className="border-t border-line">
          {latest.map((post, i) => (
            <Reveal key={post.id} variant="up" delay={i * 0.06}>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid gap-4 border-b border-line py-8 transition-colors hover:bg-ink/[0.02] md:grid-cols-[180px_1fr_auto] md:items-baseline md:gap-10 md:py-10"
              >
                <time className="text-sm uppercase tracking-[0.14em] text-ink-faint">
                  {new Date(post.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
                <h3 className="display display-sm text-foreground transition-colors group-hover:text-accent">
                  {post.title}
                </h3>
                <ArrowUpRight
                  size={20}
                  strokeWidth={1.25}
                  className="hidden shrink-0 text-ink-faint transition-colors group-hover:text-accent md:block"
                />
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
