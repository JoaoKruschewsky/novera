import { BadgeCheck, Star } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import type { PublishedReview } from "@/content/types";
import { cn } from "@/lib/cn";
import { formatAverage, formatDatePtBR, pluralize } from "@/lib/format";
import { reviewStats } from "./stats";

function Estrelas({ rating }: { rating: number }) {
  return (
    <span aria-hidden="true" className="inline-flex gap-0.5 text-text-accent">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={cn("size-4", n <= rating ? "fill-current" : "opacity-40")} />
      ))}
    </span>
  );
}

/**
 * Avaliações reais de compradores (FR-031 a FR-034, contrato de rotas §5).
 * Sem avaliações publicadas, retorna `null`: a seção, a âncora, a média, a contagem e as
 * estrelas NÃO existem no HTML. Notas baixas têm o mesmo tratamento das altas.
 */
export function ReviewsSection({
  reviews,
  number,
}: {
  reviews: readonly PublishedReview[];
  number: string;
}) {
  const stats = reviewStats(reviews);
  if (!stats) return null;
  const resumo = `Média ${formatAverage(stats.average)} de 5 · ${stats.count} ${pluralize(
    stats.count,
    "avaliação",
    "avaliações",
  )} de ${pluralize(stats.count, "comprador verificado", "compradores verificados")}`;
  return (
    <section
      id="avaliacoes"
      aria-labelledby="avaliacoes-titulo"
      className="py-16 md:py-24 lg:py-32"
    >
      <Container>
        <SectionHeader
          number={number}
          title="Avaliações de compradores"
          id="avaliacoes-titulo"
          lead={<p data-testid="resumo-avaliacoes">{resumo}</p>}
        />
        <ul className="mt-12 grid gap-x-12 border-t border-border-subtle md:grid-cols-2">
          {stats.sorted.map((r) => (
            <li key={r.id} className="border-b border-border-subtle py-8" data-testid="avaliacao">
              <figure className="m-0">
                <div className="flex flex-wrap items-center gap-3">
                  <Estrelas rating={r.rating} />
                  <span className="text-small text-text-secondary">Nota {r.rating} de 5</span>
                </div>
                <blockquote className="mt-4 font-display text-lead text-text-primary">
                  <p>{r.comment}</p>
                </blockquote>
                <figcaption className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-small text-text-secondary">
                  <span className="font-semibold text-text-primary">{r.publicName}</span>
                  <time dateTime={r.submittedOn}>{formatDatePtBR(r.submittedOn)}</time>
                  <span className="inline-flex items-center gap-1 text-text-accent">
                    <BadgeCheck aria-hidden="true" className="size-4" />
                    Compra verificada
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
