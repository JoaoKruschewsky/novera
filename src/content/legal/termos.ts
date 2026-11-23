import type { LegalPage } from "../types";

/** Termos e condições (P-06). Texto a ser redigido e aprovado pela Novera; NÃO inventar. */
export const termos: LegalPage = {
  kind: "termos",
  title: "Termos e condições",
  description: "Termos e condições de uso do site e de compra dos produtos digitais da Novera.",
  body: [],
  requiredTopics: [
    "Natureza do produto: arquivo PDF interativo, não é aplicativo",
    "Compra e pagamento realizados em plataforma externa",
    "Licença de uso do arquivo",
    "Envio e publicação de avaliações (moderação, verificação de compra, remoção a pedido)",
  ],
  status: "pendente",
  effectiveDate: null,
};
