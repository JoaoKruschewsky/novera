import type { Metadata } from "next";

export const OG_IMAGE = { url: "/og/novera-padrao.png", width: 1200, height: 630, alt: "Novera" };

interface PageMetadataInput {
  /** Título da página; o layout aplica o modelo "%s · Novera". */
  title: string;
  /** Até 160 caracteres (FR-048). */
  description: string;
  /** Caminho canônico, por exemplo "/faq". */
  path: string;
  /** true em /avaliar e /especime: noindex, nofollow. */
  noindex?: boolean;
  /** Usa o título sem o sufixo do modelo (home). */
  absoluteTitle?: boolean;
}

/** Metadados por página (contracts/rotas-e-componentes.md §4). */
export function buildPageMetadata({
  title,
  description,
  path,
  noindex = false,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  if (description.length > 160) {
    throw new Error(`Descrição de ${path} com mais de 160 caracteres.`);
  }
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Novera",
      locale: "pt_BR",
      type: "website",
      images: [OG_IMAGE],
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
