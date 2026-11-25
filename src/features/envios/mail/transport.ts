/** Interface interna de envio (contracts/encaminhamento-email.md). Sempre texto puro. */
export interface MailMessage {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  text: string;
}

export type MailResult = { ok: true } | { ok: false; kind: "quota" | "other" };

export interface MailTransport {
  send(message: MailMessage): Promise<MailResult>;
}
