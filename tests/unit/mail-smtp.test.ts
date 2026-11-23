import { describe, expect, it } from "vitest";
import { getServerEnv } from "@/config/env";
import { createTransport } from "@/features/envios/mail";
import { classificarErroSmtp, SmtpTransport } from "@/features/envios/mail/smtp";

describe("classificarErroSmtp", () => {
  it("cota e limite viram 'quota'", () => {
    expect(classificarErroSmtp(new Error("550 5.4.5 Daily user sending quota exceeded"))).toEqual({
      ok: false,
      kind: "quota",
    });
    expect(classificarErroSmtp(new Error("421 4.7.0 Try again later"))).toEqual({
      ok: false,
      kind: "quota",
    });
  });
  it("demais erros viram 'other'", () => {
    expect(classificarErroSmtp(new Error("535 5.7.8 Username and Password not accepted"))).toEqual({
      ok: false,
      kind: "other",
    });
  });
});

describe("createTransport (smtp)", () => {
  it("cria o transporte SMTP com as variáveis de qualquer provedor", () => {
    const env = getServerEnv({
      MAIL_TRANSPORT: "smtp",
      SMTP_HOST: "smtp.gmail.com",
      SMTP_USER: "novera.brazil@gmail.com",
      SMTP_PASSWORD: "senha-de-app",
    } as unknown as NodeJS.ProcessEnv);
    expect(env.SMTP_PORT).toBe(465);
    expect(createTransport(env)).toBeInstanceOf(SmtpTransport);
  });
  it("sem credenciais, falha na criação (a action trata como configuração incompleta)", () => {
    const env = getServerEnv({ MAIL_TRANSPORT: "smtp" } as unknown as NodeJS.ProcessEnv);
    expect(() => createTransport(env)).toThrow(/SMTP_HOST/);
  });
  it("servidor inacessível termina em falha tratada, sem exceção", async () => {
    const t = new SmtpTransport({
      host: "127.0.0.1",
      port: 1,
      secure: false,
      user: "u",
      password: "p",
    });
    await expect(
      t.send({ to: "a@b.co", from: "c@d.co", replyTo: "e@f.co", subject: "s", text: "t" }),
    ).resolves.toEqual({ ok: false, kind: "other" });
  });
});
