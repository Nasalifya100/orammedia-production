import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-surface-0 pt-24">
      <Container>
        <div className="text-center">
          <p className="numeral display text-[clamp(6rem,20vw,12rem)] leading-none text-ink/[0.08]">
            404
          </p>
          <h1 className="display display-lg mt-2 text-foreground">
            Page not found
          </h1>
          <p className="mx-auto mt-5 max-w-md leading-relaxed text-ink-dim">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/" className="btn btn-primary">
              Back to Home
            </Link>
            <Link href="/projects" className="btn btn-line">
              View Work
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
