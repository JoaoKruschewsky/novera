import type { DemoMaterial } from "../../types";

/**
 * Materiais de demonstração REAIS do Planner 2027 (FR-009, research R-15). Inicia vazio (P-09).
 *
 * Como registrar uma captura real:
 * 1. Exporte a página do PDF APROVADO, sem alterá-lo, para media-originais/planner-2027/<id>.png.
 * 2. Rode `npm run images:otimizar` (gera AVIF/WebP 640/1080/1600 em public/media/planner-2027/).
 * 3. Adicione a entrada abaixo com a largura e a altura impressas pelo script:
 *    {
 *      id: "diario",
 *      kind: "imagem",
 *      src: "/media/planner-2027/diario",   // sem extensão: o componente monta os formatos
 *      width: 1600, height: 1200,
 *      alt: "Descrição do conteúdo REAL mostrado na página",
 *      caption: "Página diária",
 *      section: "diario",
 *      status: "aprovado",                  // só depois de conferida contra o PDF
 *    }
 * O build falha se um material aprovado não existir em public/.
 * Nunca use imagens simuladas ou ilustrativas (FR-010).
 */
export const demo: DemoMaterial[] = [];
