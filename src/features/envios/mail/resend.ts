import { Resend } from "resend";
import type { MailMessage, MailResult, MailTransport } from "./transport";

const ERROS_DE_COTA = new Set([
  "daily_quota_exceeded",
  "monthly_quota_exceeded",
  "rate_limit_exceeded",
]);

/** Transporte de produção (research R-08). Texto puro, sem rastreamento, tempo limite de 8 s. */
export class ResendTransport implements MailTransport {
  private readonly client: Resend;

  constructor(apiKey: string) {
    this.client = new Resend(apiKey);
  }

  async send(message: MailMessage): Promise<MailResult> {
    const limite = new Promise<MailResult>((resolve) =>
      setTimeout(() => resolve({ ok: false, kind: "other" }), 8_000),
    );
    const envio = this.client.emails
      .send({
        from: message.from,
        to: message.to,
        replyTo: message.replyTo,
        subject: message.subject,
        text: message.text,
      })
      .then(({ error }): MailResult => {
        if (!error) return { ok: true };
        return { ok: false, kind: ERROS_DE_COTA.has(error.name) ? "quota" : "other" };
      })
      .catch((): MailResult => ({ ok: false, kind: "other" }));
    return Promise.race([envio, limite]);
  }
}
