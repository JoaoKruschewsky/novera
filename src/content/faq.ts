import type { FaqItem } from "./types";

/**
 * Perguntas frequentes (FR-019). As 8 primeiras são obrigatórias e têm id fixo
 * (verificado em tests/unit/faq.test.ts). Respostas `pendente` até a aprovação (P-10).
 * Nunca afirmar compatibilidade não testada (FR-013, US5-3).
 */
export const FAQ_IDS_OBRIGATORIOS = [
  "o-que-e-planner-pdf",
  "precisa-de-aplicativo",
  "como-escrever",
  "como-funcionam-links",
  "celular-ou-tablet",
  "como-recebo",
  "funciona-automaticamente",
  "como-pedir-suporte",
] as const;

export const faq: FaqItem[] = [
  {
    id: "o-que-e-planner-pdf",
    order: 1,
    question: "O que é um planner digital em PDF?",
    answer: {
      text: "É um arquivo PDF organizado como um planner: tem páginas de calendário, meses, semanas e dias, ligadas por links internos. Você abre o arquivo em um aplicativo de leitura e escreve nele à mão.",
      status: "pendente",
    },
  },
  {
    id: "precisa-de-aplicativo",
    order: 2,
    question: "Preciso de algum aplicativo?",
    answer: {
      text: "Sim. O planner não é um aplicativo próprio: ele é usado dentro de um aplicativo de terceiros que abra PDF com links internos e permita escrever ou anotar sobre o arquivo.",
      status: "pendente",
    },
  },
  {
    id: "como-escrever",
    order: 3,
    question: "Como escrevo no planner?",
    answer: {
      text: "Com as ferramentas de escrita ou anotação do aplicativo em que você abrir o PDF, usando caneta digital ou o dedo.",
      status: "pendente",
    },
  },
  {
    id: "como-funcionam-links",
    order: 4,
    question: "Como funcionam os links de navegação?",
    answer: {
      text: "Índices, abas e nomes de meses e dias são links dentro do próprio arquivo. Ao tocar em um deles, o aplicativo abre a página correspondente. Os links funcionam sem internet.",
      status: "pendente",
    },
  },
  {
    id: "celular-ou-tablet",
    order: 5,
    question: "Posso usar no celular ou no tablet?",
    answer: {
      text: "Você precisa de um aparelho com um aplicativo que abra PDF com links internos e permita escrever sobre o arquivo. A lista de aplicativos e aparelhos testados será publicada depois dos testes.",
      status: "pendente",
    },
  },
  {
    id: "como-recebo",
    order: 6,
    question: "Como recebo o produto depois da compra?",
    answer: {
      text: "A entrega é feita pela plataforma de pagamento: depois da confirmação, você recebe no e-mail informado na compra o link para baixar o arquivo PDF.",
      status: "pendente",
    },
  },
  {
    id: "funciona-automaticamente",
    order: 7,
    question: "O planner funciona automaticamente?",
    answer: {
      text: "Não. O planner não tem automações, sincronização nem lembretes. É um arquivo PDF: todo o preenchimento é manual, feito por você.",
      status: "pendente",
    },
  },
  {
    id: "como-pedir-suporte",
    order: 8,
    question: "Como peço suporte?",
    answer: {
      text: "Pela página de contato: escolha o tipo de mensagem, escreva o que aconteceu e informe um e-mail para resposta.",
      status: "pendente",
    },
  },
];
