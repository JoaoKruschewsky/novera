import type { LegalPage } from "../types";

/**
 * Informações comerciais (P-04, P-07). Texto a ser redigido e aprovado pela Novera; NÃO inventar.
 * A seção de reembolso foi fornecida pelo responsável em 2026-11-21. A página continua
 * `pendente` até P-01 (plataforma e entrega) e P-04 (dados da empresa) serem fornecidos.
 */
export const informacoesComerciais: LegalPage = {
  kind: "informacoes-comerciais",
  title: "Informações comerciais",
  description:
    "Dados da empresa, entrega do produto digital e política de reembolso e arrependimento.",
  body: [
    { type: "heading", text: "Política de reembolso" },
    {
      type: "paragraph",
      text: "Antes de comprar, confira a descrição, as demonstrações e os requisitos de uso do produto.",
    },
    {
      type: "paragraph",
      text: "A Novera não oferece reembolso por simples mudança de preferência.",
    },
  ],
  requiredTopics: [
    "Dados da empresa: razão social e CNPJ ou equivalente (P-04)",
    "Plataforma de pagamento e forma de entrega do arquivo (P-01)",
    "Política de reembolso e direito de arrependimento (P-07)",
    "Canal de atendimento e prazo de resposta (P-05)",
  ],
  status: "pendente",
  effectiveDate: null,
};
