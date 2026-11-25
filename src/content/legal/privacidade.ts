import type { LegalPage } from "../types";

/**
 * Política de privacidade (P-06). Texto jurídico a ser redigido e aprovado pela Novera;
 * NÃO inventar. Enquanto `pendente`, a página mostra "Documento em preparação".
 */
export const privacidade: LegalPage = {
  kind: "privacidade",
  title: "Política de privacidade",
  description: "Como a Novera trata os dados pessoais enviados pelos formulários do site.",
  body: [],
  requiredTopics: [
    "Finalidade de cada formulário: avaliação (verificação de compra e moderação) e feedback privado (atendimento e suporte)",
    "Dados coletados em cada formulário (nota, comentário, nome público, e-mail da compra; tipo, mensagem, e-mail para resposta, nome opcional)",
    "Operadores: Cloudflare (hospedagem e antispam Turnstile) e Resend (envio de e-mail)",
    "Transferência internacional de dados para esses operadores",
    "Retenção: exclusão manual em até 6 meses após a conclusão do atendimento ou da decisão de moderação (FR-036c)",
    "Dados que ficam públicos em avaliações publicadas (nome público, nota, comentário e data)",
    "Direitos do titular (LGPD) e pedido de exclusão antecipada pela página /contato",
    "Ausência de cookies de rastreamento e de analytics",
  ],
  status: "pendente",
  effectiveDate: null,
};
