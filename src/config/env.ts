import { z } from "zod";

/**
 * Variáveis de ambiente (contracts/ambiente.md, Constitution VI).
 * - `publicEnv`: só NEXT_PUBLIC_*, seguro para o navegador (inlined no build).
 * - `getServerEnv()`: segredos, lidos SÓ no servidor e em tempo de execução.
 */

const vazioParaUndefined = (v: unknown) => (v === "" ? undefined : v);

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.preprocess(vazioParaUndefined, z.url().default("http://localhost:3000")),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.preprocess(vazioParaUndefined, z.string().min(1).optional()),
  NEXT_PUBLIC_SALES_OVERRIDE: z.preprocess(vazioParaUndefined, z.literal("nao-abertas").optional()),
});

// Acesso explícito a cada variável: o Next só substitui NEXT_PUBLIC_* escritas por extenso.
export const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_SALES_OVERRIDE: process.env.NEXT_PUBLIC_SALES_OVERRIDE,
});

export const SITE_URL = publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

const serverSchema = z.object({
  TURNSTILE_SECRET_KEY: z.preprocess(vazioParaUndefined, z.string().min(1).optional()),
  RESEND_API_KEY: z.preprocess(vazioParaUndefined, z.string().min(1).optional()),
  MAIL_TRANSPORT: z.preprocess(
    vazioParaUndefined,
    z.enum(["smtp", "resend", "fake"]).default("fake"),
  ),
  /** Remetente: qualquer endereço ("email@x" ou "Nome <email@x>"), sem domínio fixo. */
  MAIL_FROM: z.preprocess(vazioParaUndefined, z.string().min(3).optional()),
  // SMTP (MAIL_TRANSPORT=smtp): qualquer provedor (Gmail, Outlook, Zoho, domínio próprio…).
  SMTP_HOST: z.preprocess(vazioParaUndefined, z.string().min(1).optional()),
  SMTP_PORT: z.preprocess(vazioParaUndefined, z.coerce.number().int().positive().default(465)),
  SMTP_SECURE: z.preprocess(vazioParaUndefined, z.enum(["true", "false"]).optional()),
  SMTP_USER: z.preprocess(vazioParaUndefined, z.string().min(1).optional()),
  SMTP_PASSWORD: z.preprocess(vazioParaUndefined, z.string().min(1).optional()),
  NOVERA_INBOX_EMAIL: z.preprocess(vazioParaUndefined, z.email().optional()),
  FORM_SIGNING_SECRET: z.preprocess(
    vazioParaUndefined,
    z.string().min(32, "FORM_SIGNING_SECRET precisa de 32+ caracteres.").optional(),
  ),
  FAKE_MAIL_DIR: z.preprocess(vazioParaUndefined, z.string().default(".tmp/fake-mail")),
  NOVERA_PUBLICACAO_OFICIAL: z.preprocess(vazioParaUndefined, z.enum(["true", "false"]).optional()),
});

export type ServerEnv = z.infer<typeof serverSchema>;

/** Lê e valida as variáveis de servidor. Chame só em código de servidor. */
export function getServerEnv(source: NodeJS.ProcessEnv = process.env): ServerEnv {
  return serverSchema.parse(source);
}

/** Variáveis obrigatórias em produção oficial, qualquer que seja o transporte (contracts/ambiente.md). */
export const VARIAVEIS_OBRIGATORIAS_PRODUCAO = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  "TURNSTILE_SECRET_KEY",
  "MAIL_TRANSPORT",
  "MAIL_FROM",
  "NOVERA_INBOX_EMAIL",
  "FORM_SIGNING_SECRET",
] as const;

/** Variáveis extras exigidas por transporte de e-mail. */
export const VARIAVEIS_POR_TRANSPORTE: Record<string, readonly string[]> = {
  smtp: ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD"],
  resend: ["RESEND_API_KEY"],
};

/** Variáveis de build (presentes no CI de deploy); as demais são segredos do Worker. */
export const VARIAVEIS_DE_BUILD = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  "MAIL_TRANSPORT",
] as const;

/**
 * Lista as variáveis obrigatórias ausentes (vazias contam como ausentes).
 * `somenteBuild`: no deploy pelo CI, os segredos ficam só no Worker (contracts/ambiente.md) e
 * são conferidos à parte (`npx wrangler secret list`, checklist de publicação).
 */
export function listMissingProductionEnv(
  source: NodeJS.ProcessEnv = process.env,
  { somenteBuild = false }: { somenteBuild?: boolean } = {},
): string[] {
  const transporte = source.MAIL_TRANSPORT?.trim() ?? "";
  const lista: readonly string[] = somenteBuild
    ? VARIAVEIS_DE_BUILD
    : [...VARIAVEIS_OBRIGATORIAS_PRODUCAO, ...(VARIAVEIS_POR_TRANSPORTE[transporte] ?? [])];
  return lista.filter((nome) => !source[nome]?.trim());
}
