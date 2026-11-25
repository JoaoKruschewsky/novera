/**
 * Sequência de processamento comum às duas Server Actions (contracts/envio-formularios.md):
 * honeypot → token → Turnstile → Zod → normalização → e-mail → registro.
 * Todas as dependências externas são injetadas, para teste.
 */
import type { z } from "zod";
import { verifyFormToken } from "./form-token";
import { logSubmission, type SubmissionLog } from "./log";
import type { EmailContent } from "./mail/templates";
import type { MailResult, MailTransport } from "./mail/transport";
import { normalizeText } from "./normalize";
import type { FormValues, SubmissionResult } from "./result";

/** Campos técnicos que nunca voltam para o formulário. */
const CAMPOS_TECNICOS = new Set(["website", "formToken", "cf-turnstile-response"]);
/** Campos de texto longo: mantêm quebras de linha. */
const MULTILINHA = new Set(["message", "comment"]);

export const MENSAGENS = {
  verificacao: "Não foi possível validar o envio. Recarregue a página e tente de novo.",
  turnstile: "Não conseguimos confirmar que o envio é de uma pessoa. Tente novamente.",
  envio: "Não foi possível enviar agora. Seu texto foi mantido; tente de novo em alguns minutos.",
  limite: (emailSuporte: string | null) =>
    emailSuporte
      ? `Recebemos muitos envios hoje. Tente novamente amanhã ou escreva para ${emailSuporte}.`
      : "Recebemos muitos envios hoje. Seu texto foi mantido; tente novamente amanhã.",
} as const;

export interface PipelineDeps {
  transport: MailTransport;
  formSecret: string;
  verifyTurnstile: (token: string) => Promise<boolean>;
  inbox: string;
  from: string;
  supportEmail: string | null;
  now?: () => Date;
}

export interface PipelineInput<S extends z.ZodType> {
  action: SubmissionLog["action"];
  formData: FormData;
  schema: S;
  buildEmail: (data: z.infer<S>, now: Date) => EmailContent;
}

/** Valores digitados (strings), normalizados, para devolver ao formulário. */
export function extractValues(formData: FormData): FormValues {
  const values: FormValues = {};
  for (const [k, v] of formData.entries()) {
    if (CAMPOS_TECNICOS.has(k) || typeof v !== "string") continue;
    values[k] = normalizeText(v, { multiline: MULTILINHA.has(k) });
  }
  return values;
}

export async function processSubmission<S extends z.ZodType>(
  { action, formData, schema, buildEmail }: PipelineInput<S>,
  deps: PipelineDeps,
): Promise<SubmissionResult> {
  const inicio = Date.now();
  const fim = (outcome: SubmissionLog["outcome"], reason?: string) =>
    logSubmission({ action, outcome, reason, durationMs: Date.now() - inicio });
  const values = extractValues(formData);

  // 1. Honeypot: sucesso aparente, sem enviar nada.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    fim("honeypot");
    return { status: "success" };
  }

  // 2. Token de formulário (HMAC + tempo mínimo).
  const token = formData.get("formToken");
  const check = await verifyFormToken(typeof token === "string" ? token : "", deps.formSecret);
  if (!check.ok) {
    fim("verificacao", `token-${check.reason}`);
    return { status: "error", reason: "verificacao", message: MENSAGENS.verificacao, values };
  }

  // 3. Turnstile.
  const turnstile = formData.get("cf-turnstile-response");
  if (!(await deps.verifyTurnstile(typeof turnstile === "string" ? turnstile : ""))) {
    fim("verificacao", "turnstile");
    return { status: "error", reason: "verificacao", message: MENSAGENS.turnstile, values };
  }

  // 4. Validação (fonte da verdade) sobre os valores já normalizados (5).
  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const campo = String(issue.path[0] ?? "formulario");
      fieldErrors[campo] ??= issue.message;
    }
    fim("invalid");
    return { status: "invalid", fieldErrors, values };
  }

  // 6. Encaminhamento por e-mail.
  const now = deps.now?.() ?? new Date();
  const email = buildEmail(parsed.data, now);
  // Uma exceção do transporte nunca vira erro 500: é tratada como falha de envio (FR-036b).
  const res = await deps.transport
    .send({
      to: deps.inbox,
      from: deps.from,
      replyTo: email.replyTo,
      subject: email.subject,
      text: email.text,
    })
    .catch((): MailResult => ({ ok: false, kind: "other" }));
  if (res.ok) {
    fim("success");
    return { status: "success" };
  }
  if (res.kind === "quota") {
    fim("limite");
    return {
      status: "error",
      reason: "limite",
      message: MENSAGENS.limite(deps.supportEmail),
      values,
    };
  }
  fim("envio");
  return { status: "error", reason: "envio", message: MENSAGENS.envio, values };
}
