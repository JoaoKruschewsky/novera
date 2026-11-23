import { CompatibilityTable } from "@/components/product/CompatibilityTable";
import { FeatureList } from "@/components/product/FeatureList";
import { ProductIntroSection } from "@/components/sections/ProductIntroSection";
import type { Product } from "@/content/types";
import { produtoTeste } from "../../../tests/fixtures/content/produto-teste";

/**
 * SC-012: um segundo produto FICTÍCIO (nunca publicado) apresentado com os mesmos componentes,
 * só com conteúdo novo, para conferir que a estrutura aceita produtos futuros (FR-014).
 * Só existe no espécime, que não roda em produção.
 */
export function EspecimeProduto() {
  const produto: Product = produtoTeste;
  return (
    <section aria-labelledby="segundo-produto" className="space-y-8">
      <h2 id="segundo-produto" className="text-h2">
        Segundo produto fictício (SC-012)
      </h2>
      <p className="max-w-prose text-text-secondary">
        Dados de teste, nunca publicados. Os componentes abaixo são os mesmos do Planner 2027.
      </p>
      <div className="-mx-5 md:-mx-8">
        <ProductIntroSection product={produto} number="01" />
      </div>
      <FeatureList features={produto.features} />
      <CompatibilityTable
        records={produto.compatibility}
        generalRequirements={produto.generalRequirements}
      />
    </section>
  );
}
