import type { ServerEnv } from "@/config/env";
import { FakeTransport } from "./fake";
import { ResendTransport } from "./resend";
import { SmtpTransport } from "./smtp";
import type { MailTransport } from "./transport";

/** Seleciona o transporte por MAIL_TRANSPORT (contracts/ambiente.md). */
export function createTransport(env: ServerEnv): MailTransport {
  if (env.MAIL_TRANSPORT === "smtp") {
    if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD) {
      throw new Error(
        "SMTP_HOST, SMTP_USER e SMTP_PASSWORD são obrigatórios com MAIL_TRANSPORT=smtp.",
      );
    }
    return new SmtpTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      // Sem SMTP_SECURE explícito: TLS direto na 465, STARTTLS nas demais (587).
      secure: env.SMTP_SECURE ? env.SMTP_SECURE === "true" : env.SMTP_PORT === 465,
      user: env.SMTP_USER,
      password: env.SMTP_PASSWORD,
    });
  }
  if (env.MAIL_TRANSPORT === "resend") {
    if (!env.RESEND_API_KEY) throw new Error("RESEND_API_KEY ausente com MAIL_TRANSPORT=resend.");
    return new ResendTransport(env.RESEND_API_KEY);
  }
  return new FakeTransport(env.FAKE_MAIL_DIR);
}
