import type { DemoMaterial, FreeSample } from "@/content/types";
import { Notice } from "@/components/ui/Notice";
import { DemoMarquee } from "./DemoMarquee";
import { DemoVideo } from "./DemoVideo";
import { FreeSampleCta } from "./FreeSampleCta";

export const DEMO_VAZIA_TITULO = "As imagens do produto serão publicadas em breve.";

/**
 * Demonstração (FR-009 a FR-011): vídeo de apresentação em destaque, faixa de fotos em movimento
 * e a prévia gratuita em PDF. Recebe só materiais `aprovado` (filtrados no servidor).
 * Sem materiais aprovados, mostra o estado informativo (FR-010).
 * `showVideo=false` (página do produto) evita repetir o vídeo já exibido na home.
 */
export function DemoGallery({
  materials,
  freeSample = null,
  showVideo = true,
}: {
  materials: DemoMaterial[];
  freeSample?: FreeSample | null;
  showVideo?: boolean;
}) {
  const video = showVideo ? materials.find((m) => m.kind === "video") : undefined;
  const fotos = materials.filter((m) => m.kind === "imagem");
  const amostra = freeSample?.status === "aprovado" ? freeSample : null;

  if (!video && fotos.length === 0 && !amostra) {
    return (
      <Notice onPaper title={DEMO_VAZIA_TITULO}>
        <p>
          Esta área vai mostrar páginas reais do Planner 2027, exportadas do arquivo final, assim
          que estiverem prontas.
        </p>
      </Notice>
    );
  }

  return (
    <div className="grid gap-12 md:gap-16">
      {video ? <DemoVideo material={video} /> : null}
      {fotos.length > 0 ? <DemoMarquee materials={fotos} /> : null}
      {amostra ? <FreeSampleCta sample={amostra} compact={!showVideo} /> : null}
    </div>
  );
}
