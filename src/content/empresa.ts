import type { BusinessInfo } from "./types";

/**
 * Dados da empresa e canais de contato (P-04, P-05).
 * NUNCA preencher com valor inventado: campos pendentes não são renderizados.
 */
export const business: BusinessInfo = {
  legalName: { value: null, status: "pendente" }, // P-04 razão social
  taxId: { value: null, status: "pendente" }, // P-04 CNPJ ou equivalente
  contactEmail: { value: "novera.brazil@gmail.com", status: "aprovado" }, // P-05 (aprovado 2026-11-21)
  supportHours: { value: null, status: "pendente" }, // P-05
  responseTime: { value: null, status: "pendente" }, // P-05 prazo de resposta
};
