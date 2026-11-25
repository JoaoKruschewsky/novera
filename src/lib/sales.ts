import { PLATFORM_LABELS } from "@/content/schemas";
import type { SalesConfig } from "@/content/types";
import { formatBRL } from "./format";

export type SalesView =
  | { state: "nao-abertas" }
  | { state: "abertas"; checkoutUrl: string; platformLabel: string; price: string | null };

/**
 * Estado efetivo de venda (data-model §1.4, contracts/rotas-e-componentes.md §3).
 * - O interruptor `nao-abertas` sempre fecha as vendas; o inverso não existe.
 * - Preço só com status `aprovado` (FR-018).
 */
export function resolveSalesState(
  sales: SalesConfig,
  override: "nao-abertas" | undefined,
): SalesView {
  if (override === "nao-abertas") return { state: "nao-abertas" };
  if (sales.state !== "vendas-abertas" || !sales.platform || !sales.checkoutUrl) {
    return { state: "nao-abertas" };
  }
  const price =
    sales.price && sales.price.status === "aprovado" ? formatBRL(sales.price.amountCents) : null;
  return {
    state: "abertas",
    checkoutUrl: sales.checkoutUrl,
    platformLabel: PLATFORM_LABELS[sales.platform],
    price,
  };
}
