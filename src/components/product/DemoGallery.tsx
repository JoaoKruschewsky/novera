"use client";

import { useState } from "react";
import type { DemoMaterial } from "@/content/types";
import { Notice } from "@/components/ui/Notice";
import { cn } from "@/lib/cn";
import { ProductFigure } from "./ProductFigure";

const ROTULOS: Record<DemoMaterial["section"], string> = {
  navegacao: "Navegação por links",
  diario: "Diário",
  semanal: "Semanal",
  mensal: "Mensal",
  calendario: "Calendário",
  metas: "Metas",
  financas: "Finanças",
  anotacoes: "Anotações",
  escrita: "Espaço de escrita",
};

export const DEMO_VAZIA_TITULO = "As imagens do produto serão publicadas em breve.";

/** Vídeo real (FR-011): controles nativos, sem som automático, equivalente textual visível. */
function DemoVideo({ material }: { material: DemoMaterial }) {
  return (
    <figure className="m-0">
      <video
        controls
        muted
        playsInline
        preload="none"
        poster={material.poster}
        width={material.width}
        height={material.height}
        aria-describedby={`${material.id}-descricao`}
        className="h-auto w-full rounded-md shadow-paper"
      >
        <source src={material.src} type="video/mp4" />
      </video>
      <figcaption className="mt-3 text-small text-text-on-paper">{material.caption}</figcaption>
      <p id={`${material.id}-descricao`} className="mt-2 max-w-prose text-small text-text-on-paper">
        {material.textEquivalent}
      </p>
    </figure>
  );
}

/**
 * Galeria da demonstração (design-system §5): página principal grande + miniaturas rotuladas
 * pela seção do produto. Sem materiais aprovados, mostra o estado informativo (FR-010).
 * Recebe só materiais `aprovado` (filtrados no servidor).
 */
export function DemoGallery({ materials }: { materials: DemoMaterial[] }) {
  const [ativo, setAtivo] = useState(0);
  if (materials.length === 0) {
    return (
      <Notice onPaper title={DEMO_VAZIA_TITULO}>
        <p>
          Esta área vai mostrar páginas reais do Planner 2027, exportadas do arquivo final, assim
          que estiverem prontas.
        </p>
      </Notice>
    );
  }
  const atual = materials[Math.min(ativo, materials.length - 1)];
  if (!atual) return null;
  return (
    <div className="grid gap-8">
      <div aria-live="polite">
        {atual.kind === "video" ? (
          <DemoVideo material={atual} />
        ) : (
          <ProductFigure material={atual} sizes="(min-width: 1360px) 1200px, 100vw" />
        )}
      </div>
      {materials.length > 1 ? (
        <ul aria-label="Páginas da demonstração" className="flex flex-wrap gap-2">
          {materials.map((m, i) => (
            <li key={m.id}>
              <button
                type="button"
                aria-pressed={i === ativo}
                onClick={() => setAtivo(i)}
                className={cn(
                  "min-h-11 rounded-sm border px-4 text-small font-semibold transition-colors duration-(--duration-fast)",
                  i === ativo
                    ? "border-text-on-paper bg-text-on-paper text-surface-paper"
                    : "border-border-paper text-text-on-paper hover:border-text-on-paper",
                )}
              >
                {ROTULOS[m.section]}
                {m.kind === "video" ? " (vídeo)" : ""}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
