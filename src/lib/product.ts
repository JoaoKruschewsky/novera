import type { Feature, Product } from "@/content/types";
import { formatMonthPtBR } from "./format";

/** Só funcionalidades conferidas contra o PDF real são exibidas (FR-006, SC-003). */
export function selectVisibleFeatures(features: readonly Feature[]): Feature[] {
  return features.filter((f) => f.verifiedInFile);
}

/** Rótulo do formato: sempre deixa claro que é um PDF, não um aplicativo (FR-005). */
export function formatLabel(format: Product["format"]): string {
  switch (format) {
    case "pdf-interativo":
      return "Arquivo PDF interativo — não é um aplicativo";
  }
}

/** "janeiro a dezembro de 2027" (FR-004). */
export function formatPeriod(period: Product["period"]): string {
  const [mesInicio] = formatMonthPtBR(period.start).split(" de ");
  return `${mesInicio} a ${formatMonthPtBR(period.end)}`;
}
