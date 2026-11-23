import type { DemoMaterial } from "@/content/types";
import { LARGURAS_DEMO } from "@/lib/demo";
import { cn } from "@/lib/cn";

function srcSet(src: string, formato: "avif" | "webp"): string {
  return LARGURAS_DEMO.map((w) => `${src}-${w}.${formato} ${w}w`).join(", ");
}

/**
 * Imagem REAL do produto (research R-15): <picture> com AVIF/WebP pré-gerados, largura e altura
 * explícitas (evita CLS), alt obrigatório e legenda. Sem moldura de dispositivo falsa.
 */
export function ProductFigure({
  material,
  priority = false,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  showCaption = true,
  className,
}: {
  material: DemoMaterial;
  priority?: boolean;
  sizes?: string;
  showCaption?: boolean;
  className?: string;
}) {
  return (
    <figure className={cn("m-0", className)}>
      <picture>
        <source type="image/avif" srcSet={srcSet(material.src, "avif")} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet(material.src, "webp")} sizes={sizes} />
        <img
          src={`${material.src}-1080.webp`}
          alt={material.alt}
          width={material.width}
          height={material.height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          className="h-auto w-full rounded-md shadow-paper"
        />
      </picture>
      {showCaption ? (
        <figcaption className="mt-3 text-small text-text-on-paper">{material.caption}</figcaption>
      ) : null}
    </figure>
  );
}
