import { Container } from "@/components/layout/Container";
import { PaperBand } from "@/components/layout/PaperBand";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { DemoGallery } from "@/components/product/DemoGallery";
import type { DemoMaterial, FreeSample } from "@/content/types";

/** Demonstração `#demonstracao` (FR-009, FR-010) em faixa de papel; sem página própria (FR-036e). */
export function DemoSection({
  materials,
  freeSample,
  number,
}: {
  materials: DemoMaterial[];
  freeSample: FreeSample | null;
  number: string;
}) {
  return (
    <div className="md:px-4">
      <PaperBand id="demonstracao" labelledBy="demonstracao-titulo" className="py-16 md:py-24">
        <Container>
          <SectionHeader
            number={number}
            eyebrow="Veja o Planner 2027 em uso"
            title="Demonstração"
            id="demonstracao-titulo"
            onPaper
          />
          <div className="mt-10">
            <DemoGallery materials={materials} freeSample={freeSample} />
          </div>
        </Container>
      </PaperBand>
    </div>
  );
}
