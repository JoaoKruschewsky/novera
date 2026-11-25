import type { MailMessage, MailResult, MailTransport } from "./transport";

/** Marcadores que, no texto da mensagem, fazem o transporte falso simular uma falha. */
export const FALHA_SIMULADA = { quota: "[[falhar:cota]]", other: "[[falhar:envio]]" } as const;

/**
 * Transporte falso (desenvolvimento e testes). Grava cada e-mail como JSON em `dir`.
 * Se o texto contiver um marcador de FALHA_SIMULADA, o envio falha com o tipo correspondente
 * (sem estado compartilhado, para os testes e2e poderem rodar em paralelo).
 * Nunca é usado em produção oficial: a guarda de publicação bloqueia MAIL_TRANSPORT=fake.
 */
export class FakeTransport implements MailTransport {
  constructor(private readonly dir: string) {}

  async send(message: MailMessage): Promise<MailResult> {
    if (message.text.includes(FALHA_SIMULADA.quota)) return { ok: false, kind: "quota" };
    if (message.text.includes(FALHA_SIMULADA.other)) return { ok: false, kind: "other" };
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    await fs.mkdir(this.dir, { recursive: true });
    const nome = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.json`;
    await fs.writeFile(path.join(this.dir, nome), JSON.stringify(message, null, 2), "utf8");
    return { ok: true };
  }
}
