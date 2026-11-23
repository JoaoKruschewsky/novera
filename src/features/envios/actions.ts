"use server";

/**
 * Server Actions dos formulários (contracts/envio-formularios.md).
 * Únicas execuções de servidor do MVP (research R-02).
 */
import { headers } from "next/headers";
import { getServerEnv } from "@/config/env";
import { getSiteContent } from "@/content";
import { issueFormToken } from "./form-token";
import { createTransport } from "./mail";
import { buildFeedbackEmail, buildReviewEmail } from "./mail/templates";
import { processSubmission, type PipelineDeps } from "./pipeline";
import type { SubmissionResult } from "./result";
import { feedbackSchema, reviewSchema } from "./schemas";
import { verifyTurnstile } from "./turnstile";

const EM_DESENVOLVIMENTO = process.env.NODE_ENV !== "production";
/** Só fora de produção: segredos de desenvolvimento e a chave de teste "sempre aprova". */
const DEV_FORM_SECRET = "segredo-de-desenvolvimento-local-nao-usar-em-producao";
const TURNSTILE_TESTE_APROVA = "1x0000000000000000000000000000000AA";

function formSecret(): string | null {
  const env = getServerEnv();
  return env.FORM_SIGNING_SECRET ?? (EM_DESENVOLVIMENTO ? DEV_FORM_SECRET : null);
}

/**
 * Emite o token assinado no momento em que o formulário é exibido.
 * As páginas são estáticas, então o token não pode ser gerado no build (expiraria).
 */
export async function getFormToken(): Promise<string | null> {
  const secret = formSecret();
  return secret ? issueFormToken(secret) : null;
}

async function deps(): Promise<PipelineDeps | null> {
  const env = getServerEnv();
  const secret = formSecret();
  const turnstileSecret =
    env.TURNSTILE_SECRET_KEY ?? (EM_DESENVOLVIMENTO ? TURNSTILE_TESTE_APROVA : null);
  const inbox = env.NOVERA_INBOX_EMAIL ?? (EM_DESENVOLVIMENTO ? "caixa-dev@example.com" : null);
  const from = env.MAIL_FROM ?? (EM_DESENVOLVIMENTO ? "Site Novera <no-reply@example.com>" : null);
  if (!secret || !turnstileSecret || !inbox || !from) {
    console.error(JSON.stringify({ evento: "envio-formulario", erro: "configuracao-incompleta" }));
    return null;
  }
  let transport: PipelineDeps["transport"];
  try {
    transport = createTransport(env);
  } catch {
    console.error(
      JSON.stringify({ evento: "envio-formulario", erro: "transporte-mal-configurado" }),
    );
    return null;
  }
  const h = await headers();
  const ip = h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const { business } = getSiteContent();
  return {
    transport,
    formSecret: secret,
    verifyTurnstile: (token) => verifyTurnstile(token, turnstileSecret, ip),
    inbox,
    from,
    supportEmail: business.contactEmail.status === "aprovado" ? business.contactEmail.value : null,
  };
}

const FALHA_DE_CONFIGURACAO = (formData: FormData): SubmissionResult => ({
  status: "error",
  reason: "envio",
  message: "Não foi possível enviar agora. Seu texto foi mantido; tente de novo em alguns minutos.",
  values: Object.fromEntries(
    [...formData.entries()].filter(
      (e): e is [string, string] =>
        typeof e[1] === "string" &&
        !["website", "formToken", "cf-turnstile-response"].includes(e[0]),
    ),
  ),
});

export async function submitFeedback(
  _prev: SubmissionResult,
  formData: FormData,
): Promise<SubmissionResult> {
  const d = await deps();
  if (!d) return FALHA_DE_CONFIGURACAO(formData);
  return processSubmission(
    { action: "submitFeedback", formData, schema: feedbackSchema, buildEmail: buildFeedbackEmail },
    d,
  );
}

export async function submitReview(
  _prev: SubmissionResult,
  formData: FormData,
): Promise<SubmissionResult> {
  const d = await deps();
  if (!d) return FALHA_DE_CONFIGURACAO(formData);
  return processSubmission(
    { action: "submitReview", formData, schema: reviewSchema, buildEmail: buildReviewEmail },
    d,
  );
}
