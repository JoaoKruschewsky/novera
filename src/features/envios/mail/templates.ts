/**
 * Montagem dos e-mails para a equipe Novera (contracts/encaminhamento-email.md).
 * Texto puro: nada é interpretado como HTML.
 */
import { formatDateTimeBrasilia } from "@/lib/format";
import { FEEDBACK_TIPOS, type FeedbackData, type ReviewData } from "../schemas";

export interface EmailContent {
  subject: string;
  text: string;
  replyTo: string;
}

/** Remove quebras de linha do assunto (evita injeção de cabeçalho). */
function linhaUnica(valor: string): string {
  return valor.replace(/[\r\n]+/g, " ").trim();
}

export function buildReviewEmail(data: ReviewData, now: Date): EmailContent {
  return {
    subject: linhaUnica(`[Novera][Avaliação] Nota ${data.rating} — ${data.publicName}`),
    replyTo: data.purchaseEmail,
    text: [
      "Nova avaliação recebida pelo site (NÃO publicada).",
      "",
      "Produto: Novera Planner Digital 2027",
      `Nota: ${data.rating} de 5`,
      `Nome público desejado: ${data.publicName}`,
      `E-mail usado na compra (verificar no painel do checkout): ${data.purchaseEmail}`,
      "Autorização de publicação: sim",
      `Data de envio: ${formatDateTimeBrasilia(now)}`,
      "",
      "Comentário:",
      data.comment,
      "",
      "---",
      "Próximos passos:",
      "1. Confirmar a compra pelo e-mail no painel da plataforma de checkout.",
      "2. Moderar (spam, abuso, dados pessoais, relação com o produto). Nota baixa NÃO é motivo de rejeição.",
      "3. Se aprovada, adicionar em src/content/avaliacoes.ts via Pull Request (sem o e-mail).",
      "Excluir este e-mail até 6 meses após a decisão (política de privacidade).",
    ].join("\n"),
  };
}

export function buildFeedbackEmail(data: FeedbackData, now: Date): EmailContent {
  const tipo = FEEDBACK_TIPOS[data.type];
  const inicio = linhaUnica(data.message).slice(0, 50);
  return {
    subject: linhaUnica(`[Novera][Feedback][${tipo.curto}] ${inicio}`),
    replyTo: data.replyEmail,
    text: [
      "Nova mensagem de feedback privado (NUNCA publicar sem consentimento explícito do autor).",
      "",
      `Tipo: ${tipo.longo}`,
      `Nome (opcional): ${data.name || "(não informado)"}`,
      `E-mail para resposta: ${data.replyEmail}`,
      `Data de envio: ${formatDateTimeBrasilia(now)}`,
      "",
      "Mensagem:",
      data.message,
      "",
      "---",
      'Responda usando "Responder" (vai para o e-mail da pessoa).',
      "Excluir este e-mail até 6 meses após a conclusão do atendimento.",
    ].join("\n"),
  };
}
