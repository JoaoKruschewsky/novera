import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { EditorialRule } from "@/components/layout/EditorialRule";
import { PaperBand } from "@/components/layout/PaperBand";
import { CompatibilityTable } from "@/components/product/CompatibilityTable";
import { DemoGallery } from "@/components/product/DemoGallery";
import { FeatureList } from "@/components/product/FeatureList";
import { PurchaseCta } from "@/components/product/PurchaseCta";
import { Notice } from "@/components/ui/Notice";
import { getSiteContent } from "@/content";
import { selectApprovedDemo } from "@/lib/demo";
import { buildPageMetadata } from "@/lib/metadata";
import { formatLabel, formatPeriod, selectVisibleFeatures } from "@/lib/product";

const { product } = getSiteContent();

export const metadata = buildPageMetadata({
  title: product.seo.title,
  description: product.seo.description,
  path: "/planner-2027",
});

function Bloco({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="grid gap-6 border-t border-border-subtle py-12 lg:grid-cols-12"
    >
      <div className="lg:col-span-4">
        <EditorialRule number={number} className="mb-4 max-w-[8rem]" />
        <h2 id={id} className="text-h2">
          {title}
        </h2>
      </div>
      <div className="space-y-4 lg:col-span-8">{children}</div>
    </section>
  );
}

/** Detalhes do produto (FR-012, US4-1). Aprofunda a home sem repetir seus textos (US4-4). */
export default function PlannerPage() {
  const features = selectVisibleFeatures(product.features);
  const demo = selectApprovedDemo(product.demo);
  return (
    <>
      <Container className="pt-12 pb-8 md:pt-20">
        <p className="eyebrow text-text-accent">Detalhes do produto</p>
        <h1 className="mt-4 max-w-4xl text-h1">{product.name}</h1>
        <p className="mt-6 max-w-prose text-lead text-text-secondary">{product.description.text}</p>
      </Container>

      <Container>
        <Bloco id="formato" number="01" title="Formato do arquivo">
          <p className="text-lead text-text-primary">{formatLabel(product.format)}</p>
          <p className="text-text-secondary">Período coberto: {formatPeriod(product.period)}.</p>
          {product.limitations.map((l) => (
            <p key={l.text} className="max-w-prose text-text-secondary">
              {l.text}
            </p>
          ))}
        </Bloco>

        <Bloco id="conteudo-incluido" number="02" title="Conteúdo incluído">
          <ul className="max-w-prose list-disc space-y-2 pl-5 text-text-secondary marker:text-text-accent">
            {product.includedContent.map((c) => (
              <li key={c.text}>{c.text}</li>
            ))}
          </ul>
          {features.length > 0 ? (
            <FeatureList features={features} />
          ) : (
            <Notice title="Lista detalhada em conferência">
              <p>
                Cada página e área do planner só é listada depois de conferida no arquivo final.
              </p>
            </Notice>
          )}
        </Bloco>

        <Bloco id="navegacao-interna" number="03" title="Navegação interna">
          <p className="max-w-prose text-text-secondary">{product.navigationExplanation.text}</p>
        </Bloco>

        <Bloco id="orientacoes" number="04" title="Orientações de uso">
          <ol className="max-w-prose list-decimal space-y-2 pl-5 text-text-secondary marker:text-text-accent">
            {product.usageGuidance.map((g) => (
              <li key={g.text}>{g.text}</li>
            ))}
          </ol>
        </Bloco>

        <Bloco id="compatibilidade" number="05" title="Compatibilidade">
          <CompatibilityTable
            records={product.compatibility}
            generalRequirements={product.generalRequirements}
          />
        </Bloco>
      </Container>

      <div className="md:px-4">
        <PaperBand labelledBy="exemplos-titulo" className="my-8 py-14 md:py-20">
          <Container>
            <h2 id="exemplos-titulo" className="text-h2 text-text-on-paper">
              Exemplos visuais
            </h2>
            <div className="mt-8">
              <DemoGallery materials={demo} />
            </div>
          </Container>
        </PaperBand>
      </div>

      <Container className="py-16 md:py-24">
        <section
          aria-labelledby="compra-detalhes-titulo"
          className="border-t border-border-subtle pt-12"
        >
          <h2 id="compra-detalhes-titulo" className="mb-6 text-h2">
            Comprar o Planner 2027
          </h2>
          <PurchaseCta />
        </section>
      </Container>
    </>
  );
}
