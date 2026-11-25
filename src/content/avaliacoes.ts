import type { PublishedReview } from "./types";

/**
 * Avaliações APROVADAS na moderação (FR-036d). Inicia vazio.
 *
 * Só entram avaliações com compra confirmada manualmente no painel do checkout (FR-030).
 * PROIBIDO incluir e-mail, telefone ou qualquer contato do autor.
 * A média e a contagem são calculadas a partir desta lista (nunca escritas à mão).
 * Remoção a pedido do autor (FR-035): apagar a entrada por Pull Request.
 * Rotina completa no README (seção "Moderação de avaliações").
 *
 * Exemplo de entrada:
 * {
 *   id: "2027-01-15-01",
 *   productSlug: "planner-2027",
 *   rating: 4,
 *   comment: "Texto moderado, sem dados pessoais (20 a 1.500 caracteres).",
 *   publicName: "Nome público escolhido pelo autor",
 *   submittedOn: "2027-01-15",
 *   publishedOn: "2027-01-18",
 *   verifiedPurchase: true,
 * }
 */
export const reviews: PublishedReview[] = [];
