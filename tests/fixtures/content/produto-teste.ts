import type { Product } from "../../../src/content/types";

/**
 * Segundo produto FICTÍCIO para a revisão de SC-012 (renderizado só em /especime).
 * Nunca publicado. Serve para provar que os componentes aceitam outro produto só com conteúdo novo.
 */
export const produtoTeste: Product = {
  slug: "produto-teste",
  name: "Produto de Teste (fictício)",
  tagline: {
    text: "Texto fictício de teste: um segundo produto com a mesma identidade.",
    status: "pendente",
  },
  description: { text: "Descrição fictícia de teste.", status: "pendente" },
  period: { start: "2027-01", end: "2027-12" },
  format: "pdf-interativo",
  features: [
    {
      id: "item-a",
      title: "Item de teste A",
      description: "Descrição fictícia.",
      verifiedInFile: true,
      status: "pendente",
    },
    {
      id: "item-b",
      title: "Item de teste B",
      description: "Descrição fictícia.",
      verifiedInFile: true,
      status: "pendente",
    },
  ],
  includedContent: [],
  usageGuidance: [],
  navigationExplanation: { text: "Texto fictício.", status: "pendente" },
  limitations: [{ text: "Limitação fictícia de teste.", status: "pendente" }],
  sales: { state: "vendas-nao-abertas", platform: null, checkoutUrl: null, price: null },
  demo: [],
  compatibility: [
    {
      app: "Aplicativo fictício",
      platform: "Dispositivo fictício",
      checks: { internalLinks: true, handwriting: false },
      result: "parcial",
      testedOn: "2027-01-01",
      notes: "registro fictício de teste",
    },
  ],
  generalRequirements: { text: "Requisitos fictícios de teste.", status: "pendente" },
  seo: { title: "Produto de teste", description: "Fictício." },
};
