import type { CompatibilityRecord } from "@/content/types";

export type CompatibilityView =
  | { mode: "requisitos-gerais" }
  | { mode: "lista"; compativeis: CompatibilityRecord[]; parciais: CompatibilityRecord[] };

/**
 * Compatibilidade (FR-013, data-model §1.6): sem testes, só os requisitos gerais.
 * Só `compativel` aparece como compatível; `parcial` com a limitação; `incompativel` nunca.
 */
export function resolveCompatibilityView(
  records: readonly CompatibilityRecord[],
): CompatibilityView {
  const compativeis = records.filter((r) => r.result === "compativel");
  const parciais = records.filter((r) => r.result === "parcial");
  if (compativeis.length === 0 && parciais.length === 0) return { mode: "requisitos-gerais" };
  return { mode: "lista", compativeis, parciais };
}
