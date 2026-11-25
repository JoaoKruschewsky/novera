"use client";

import { Pause, Play } from "lucide-react";
import { useState } from "react";
import type { DemoMaterial } from "@/content/types";
import { ProductFigure } from "./ProductFigure";

/**
 * Faixa de fotos em movimento contínuo (marquee), pedida pelo responsável (2026-11-24).
 * Acessibilidade (WCAG 2.2.2): botão "Pausar" sempre visível; pausa com o ponteiro em cima ou
 * com foco dentro da faixa; com `prefers-reduced-motion: reduce` não se move e vira uma rolagem
 * horizontal comum. A segunda cópia (que fecha o laço visual) fica oculta para leitores de tela.
 */
export function DemoMarquee({ materials }: { materials: DemoMaterial[] }) {
  const [pausado, setPausado] = useState(false);
  if (materials.length === 0) return null;

  const itens = (copia: "a" | "b") =>
    materials.map((m) => (
      <li key={`${copia}-${m.id}`} className="w-[min(80vw,26rem)] shrink-0 md:w-[30rem]">
        <ProductFigure material={m} sizes="(min-width: 768px) 480px, 80vw" />
      </li>
    ));

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-small text-text-on-paper">{materials.length} fotos do planner em uso</p>
        <button
          type="button"
          onClick={() => setPausado((p) => !p)}
          className="marquee-controle inline-flex min-h-11 items-center gap-2 rounded-sm border border-border-paper px-4 text-small font-semibold text-text-on-paper hover:border-text-on-paper"
        >
          {pausado ? (
            <Play aria-hidden="true" className="size-4" />
          ) : (
            <Pause aria-hidden="true" className="size-4" />
          )}
          {pausado ? "Continuar fotos" : "Pausar fotos"}
        </button>
      </div>
      <div
        className="marquee -mx-5 overflow-hidden px-5 md:-mx-8 md:px-8"
        data-pausado={pausado ? "true" : undefined}
      >
        <div className="marquee-trilha flex w-max">
          <ul aria-label="Fotos do Planner 2027" className="flex gap-6 pr-6">
            {itens("a")}
          </ul>
          <ul aria-hidden="true" className="marquee-copia flex gap-6 pr-6">
            {itens("b")}
          </ul>
        </div>
      </div>
    </div>
  );
}
