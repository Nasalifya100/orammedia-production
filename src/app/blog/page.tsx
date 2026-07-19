import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { getNewsPosts, getFacebookPageInfo } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Latest news, project updates and behind-the-scenes from Oram Media Dynamics.",
};

export default async function BlogPage() {
  const [posts, pageInfo] = await Promise.all([
    getNewsPosts(),
    getFacebookPageInfo(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title="Latest from the studio."
        description={`Dispatches from our productions and Oram TV — followed by ${pageInfo.fanCount?.toLocaleString() ?? "10,000+"} across Zambian film and television.`}
        minHeight="tall"
        image="/media/awards/zikomo-owas-2025.jpg"
        imageAlt="Owas Ray Mwape at the Zikomo Awards"
      />

      <section className="section bg-surface-0">
        <Container>
          <div className="border-t border-line">
            {posts.map((post, i) => (
              <Reveal key={post.id} variant="up" delay={(i % 4) * 0.05}>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid gap-4 border-b border-line py-10 transition-colors hover:bg-ink/[0.02] md:grid-cols-[160px_1fr_auto] md:items-baseline md:gap-10"
                >
                  <time className="text-sm uppercase tracking-[0.14em] text-ink-faint">
                    {new Date(post.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                  <div className="max-w-2xl">
                    <h2 className="display display-sm text-foreground transition-colors group-hover:text-accent">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-3 line-clamp-2 leading-relaxed text-ink-dim">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <ArrowUpRight
                    size={20}
                    strokeWidth={1.25}
                    className="hidden shrink-0 text-ink-faint transition-colors group-hover:text-accent md:block"
                  />
                </a>
              </Reveal>
            ))}
          </div>

          <p className="mt-14 text-center text-sm text-ink-faint">
            Content sourced from{" "}
            <a
              href={pageInfo.link}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line text-accent"
            >
              {pageInfo.name} on Facebook
            </a>
            {pageInfo.source === "curated" &&
              " — add FACEBOOK_PAGE_ACCESS_TOKEN for live sync"}
          </p>
        </Container>
      </section>
    </>
  );
}
