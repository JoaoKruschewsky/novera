import type { PublishedReview } from "@/content/types";

export interface ReviewStats {
  count: number;
  /** Média arredondada a 1 casa decimal (FR-032). */
  average: number;
  /** Ordem cronológica decrescente pela data de envio, NUNCA por nota (Constitution IV). */
  sorted: PublishedReview[];
}

/** Estatísticas calculadas só das avaliações publicadas; `null` quando não há nenhuma (FR-033). */
export function reviewStats(reviews: readonly PublishedReview[]): ReviewStats | null {
  if (reviews.length === 0) return null;
  const soma = reviews.reduce((acc, r) => acc + r.rating, 0);
  const sorted = [...reviews].sort((a, b) =>
    a.submittedOn === b.submittedOn
      ? b.id.localeCompare(a.id)
      : b.submittedOn.localeCompare(a.submittedOn),
  );
  return { count: reviews.length, average: Math.round((soma / reviews.length) * 10) / 10, sorted };
}
