import { Download } from "lucide-react";
import type { FreeSample } from "@/content/types";

/**
 * "Experimente antes de comprar": download da prévia gratuita em PDF (amostra real do produto).
 * Link direto para o arquivo, sem formulário nem cadastro.
 */
export function FreeSampleCta({
  sample,
  compact = false,
}: {
  sample: FreeSample;
  /** Texto curto (página do produto), para não repetir o parágrafo da home. */
  compact?: boolean;
}) {
  return (
    <aside
      aria-labelledby="previa-titulo"
      className="grid gap-6 border-t border-border-paper pt-8 md:grid-cols-[1fr_auto] md:items-center"
    >
      <div className="max-w-prose">
        <h3 id="previa-titulo" className="text-h3 font-semibold text-text-on-paper">
          Experimente antes de comprar
        </h3>
        <p className="mt-2 text-text-on-paper">
          {compact
            ? `Teste ${sample.pages} páginas reais no seu app de anotações antes de comprar.`
            : `Baixe a prévia gratuita com ${sample.pages} páginas do Planner 2027: visão do mês, organização mensal, uma página diária e uma folha de anotações. Abra no aplicativo de anotações que você já usa e teste os links e a escrita.`}
        </p>
      </div>
      <a
        href={sample.src}
        download
        type="application/pdf"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-text-on-paper px-5 py-2.5 font-semibold text-surface-paper transition-colors duration-(--duration-fast) hover:bg-surface-raised"
      >
        <Download aria-hidden="true" className="size-5" />
        Baixar prévia gratuita
        <span className="text-small font-normal">(PDF, {sample.sizeKb} KB)</span>
      </a>
    </aside>
  );
}
