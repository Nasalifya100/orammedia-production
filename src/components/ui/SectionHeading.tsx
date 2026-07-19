import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  dual?: { highlight: string; base?: string };
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  dual,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "text-center mx-auto max-w-3xl",
        className,
      )}
    >
      {eyebrow && <p className="text-eyebrow mb-4">{eyebrow}</p>}
      {dual ? (
        <h2 className="sg-dual-heading">
          <span className="highlight">{dual.highlight}</span>
          {dual.base && <span className="base"> {dual.base}</span>}
        </h2>
      ) : (
        <h2 className="text-display text-display-md">{title}</h2>
      )}
      {description && (
        <p className="mt-5 text-sm leading-relaxed text-muted md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
