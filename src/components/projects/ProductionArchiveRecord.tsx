import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import {
  archiveStatusLabel,
  type ArchiveField,
  type ProductionArchive,
} from "@/lib/data/production-archive";

function statusClass(status: ArchiveField["status"]): string {
  switch (status) {
    case "complete":
      return "text-accent";
    case "partial":
      return "text-ink-dim";
    case "review":
      return "text-ink-dim";
    case "hold":
      return "text-ink-faint";
    case "missing":
      return "text-ink-faint";
  }
}

interface ProductionArchiveRecordProps {
  archive: ProductionArchive;
}

/** Production file — archive dimensions and publication status */
export function ProductionArchiveRecord({
  archive,
}: ProductionArchiveRecordProps) {
  return (
    <section className="section border-t border-line bg-surface">
      <Container>
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-4">Production File</p>
            <h2 className="display display-sm text-foreground">
              Archive record
            </h2>
          </div>
          <p className="text-sm uppercase tracking-[0.16em] text-ink-faint">
            {archive.publicationStatus} · {archive.completeCount}/
            {archive.totalCount} complete
          </p>
        </div>

        <div className="grid gap-0 border border-line md:grid-cols-2">
          {archive.fields.map((field, i) => (
            <Reveal key={field.key} variant="up" delay={(i % 4) * 0.03}>
              <article className="border-b border-line p-6 md:p-8 [&:nth-child(odd)]:md:border-r">
                <div className="mb-3 flex items-baseline justify-between gap-4">
                  <h3 className="text-sm uppercase tracking-[0.18em] text-foreground">
                    {field.label}
                  </h3>
                  <span
                    className={`shrink-0 text-xs uppercase tracking-[0.14em] ${statusClass(field.status)}`}
                  >
                    {archiveStatusLabel(field.status)}
                  </span>
                </div>
                <p className="text-base leading-relaxed text-ink-dim">
                  {field.summary}
                </p>
                {field.detail && (
                  <p className="mt-3 text-sm leading-relaxed text-ink-faint">
                    {field.detail}
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
