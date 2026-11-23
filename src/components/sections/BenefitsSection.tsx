import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/SectionHeader";
import type { HomeContent } from "@/content/types";

/** Benefícios concretos (FR-007): lista editorial numerada em duas colunas, sem cards. */
export function BenefitsSection({
  benefits,
  number,
}: {
  benefits: HomeContent["benefits"];
  number: string;
}) {
  return (
    <section aria-labelledby="beneficios-titulo" className="py-16 md:py-24 lg:py-32">
      <Container>
        <SectionHeader number={number} title="Benefícios" id="beneficios-titulo" />
        <ol className="mt-12 grid border-t border-border-subtle md:grid-cols-2 md:gap-x-12">
          {benefits.map((b, i) => (
            <li key={b.id} className="grid grid-cols-[3rem_1fr] border-b border-border-subtle py-6">
              <span aria-hidden="true" className="eyebrow pt-1 text-text-accent tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-h3 font-semibold text-text-primary">{b.title.text}</h3>
                <p className="mt-2 text-text-secondary">{b.description.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
