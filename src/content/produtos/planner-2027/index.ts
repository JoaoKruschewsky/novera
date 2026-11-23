import type { Feature, Product } from "../../types";
import { compatibility, generalRequirements } from "./compatibilidade";
import { demo } from "./demonstracao";

/**
 * Novera Planner Digital 2027 (data-model.md §1.2).
 *
 * TODOS os textos estão `pendente` até a aprovação da redação final (P-10).
 * Cada `Feature` só é exibida com `verifiedInFile: true`, depois de conferida contra o PDF
 * real (FR-006, SC-003). Não marque `verifiedInFile` sem abrir o arquivo final.
 */
const feature = (id: string, title: string, description: string): Feature => ({
  id,
  title,
  description,
  verifiedInFile: false,
  status: "pendente",
});

export const product: Product = {
  slug: "planner-2027",
  name: "Novera Planner Digital 2027",
  tagline: {
    text: "Um planner em PDF interativo para organizar 2027 com calma, página por página.",
    status: "pendente",
  },
  description: {
    text: "O Planner 2027 é um arquivo PDF interativo, datado de janeiro a dezembro de 2027. Você navega entre as páginas por links internos e escreve à mão em um aplicativo de leitura e anotação.",
    status: "pendente",
  },
  period: { start: "2027-01", end: "2027-12" },
  format: "pdf-interativo",
  // FR-004: itens a confirmar contra o arquivo real (T141).
  features: [
    feature(
      "navegacao-por-links",
      "Navegação por links internos",
      "Índices e abas levam direto ao mês, à semana ou ao dia que você procura.",
    ),
    feature("paginas-diarias", "Páginas diárias", "Um espaço para cada dia do ano."),
    feature(
      "paginas-semanais",
      "Páginas semanais",
      "Visão da semana para distribuir compromissos e tarefas.",
    ),
    feature(
      "paginas-mensais",
      "Páginas mensais",
      "Visão do mês inteiro para planejar com antecedência.",
    ),
    feature("prioridades", "Prioridades", "Área para destacar o que importa em cada período."),
    feature("compromissos", "Compromissos", "Espaço para registrar horários e eventos."),
    feature("tarefas", "Tarefas", "Listas para acompanhar o que precisa ser feito."),
    feature("metas", "Metas", "Páginas para definir e acompanhar metas."),
    feature(
      "financas",
      "Finanças",
      "Páginas para anotar entradas, saídas e planejamento financeiro.",
    ),
    feature("organizacao", "Organização", "Páginas de apoio para organizar listas e rotinas."),
    feature("anotacoes", "Anotações", "Páginas livres para notas."),
    feature(
      "escrita-manual",
      "Espaço para escrita manual",
      "Áreas amplas para escrever com caneta digital ou com o dedo.",
    ),
  ],
  includedContent: [
    { text: "Calendário de janeiro a dezembro de 2027.", status: "pendente" },
    { text: "Páginas mensais, semanais e diárias ligadas entre si.", status: "pendente" },
    { text: "Seções de metas, finanças, organização e anotações.", status: "pendente" },
  ],
  usageGuidance: [
    {
      text: "Depois da compra, baixe o arquivo PDF pelo link enviado pela plataforma de pagamento.",
      status: "pendente",
    },
    {
      text: "Importe o PDF em um aplicativo que abra links internos e permita escrever ou anotar sobre o arquivo.",
      status: "pendente",
    },
    {
      text: "Use os índices e as abas para ir direto à data desejada; volte ao índice pelo mesmo caminho.",
      status: "pendente",
    },
    {
      text: "Guarde uma cópia do arquivo original antes de começar a escrever.",
      status: "pendente",
    },
  ],
  navigationExplanation: {
    text: "Os índices, as abas laterais e os nomes de meses e dias são links. Ao tocar em um deles, o aplicativo de leitura abre a página correspondente dentro do mesmo arquivo, sem internet e sem sair do PDF.",
    status: "pendente",
  },
  limitations: [
    {
      text: "É um arquivo PDF, não um aplicativo: não tem sincronização, lembretes nem automações. Todo o preenchimento é manual.",
      status: "pendente",
    },
  ],
  sales: {
    state: "vendas-nao-abertas", // P-01, P-02: só muda por PR com plataforma e URL válidas
    platform: null,
    checkoutUrl: null,
    price: null, // P-03: exibido só com status aprovado
  },
  demo,
  compatibility,
  generalRequirements,
  seo: {
    title: "Planner Digital 2027",
    description:
      "Detalhes do Novera Planner Digital 2027: PDF interativo de janeiro a dezembro de 2027, conteúdo incluído, navegação e compatibilidade.",
  },
};
