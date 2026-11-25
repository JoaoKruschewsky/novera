/**
 * Schemas Zod do conteúdo versionado (data-model.md §1, research R-09).
 * Validados no carregamento de src/content/index.ts: conteúdo inválido FALHA o build.
 */
import { z } from "zod";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Telefone ou sequência de 8+ dígitos (aceita espaços, pontos e hífens entre os dígitos). */
export const SEQUENCIA_DE_DIGITOS = /(?:\d[\s.-]?){8,}/;
/** Indício de dado de contato pessoal: e-mail (@) ou telefone/documento. */
export function contemDadoDeContato(texto: string): boolean {
  return texto.includes("@") || SEQUENCIA_DE_DIGITOS.test(texto);
}

export const isoDate = z.string().regex(ISO_DATE, "Data no formato aaaa-mm-dd.");

export const contentStatusSchema = z.enum(["pendente", "aprovado"]);

export const copySchema = z.object({
  text: z.string().trim().min(1),
  status: contentStatusSchema,
});

export const featureSchema = z.object({
  id: z.string().regex(KEBAB),
  title: z.string().min(1),
  description: z.string().min(1),
  verifiedInFile: z.boolean(),
  status: contentStatusSchema,
});

/** Hosts oficiais de checkout por plataforma [VERIFICAR na plataforma escolhida]. */
export const CHECKOUT_HOSTS = {
  kiwify: ["pay.kiwify.com.br"],
  hotmart: ["pay.hotmart.com"],
} as const;

export const PLATFORM_LABELS = { kiwify: "Kiwify", hotmart: "Hotmart" } as const;

export const salesConfigSchema = z
  .object({
    state: z.enum(["vendas-nao-abertas", "vendas-abertas"]),
    platform: z.enum(["kiwify", "hotmart"]).nullable(),
    checkoutUrl: z.string().nullable(),
    price: z
      .object({
        amountCents: z.number().int().positive(),
        currency: z.literal("BRL"),
        status: contentStatusSchema,
      })
      .nullable(),
  })
  .superRefine((sales, ctx) => {
    if (sales.state !== "vendas-abertas") return;
    if (!sales.platform) {
      ctx.addIssue({
        code: "custom",
        path: ["platform"],
        message: "Vendas abertas exigem a plataforma (P-01).",
      });
    }
    if (!sales.checkoutUrl) {
      ctx.addIssue({
        code: "custom",
        path: ["checkoutUrl"],
        message: "Vendas abertas exigem a URL de checkout (P-02).",
      });
      return;
    }
    let url: URL;
    try {
      url = new URL(sales.checkoutUrl);
    } catch {
      ctx.addIssue({ code: "custom", path: ["checkoutUrl"], message: "URL de checkout inválida." });
      return;
    }
    if (url.protocol !== "https:") {
      ctx.addIssue({
        code: "custom",
        path: ["checkoutUrl"],
        message: "A URL de checkout precisa usar https.",
      });
    }
    const permitidos: readonly string[] = sales.platform ? CHECKOUT_HOSTS[sales.platform] : [];
    if (sales.platform && !permitidos.includes(url.hostname)) {
      ctx.addIssue({
        code: "custom",
        path: ["checkoutUrl"],
        message: `Host ${url.hostname} não é um checkout oficial de ${sales.platform}.`,
      });
    }
  });

export const demoSectionSchema = z.enum([
  "navegacao",
  "diario",
  "semanal",
  "mensal",
  "calendario",
  "metas",
  "financas",
  "anotacoes",
  "escrita",
]);

export const demoMaterialSchema = z
  .object({
    id: z.string().regex(KEBAB),
    kind: z.enum(["imagem", "video"]),
    /** Caminho público, por exemplo /media/planner-2027/diario (sem extensão para imagens). */
    src: z.string().startsWith("/media/"),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    poster: z.string().startsWith("/media/").optional(),
    alt: z.string().trim().min(10, "O texto alternativo deve descrever o conteúdo real."),
    caption: z.string().min(1),
    section: demoSectionSchema,
    textEquivalent: z.string().min(1).optional(),
    status: contentStatusSchema,
  })
  .superRefine((m, ctx) => {
    if (m.kind === "video" && !m.poster) {
      ctx.addIssue({ code: "custom", path: ["poster"], message: "Vídeo exige poster real." });
    }
    if (m.kind === "video" && !m.textEquivalent) {
      ctx.addIssue({
        code: "custom",
        path: ["textEquivalent"],
        message: "Vídeo exige equivalente textual (FR-011).",
      });
    }
  });

/** Prévia gratuita do produto: amostra real em PDF para baixar antes de comprar. */
export const freeSampleSchema = z.object({
  src: z.string().startsWith("/media/").endsWith(".pdf"),
  pages: z.number().int().positive(),
  sizeKb: z.number().int().positive(),
  status: contentStatusSchema,
});

export const compatibilityRecordSchema = z.object({
  app: z.string().min(1),
  platform: z.string().min(1),
  checks: z.object({ internalLinks: z.boolean(), handwriting: z.boolean() }),
  result: z.enum(["compativel", "parcial", "incompativel"]),
  testedOn: isoDate,
  notes: z.string().optional(),
});

export const productSchema = z.object({
  slug: z.string().regex(KEBAB),
  name: z.string().min(1),
  tagline: copySchema,
  description: copySchema,
  period: z.object({ start: z.literal("2027-01"), end: z.literal("2027-12") }),
  format: z.literal("pdf-interativo"),
  features: z.array(featureSchema),
  includedContent: z.array(copySchema),
  usageGuidance: z.array(copySchema),
  navigationExplanation: copySchema,
  limitations: z.array(copySchema),
  sales: salesConfigSchema,
  demo: z.array(demoMaterialSchema),
  freeSample: freeSampleSchema.nullable(),
  compatibility: z.array(compatibilityRecordSchema),
  generalRequirements: copySchema,
  seo: z.object({ title: z.string().min(1), description: z.string().min(1).max(160) }),
});

export const faqItemSchema = z.object({
  id: z.string().regex(KEBAB),
  question: z.string().min(1),
  answer: copySchema,
  order: z.number().int().nonnegative(),
});

export const legalBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("heading"), text: z.string().min(1) }),
  z.object({ type: z.literal("paragraph"), text: z.string().min(1) }),
  z.object({ type: z.literal("list"), items: z.array(z.string().min(1)).min(1) }),
]);

export const legalPageSchema = z
  .object({
    kind: z.enum(["privacidade", "termos", "informacoes-comerciais"]),
    title: z.string().min(1),
    description: z.string().min(1).max(160),
    body: z.array(legalBlockSchema),
    /** Tópicos que o texto final MUST cobrir (lista de trabalho, não exibida como texto jurídico). */
    requiredTopics: z.array(z.string().min(1)),
    status: contentStatusSchema,
    effectiveDate: isoDate.nullable(),
  })
  .superRefine((p, ctx) => {
    if (p.status === "aprovado" && !p.effectiveDate) {
      ctx.addIssue({
        code: "custom",
        path: ["effectiveDate"],
        message: "Documento aprovado exige data de vigência.",
      });
    }
    if (p.status === "aprovado" && p.body.length === 0) {
      ctx.addIssue({ code: "custom", path: ["body"], message: "Documento aprovado exige texto." });
    }
  });

const businessFieldSchema = z
  .object({ value: z.string().trim().min(1).nullable(), status: contentStatusSchema })
  .refine((f) => f.status === "pendente" || f.value !== null, {
    message: "Campo aprovado exige valor.",
  });

export const businessInfoSchema = z.object({
  legalName: businessFieldSchema,
  taxId: businessFieldSchema,
  contactEmail: businessFieldSchema,
  supportHours: businessFieldSchema,
  responseTime: businessFieldSchema,
});

export const publishedReviewSchema = z
  .object({
    id: z.string().regex(/^\d{4}-\d{2}-\d{2}-\d{2}$/, "Id no formato aaaa-mm-dd-nn."),
    productSlug: z.literal("planner-2027"),
    rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
    comment: z.string().trim().min(20).max(1500),
    publicName: z.string().trim().min(2).max(60),
    submittedOn: isoDate,
    publishedOn: isoDate,
    /** FR-030: só avaliações com compra confirmada existem neste arquivo. */
    verifiedPurchase: z.literal(true),
  })
  .superRefine((r, ctx) => {
    if (r.publishedOn < r.submittedOn) {
      ctx.addIssue({
        code: "custom",
        path: ["publishedOn"],
        message: "Publicação antes do envio.",
      });
    }
    if (contemDadoDeContato(r.comment)) {
      ctx.addIssue({
        code: "custom",
        path: ["comment"],
        message: "O comentário não pode conter e-mail ou telefone.",
      });
    }
    if (contemDadoDeContato(r.publicName)) {
      ctx.addIssue({
        code: "custom",
        path: ["publicName"],
        message: "O nome público não pode conter e-mail ou telefone.",
      });
    }
  });

const homeItemSchema = z.object({
  id: z.string().regex(KEBAB),
  title: copySchema,
  description: copySchema,
});

export const homeContentSchema = z.object({
  hero: z.object({ title: copySchema, proposition: copySchema, ctaLabel: z.string().min(1) }),
  benefits: z.array(homeItemSchema),
  howItWorks: z.array(homeItemSchema),
  seo: z.object({ title: z.string().min(1), description: z.string().min(1).max(160) }),
});

export const navItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().startsWith("/"),
});

export const siteSettingsSchema = z.object({
  brandName: z.literal("Novera"),
  tagline: copySchema,
  nav: z.array(navItemSchema),
  footer: z.array(navItemSchema),
});

export const routeEntrySchema = z.object({
  path: z.string().startsWith("/"),
  indexable: z.boolean(),
});

export const siteContentSchema = z
  .object({
    site: siteSettingsSchema,
    home: homeContentSchema,
    product: productSchema,
    faq: z.array(faqItemSchema),
    legal: z.object({
      privacidade: legalPageSchema,
      termos: legalPageSchema,
      "informacoes-comerciais": legalPageSchema,
    }),
    business: businessInfoSchema,
    reviews: z.array(publishedReviewSchema),
    routes: z.array(routeEntrySchema),
  })
  .superRefine((c, ctx) => {
    const ids = new Set<string>();
    c.reviews.forEach((r, i) => {
      if (ids.has(r.id)) {
        ctx.addIssue({
          code: "custom",
          path: ["reviews", i, "id"],
          message: `Id de avaliação repetido: ${r.id}`,
        });
      }
      ids.add(r.id);
    });
  });
