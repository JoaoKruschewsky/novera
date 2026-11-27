import type { DemoMaterial, FreeSample } from "../../types";

/**
 * Materiais de demonstração do Planner 2027 (FR-009, research R-15), fornecidos e aprovados pelo
 * responsável em 2026-11-24: vídeo de apresentação, fotos do planner em tablet e a prévia em PDF.
 *
 * Como registrar uma nova imagem:
 * 1. Salve o original em media-originais/planner-2027/<id>.png.
 * 2. Rode `npm run images:otimizar` (gera AVIF/WebP 640/1080/1600 em public/media/planner-2027/).
 * 3. Adicione a entrada abaixo com a largura e a altura impressas pelo script.
 * O build falha se um material aprovado não existir em public/.
 * Os textos alternativos descrevem só o que aparece de fato em cada material.
 */
export const demo: DemoMaterial[] = [
  {
    id: "apresentacao",
    kind: "video",
    src: "/media/planner-2027/apresentacao.mp4",
    poster: "/media/planner-2027/apresentacao-poster.webp",
    width: 1600,
    height: 900,
    alt: "Vídeo de apresentação do Planner Digital 2027 em um tablet",
    caption: "Apresentação do Planner Digital 2027 (25 s)",
    section: "navegacao",
    textEquivalent:
      "O vídeo mostra o Planner Digital 2027 aberto em um tablet, ao lado de uma caneta: a capa, o calendário de janeiro de 2027 (“Seu mês, com clareza”), a página diária com três prioridades, compromissos, tarefas e anotações, a página da semana (“Espaço para planejar sua rotina”) e a folha de anotações (“Um espaço para suas ideias”). Termina com “Seu planejamento começa aqui”.",
    status: "aprovado",
  },
  {
    id: "tablet-mensal",
    kind: "imagem",
    src: "/media/planner-2027/tablet-mensal",
    width: 1536,
    height: 1024,
    alt: "Tablet com a página Meu Mês aberta: calendário de janeiro de 2027 com os dias da semana e botões Metas do mês e Organização",
    caption: "Meu Mês: calendário de janeiro de 2027",
    section: "mensal",
    status: "aprovado",
  },
  {
    id: "tablet-diario",
    kind: "imagem",
    src: "/media/planner-2027/tablet-diario",
    width: 1536,
    height: 1024,
    alt: "Tablet com a página Meu Dia de 4 de janeiro: três prioridades, compromissos, lista de tarefas e anotações",
    caption: "Meu Dia: prioridades, compromissos, tarefas e anotações",
    section: "diario",
    status: "aprovado",
  },
  {
    id: "tablet-semanal",
    kind: "imagem",
    src: "/media/planner-2027/tablet-semanal",
    width: 1536,
    height: 1024,
    alt: "Tablet em um suporte com a página Minha Semana: semana 2, de 4 a 10 de janeiro, com espaço pautado para cada dia",
    caption: "Minha Semana: um espaço para cada dia",
    section: "semanal",
    status: "aprovado",
  },
  {
    id: "tablet-financas",
    kind: "imagem",
    src: "/media/planner-2027/tablet-financas",
    width: 1536,
    height: 1024,
    alt: "Tablet com a página Finanças de janeiro, para registros, despesas, orçamento e observações em linhas pautadas",
    caption: "Finanças: registros, despesas e orçamento do mês",
    section: "financas",
    status: "aprovado",
  },
  {
    id: "tablet-anotacoes",
    kind: "imagem",
    src: "/media/planner-2027/tablet-anotacoes",
    width: 1536,
    height: 1024,
    alt: "Tablet com uma folha de anotações pautada e botões de navegação Início, anterior e próximo",
    caption: "Anotações: folha pautada para escrever livremente",
    section: "anotacoes",
    status: "aprovado",
  },
];

/** Prévia gratuita: amostra de 5 páginas do PDF interativo para testar no app de anotações. */
export const freeSample: FreeSample = {
  src: "/media/planner-2027/novera-planner-2027-previa.pdf",
  pages: 5,
  sizeKb: 100,
  status: "aprovado",
};
