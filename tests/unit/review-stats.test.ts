import { describe, expect, it } from "vitest";
import type { PublishedReview } from "@/content/types";
import { reviewStats } from "@/features/avaliacoes/stats";

const r = (
  id: string,
  rating: PublishedReview["rating"],
  submittedOn: string,
): PublishedReview => ({
  id,
  productSlug: "planner-2027",
  rating,
  comment: "Comentário com mais de vinte caracteres.",
  publicName: "Pessoa",
  submittedOn,
  publishedOn: submittedOn,
  verifiedPurchase: true,
});

describe("reviewStats (FR-032, V-19)", () => {
  it("sem avaliações: null (nada é exibido)", () => expect(reviewStats([])).toBeNull());
  it("uma avaliação: média igual à nota e contagem 1", () => {
    expect(reviewStats([r("2027-01-01-01", 2, "2027-01-01")])).toMatchObject({
      count: 1,
      average: 2,
    });
  });
  it("notas 5, 4 e 1: média 3,3 e contagem 3", () => {
    const s = reviewStats([
      r("2027-01-10-01", 5, "2027-01-10"),
      r("2027-02-03-01", 1, "2027-02-03"),
      r("2027-01-20-01", 4, "2027-01-20"),
    ]);
    expect(s).toMatchObject({ count: 3, average: 3.3 });
    expect(s?.sorted.map((x) => x.rating)).toEqual([1, 4, 5]);
  });
  it("ordena por data de envio, nunca por nota", () => {
    const s = reviewStats([
      r("2027-03-01-01", 5, "2027-03-01"),
      r("2027-04-01-01", 1, "2027-04-01"),
    ]);
    expect(s?.sorted[0]?.rating).toBe(1);
  });
});
