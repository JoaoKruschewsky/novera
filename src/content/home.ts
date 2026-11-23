import type { HomeContent } from "./types";

/**
 * Textos da página inicial (FR-001, FR-007, FR-008). Todos `pendente` até a aprovação (P-10).
 * Proibido: promessas de produtividade garantida, transformação de vida ou resultados (US1-4).
 * Os textos de /planner-2027 ficam em produtos/planner-2027 e NÃO repetem estes (US4-4).
 */
export const home: HomeContent = {
  hero: {
    title: {
      text: "Produtos digitais para organizar o dia a dia com simplicidade e elegância.",
      status: "pendente",
    },
    proposition: {
      text: "O primeiro é o Novera Planner Digital 2027: um planner em PDF interativo para escrever o seu ano à mão.",
      status: "pendente",
    },
    ctaLabel: "Conhecer o Planner 2027",
  },
  benefits: [
    {
      id: "paginas-especificas",
      title: { text: "Cada assunto no seu lugar", status: "pendente" },
      description: {
        text: "Prioridades, compromissos, tarefas, metas e finanças em páginas próprias.",
        status: "pendente",
      },
    },
    {
      id: "navegacao-facil",
      title: { text: "Navegação em um toque", status: "pendente" },
      description: {
        text: "Links internos levam do índice ao mês, à semana ou ao dia sem rolar o arquivo inteiro.",
        status: "pendente",
      },
    },
    {
      id: "espaco-de-escrita",
      title: { text: "Espaço amplo para escrever", status: "pendente" },
      description: {
        text: "Áreas pensadas para a escrita à mão, com caneta digital ou com o dedo.",
        status: "pendente",
      },
    },
    {
      id: "diferentes-periodos",
      title: { text: "Do ano ao dia", status: "pendente" },
      description: {
        text: "Planeje o ano, o mês, a semana e o dia no mesmo arquivo.",
        status: "pendente",
      },
    },
    {
      id: "estetica-discreta",
      title: { text: "Estética discreta e funcional", status: "pendente" },
      description: {
        text: "Um visual calmo, que deixa o foco no que você escreve.",
        status: "pendente",
      },
    },
  ],
  howItWorks: [
    {
      id: "comprar",
      title: { text: "Compre", status: "pendente" },
      description: {
        text: "A compra é feita na plataforma de pagamento oficial.",
        status: "pendente",
      },
    },
    {
      id: "baixar",
      title: { text: "Receba e baixe o PDF", status: "pendente" },
      description: { text: "O arquivo chega pelo e-mail informado na compra.", status: "pendente" },
    },
    {
      id: "importar",
      title: { text: "Importe em um aplicativo compatível", status: "pendente" },
      description: {
        text: "Use um aplicativo que abra PDF interativo e permita escrita manual.",
        status: "pendente",
      },
    },
    {
      id: "preencher",
      title: { text: "Navegue e preencha", status: "pendente" },
      description: {
        text: "Toque nos links para ir às páginas e escreva à mão.",
        status: "pendente",
      },
    },
  ],
  seo: {
    title: "Novera — Planner Digital 2027",
    description:
      "Novera cria produtos digitais para organizar o dia a dia. Conheça o Planner Digital 2027, um planner em PDF interativo.",
  },
};
