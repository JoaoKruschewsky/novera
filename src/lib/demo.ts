import type { DemoMaterial } from "@/content/types";

/** Larguras geradas por scripts/otimizar-imagens.mjs (research R-15). */
export const LARGURAS_DEMO = [640, 1080, 1600] as const;
export const FORMATOS_DEMO = ["avif", "webp"] as const;

/** Só materiais aprovados são renderizados (data-model §1.5). */
export function selectApprovedDemo(materials: readonly DemoMaterial[]): DemoMaterial[] {
  return materials.filter((m) => m.status === "aprovado");
}

/** Arquivos em public/ que um material aprovado exige. */
export function arquivosDoMaterial(m: DemoMaterial): string[] {
  if (m.kind === "video") return [m.src, ...(m.poster ? [m.poster] : [])];
  return LARGURAS_DEMO.flatMap((w) => FORMATOS_DEMO.map((f) => `${m.src}-${w}.${f}`));
}

/**
 * Falha (lança erro) se um material aprovado apontar para arquivo inexistente.
 * `exists` é injetável para teste; em produção usa node:fs sobre public/.
 */
export function assertDemoFilesExist(
  materials: readonly DemoMaterial[],
  exists: (publicPath: string) => boolean,
): void {
  const faltando = selectApprovedDemo(materials).flatMap((m) =>
    arquivosDoMaterial(m).filter((arquivo) => !exists(arquivo)),
  );
  if (faltando.length > 0) {
    throw new Error(
      `Materiais de demonstração aprovados sem arquivo em public/: ${faltando.join(", ")}`,
    );
  }
}
