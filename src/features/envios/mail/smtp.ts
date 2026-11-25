import type { MailMessage, MailResult, MailTransport } from "./transport";

/**
 * Transporte SMTP agnóstico de provedor: Gmail, Outlook, Zoho, domínio próprio etc.
 * Basta o servidor SMTP, a porta e as credenciais da caixa remetente; MAIL_FROM aceita
 * qualquer endereço ("email@x" ou "Nome <email@x>").
 *
 * Usa `nodemailer` tanto no Node (desenvolvimento) quanto no Cloudflare Worker, onde
 * `nodejs_compat` fornece `node:net` e `node:tls`. Importado sob demanda: só carrega quando
 * MAIL_TRANSPORT=smtp.
 */
export interface SmtpConfig {
  host: string;
  port: number;
  /** true = TLS direto (porta 465); false = STARTTLS (porta 587). */
  secure: boolean;
  user: string;
  password: string;
}

const TEMPO_LIMITE_MS = 8_000;

/** Respostas SMTP que indicam cota ou limite de envio (ex.: Gmail 550 5.4.5, 421 4.7.0). */
export function classificarErroSmtp(erro: unknown): MailResult {
  const texto = erro instanceof Error ? erro.message : String(erro);
  const cota =
    /quota|limit|rate|too many|5\.4\.5|4\.7\.0|4\.7\.28/i.test(texto) ||
    /^\s*(421|452)\b/.test(texto);
  return { ok: false, kind: cota ? "quota" : "other" };
}

export class SmtpTransport implements MailTransport {
  constructor(private readonly config: SmtpConfig) {}

  async send(message: MailMessage): Promise<MailResult> {
    const limite = new Promise<MailResult>((resolve) =>
      setTimeout(() => resolve({ ok: false, kind: "other" }), TEMPO_LIMITE_MS),
    );
    const envio = this.enviar(message)
      .then((): MailResult => ({ ok: true }))
      .catch(classificarErroSmtp);
    return Promise.race([envio, limite]);
  }

  private async enviar(message: MailMessage): Promise<void> {
    const nodemailer = await import("nodemailer");
    const { host, port, secure, user, password } = this.config;
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass: password },
      connectionTimeout: TEMPO_LIMITE_MS,
      greetingTimeout: TEMPO_LIMITE_MS,
      socketTimeout: TEMPO_LIMITE_MS,
    });
    await transporter.sendMail({
      from: message.from,
      to: message.to,
      replyTo: message.replyTo,
      subject: message.subject,
      text: message.text,
    });
  }
}
