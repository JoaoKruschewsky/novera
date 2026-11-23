import type { Copy, SiteContent } from "@/content/types";

export interface Blocker {
  /** Pendência da spec ou do plano relacionada (P-xx, G-xx), quando houver. */
  pendencia: string;
  /** Caminho legível do item, por exemplo `faq.como-recebo`. */
  item: string;
  motivo: string;
}

const pendente = (c: Copy) => c.status === "pendente";

/**
 * Guarda de publicação (data-model §3, FR-022, FR-046): lista tudo o que impede a
 * publicação oficial. Função pura; o ambiente é passado por parâmetro.
 */
export function collectPublicationBlockers(
  content: SiteContent,
  env: { missing: string[]; mailTransport: string | undefined },
): Blocker[] {
  const b: Blocker[] = [];
  const texto = (item: string, c: Copy) => {
    if (pendente(c))
      b.push({ pendencia: "P-10", item, motivo: "texto provisório (status pendente)" });
  };

  texto("site.tagline", content.site.tagline);
  texto("home.hero.title", content.home.hero.title);
  texto("home.hero.proposition", content.home.hero.proposition);
  content.home.benefits.forEach((x) => {
    texto(`home.benefits.${x.id}.title`, x.title);
    texto(`home.benefits.${x.id}.description`, x.description);
  });
  content.home.howItWorks.forEach((x) => {
    texto(`home.howItWorks.${x.id}.title`, x.title);
    texto(`home.howItWorks.${x.id}.description`, x.description);
  });

  const p = content.product;
  texto("product.tagline", p.tagline);
  texto("product.description", p.description);
  texto("product.navigationExplanation", p.navigationExplanation);
  texto("product.generalRequirements", p.generalRequirements);
  p.includedContent.forEach((c, i) => texto(`product.includedContent.${i}`, c));
  p.usageGuidance.forEach((c, i) => texto(`product.usageGuidance.${i}`, c));
  p.limitations.forEach((c, i) => texto(`product.limitations.${i}`, c));
  p.features.forEach((f) => {
    if (f.status === "aprovado" && !f.verifiedInFile) {
      b.push({
        pendencia: "SC-003",
        item: `product.features.${f.id}`,
        motivo: "aprovada sem conferência no PDF (verifiedInFile: false)",
      });
    } else if (f.status === "pendente") {
      b.push({
        pendencia: "P-10",
        item: `product.features.${f.id}`,
        motivo: "funcionalidade com status pendente",
      });
    }
  });
  if (p.sales.price?.status === "pendente") {
    b.push({
      pendencia: "P-03",
      item: "product.sales.price",
      motivo: "preço informado mas não aprovado",
    });
  }

  content.faq.forEach((f) => {
    if (pendente(f.answer))
      b.push({ pendencia: "P-10", item: `faq.${f.id}`, motivo: "resposta com status pendente" });
  });

  const legalPendencia = {
    privacidade: "P-06",
    termos: "P-06",
    "informacoes-comerciais": "P-07",
  } as const;
  Object.values(content.legal).forEach((l) => {
    if (l.status === "pendente") {
      b.push({
        pendencia: legalPendencia[l.kind],
        item: `legal.${l.kind}`,
        motivo: "documento em preparação",
      });
    }
  });

  const negocio: Record<keyof SiteContent["business"], string> = {
    legalName: "P-04",
    taxId: "P-04",
    contactEmail: "P-05",
    supportHours: "P-05",
    responseTime: "P-05",
  };
  (Object.keys(negocio) as Array<keyof SiteContent["business"]>).forEach((k) => {
    if (content.business[k].status === "pendente") {
      b.push({ pendencia: negocio[k], item: `business.${k}`, motivo: "dado da empresa pendente" });
    }
  });

  env.missing.forEach((v) =>
    b.push({
      pendencia:
        v === "NEXT_PUBLIC_SITE_URL" ? "G-01" : v === "NOVERA_INBOX_EMAIL" ? "G-02" : "ambiente",
      item: `env.${v}`,
      motivo: "variável obrigatória ausente",
    }),
  );
  if (env.mailTransport !== "smtp" && env.mailTransport !== "resend") {
    b.push({
      pendencia: "ambiente",
      item: "env.MAIL_TRANSPORT",
      motivo: "transporte de e-mail real ausente (use 'smtp' ou 'resend')",
    });
  }
  return b;
}
