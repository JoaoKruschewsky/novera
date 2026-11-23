import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { FeatureList } from "@/components/product/FeatureList";
import { Notice } from "@/components/ui/Notice";
import { TextLink } from "@/components/ui/TextLink";
import type { Product } from "@/content/types";
import { formatLabel, formatPeriod, selectVisibleFeatures } from "@/lib/product";

/** Apresentação do Planner 2027 na home (US1-2, US1-3, FR-004, FR-005). */
export function ProductIntroSection({ product, number }: { product: Product; number: string }) {
  const features = selectVisibleFeatures(product.features);
  return (
    <section
      id={product.slug}
      aria-labelledby={`${product.slug}-titulo`}
      className="py-16 md:py-24 lg:py-32"
    >
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeader
            number={number}
            eyebrow="O produto"
            title={product.name}
            id={`${product.slug}-titulo`}
            lead={<p>{product.tagline.text}</p>}
          />
        </div>
        <div className="space-y-8 lg:col-span-7">
          <dl className="grid gap-6 border-t border-border-subtle pt-6 sm:grid-cols-2">
            <div>
              <dt className="eyebrow text-text-accent">Período</dt>
              <dd className="mt-1 text-lead text-text-primary">{formatPeriod(product.period)}</dd>
            </div>
            <div>
              <dt className="eyebrow text-text-accent">Formato</dt>
              <dd className="mt-1 text-lead text-text-primary">{formatLabel(product.format)}</dd>
            </div>
          </dl>
          {product.limitations.map((l) => (
            <p key={l.text} className="max-w-prose border-l-2 border-accent pl-5 text-text-primary">
              {l.text}
            </p>
          ))}
          {features.length > 0 ? (
            <FeatureList features={features} />
          ) : (
            <Notice title="Lista de conteúdo em conferência">
              <p>Cada item do planner só aparece aqui depois de conferido no arquivo final.</p>
            </Notice>
          )}
          <p>
            <TextLink href={`/${product.slug}`}>Ver todos os detalhes do produto</TextLink>
          </p>
        </div>
      </Container>
    </section>
  );
}
