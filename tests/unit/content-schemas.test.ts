import { describe, expect, it } from "vitest";
import {
  demoMaterialSchema,
  legalPageSchema,
  publishedReviewSchema,
  salesConfigSchema,
} from "@/content/schemas";

const fechadas = {
  state: "vendas-nao-abertas",
  platform: null,
  checkoutUrl: null,
  price: null,
} as const;
const abertas = {
  state: "vendas-abertas",
  platform: "kiwify",
  checkoutUrl: "https://pay.kiwify.com.br/abc",
  price: null,
} as const;

describe("salesConfigSchema", () => {
  it("aceita vendas fechadas sem plataforma nem URL", () => {
    expect(salesConfigSchema.safeParse(fechadas).success).toBe(true);
  });
  it("aceita vendas abertas com URL https em host oficial", () => {
    expect(salesConfigSchema.safeParse(abertas).success).toBe(true);
  });
  it("rejeita vendas abertas sem URL", () => {
    expect(salesConfigSchema.safeParse({ ...abertas, checkoutUrl: null }).success).toBe(false);
  });
  it("rejeita vendas abertas sem plataforma", () => {
    expect(salesConfigSchema.safeParse({ ...abertas, platform: null }).success).toBe(false);
  });
  it("rejeita http", () => {
    expect(
      salesConfigSchema.safeParse({ ...abertas, checkoutUrl: "http://pay.kiwify.com.br/abc" })
        .success,
    ).toBe(false);
  });
  it("rejeita host que não é da plataforma", () => {
    expect(
      salesConfigSchema.safeParse({ ...abertas, checkoutUrl: "https://example.com/abc" }).success,
    ).toBe(false);
    expect(salesConfigSchema.safeParse({ ...abertas, platform: "hotmart" }).success).toBe(false);
  });
});

const review = {
  id: "2027-01-10-01",
  productSlug: "planner-2027",
  rating: 4,
  comment: "Um comentário real com mais de vinte caracteres.",
  publicName: "Ana S.",
  submittedOn: "2027-01-10",
  publishedOn: "2027-01-12",
  verifiedPurchase: true,
} as const;

describe("publishedReviewSchema", () => {
  it("aceita avaliação válida", () => {
    expect(publishedReviewSchema.safeParse(review).success).toBe(true);
  });
  it.each([
    ["nota 0", { rating: 0 }],
    ["nota 6", { rating: 6 }],
    ["nota fracionária", { rating: 4.5 }],
    ["comentário curto", { comment: "curto" }],
    ["comentário com e-mail", { comment: "Gostei muito, escreva para ana@exemplo.com depois." }],
    ["comentário com telefone", { comment: "Gostei muito, me liga em 71 99999-8888 por favor." }],
    ["nome com e-mail", { publicName: "ana@exemplo.com" }],
    ["compra não verificada", { verifiedPurchase: false }],
    ["publicação antes do envio", { publishedOn: "2027-01-01" }],
    ["id fora do formato", { id: "abc" }],
  ])("rejeita %s", (_nome, patch) => {
    expect(publishedReviewSchema.safeParse({ ...review, ...patch }).success).toBe(false);
  });
});

describe("demoMaterialSchema", () => {
  const imagem = {
    id: "diario",
    kind: "imagem",
    src: "/media/planner-2027/diario",
    width: 1600,
    height: 1200,
    alt: "Página diária do planner com horários",
    caption: "Página diária",
    section: "diario",
    status: "aprovado",
  } as const;
  it("aceita imagem", () => expect(demoMaterialSchema.safeParse(imagem).success).toBe(true));
  it("rejeita vídeo sem poster e equivalente textual", () => {
    expect(
      demoMaterialSchema.safeParse({ ...imagem, kind: "video", src: "/media/planner-2027/v.mp4" })
        .success,
    ).toBe(false);
  });
});

describe("legalPageSchema", () => {
  const base = {
    kind: "termos",
    title: "Termos",
    description: "d",
    body: [],
    requiredTopics: [],
    status: "pendente",
    effectiveDate: null,
  } as const;
  it("aceita documento pendente vazio", () =>
    expect(legalPageSchema.safeParse(base).success).toBe(true));
  it("rejeita aprovado sem data de vigência", () => {
    expect(
      legalPageSchema.safeParse({
        ...base,
        status: "aprovado",
        body: [{ type: "paragraph", text: "x" }],
      }).success,
    ).toBe(false);
  });
});
