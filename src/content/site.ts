import type { SiteSettings } from "./types";

/** Configuração global: marca, navegação e rodapé (contracts/rotas-e-componentes.md §2). */
export const site: SiteSettings = {
  brandName: "Novera",
  tagline: {
    text: "Produtos digitais para organizar o dia a dia com simplicidade e elegância.",
    status: "pendente", // P-10: redação final a aprovar
  },
  nav: [
    { label: "Planner 2027", href: "/planner-2027" },
    { label: "Demonstração", href: "/#demonstracao" },
    { label: "Dúvidas", href: "/faq" },
    { label: "Contato", href: "/contato" },
  ],
  footer: [
    { label: "Contato", href: "/contato" },
    { label: "Dúvidas", href: "/faq" },
    { label: "Política de privacidade", href: "/privacidade" },
    { label: "Termos", href: "/termos" },
    { label: "Informações comerciais", href: "/informacoes-comerciais" },
  ],
};
