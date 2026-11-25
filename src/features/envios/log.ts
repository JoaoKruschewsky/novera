/**
 * Registro de observabilidade (contrato de envio, passo 7).
 * NUNCA inclui e-mail, nome ou texto da pessoa (LGPD, Constitution VI).
 */
export interface SubmissionLog {
  action: "submitReview" | "submitFeedback";
  outcome: "success" | "honeypot" | "invalid" | "verificacao" | "envio" | "limite";
  reason?: string;
  durationMs: number;
}

export function logSubmission(entry: SubmissionLog): void {
  console.info(JSON.stringify({ evento: "envio-formulario", ...entry }));
}
