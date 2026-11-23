import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { HowItWorks } from "@/components/product/HowItWorks";
import type { HomeContent } from "@/content/types";

/** "Como funciona" (FR-008): os quatro passos. */
export function HowItWorksSection({
  steps,
  number,
}: {
  steps: HomeContent["howItWorks"];
  number: string;
}) {
  return (
    <section
      id="como-funciona"
      aria-labelledby="como-funciona-titulo"
      className="py-16 md:py-24 lg:py-32"
    >
      <Container>
        <SectionHeader number={number} title="Como funciona" id="como-funciona-titulo" />
        <div className="mt-12">
          <HowItWorks steps={steps} />
        </div>
      </Container>
    </section>
  );
}
