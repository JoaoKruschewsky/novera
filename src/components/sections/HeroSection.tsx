import { Container } from "@/components/layout/Container";
import { EditorialRule } from "@/components/layout/EditorialRule";
import { ProductFigure } from "@/components/product/ProductFigure";
import { Button } from "@/components/ui/Button";
import type { DemoMaterial, HomeContent } from "@/content/types";

const INDICE = ["Calendário", "Mensal", "Semanal", "Diário", "Metas", "Finanças", "Anotações"];

/**
 * Primeira dobra (FR-001, FR-003): marca, proposta em uma frase e CTA principal.
 * À direita, um recorte REAL do planner quando houver material aprovado; sem material,
 * a régua editorial com o índice tipográfico das seções (nunca simula o produto).
 */
export function HeroSection({
  brandName,
  hero,
  featured,
}: {
  brandName: string;
  hero: HomeContent["hero"];
  featured: DemoMaterial | undefined;
}) {
  return (
    <section
      aria-labelledby="hero-titulo"
      className="pt-10 pb-16 md:pt-16 md:pb-24 lg:pt-24 lg:pb-32"
    >
      <Container className="grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="eyebrow text-text-accent">{brandName}</p>
          <h1 id="hero-titulo" className="mt-4 text-display text-text-primary">
            {hero.title.text}
          </h1>
          <p className="mt-6 max-w-prose text-lead text-text-secondary">{hero.proposition.text}</p>
          <Button href="#planner-2027" className="mt-8">
            {hero.ctaLabel}
          </Button>
        </div>
        <div className="lg:col-span-5">
          {featured ? (
            <ProductFigure
              material={featured}
              priority
              showCaption={false}
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          ) : (
            <div aria-hidden="true" className="hidden lg:block">
              <EditorialRule number="2027" />
              <ul className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 text-text-secondary">
                {INDICE.map((item, i) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-3 border-b border-border-subtle pb-2"
                  >
                    <span className="eyebrow text-text-accent tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
