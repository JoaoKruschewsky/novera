import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { PurchaseCta } from "@/components/product/PurchaseCta";

/** Área de compra `#comprar` (FR-002): bloco único e calmo (design-system §5). */
export function PurchaseSection({ number }: { number: string }) {
  return (
    <section id="comprar" aria-labelledby="comprar-titulo" className="py-16 md:py-24 lg:py-32">
      <Container>
        <div className="border-t border-border-subtle pt-12">
          <SectionHeader number={number} title="Comprar o Planner 2027" id="comprar-titulo" />
          <div className="mt-8">
            <PurchaseCta />
          </div>
        </div>
      </Container>
    </section>
  );
}
