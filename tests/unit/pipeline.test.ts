import { describe, expect, it, vi } from "vitest";
import { issueFormToken } from "@/features/envios/form-token";
import { buildFeedbackEmail } from "@/features/envios/mail/templates";
import type { MailMessage, MailResult } from "@/features/envios/mail/transport";
import { MENSAGENS, processSubmission, type PipelineDeps } from "@/features/envios/pipeline";
import { feedbackSchema } from "@/features/envios/schemas";

const SECRET = "segredo-de-teste-unitario-com-mais-de-32-caracteres";

async function form(campos: Record<string, string>, tokenIdadeMs = 10_000): Promise<FormData> {
  const fd = new FormData();
  fd.set("formToken", await issueFormToken(SECRET, Date.now() - tokenIdadeMs));
  fd.set("cf-turnstile-response", "token-turnstile");
  fd.set("website", "");
  for (const [k, v] of Object.entries(campos)) fd.set(k, v);
  return fd;
}

const validos = {
  type: "problema",
  message: "  O link de março   não abre no meu aparelho.  ",
  replyEmail: "pessoa@example.com",
  name: "",
  privacyAck: "on",
};

function deps(resultado: MailResult = { ok: true }, turnstile = true) {
  const enviados: MailMessage[] = [];
  const d: PipelineDeps = {
    transport: {
      send: vi.fn(async (m: MailMessage) => {
        enviados.push(m);
        return resultado;
      }),
    },
    formSecret: SECRET,
    verifyTurnstile: vi.fn(async () => turnstile),
    inbox: "caixa@example.com",
    from: "Site Novera <no-reply@example.com>",
    supportEmail: null,
    now: () => new Date("2026-11-18T17:32:00Z"),
  };
  return { d, enviados };
}

const run = (fd: FormData, d: PipelineDeps) =>
  processSubmission(
    {
      action: "submitFeedback",
      formData: fd,
      schema: feedbackSchema,
      buildEmail: buildFeedbackEmail,
    },
    d,
  );

describe("processSubmission (contrato de envio)", () => {
  it("sucesso: envia 1 e-mail com Reply-To e texto normalizado", async () => {
    const { d, enviados } = deps();
    expect(await run(await form(validos), d)).toEqual({ status: "success" });
    expect(enviados).toHaveLength(1);
    expect(enviados[0]?.replyTo).toBe("pessoa@example.com");
    expect(enviados[0]?.to).toBe("caixa@example.com");
    expect(enviados[0]?.text).toContain("O link de março não abre no meu aparelho.");
  });

  it("honeypot: sucesso aparente sem enviar nem verificar", async () => {
    const { d, enviados } = deps();
    const fd = await form({ ...validos, website: "http://spam" });
    expect(await run(fd, d)).toEqual({ status: "success" });
    expect(enviados).toHaveLength(0);
    expect(d.verifyTurnstile).not.toHaveBeenCalled();
  });

  it("token cedo demais: erro de verificação, texto mantido, sem Turnstile", async () => {
    const { d, enviados } = deps();
    const r = await run(await form(validos, 500), d);
    expect(r).toMatchObject({
      status: "error",
      reason: "verificacao",
      message: MENSAGENS.verificacao,
    });
    expect(r.status === "error" && r.values.message).toContain("O link de março");
    expect(d.verifyTurnstile).not.toHaveBeenCalled();
    expect(enviados).toHaveLength(0);
  });

  it("Turnstile reprovado: erro de verificação, texto mantido", async () => {
    const { d, enviados } = deps({ ok: true }, false);
    const r = await run(await form(validos), d);
    expect(r).toMatchObject({
      status: "error",
      reason: "verificacao",
      message: MENSAGENS.turnstile,
    });
    expect(r.status === "error" && r.values.replyEmail).toBe("pessoa@example.com");
    expect(enviados).toHaveLength(0);
  });

  it("validação: erros por campo e valores preservados", async () => {
    const { d, enviados } = deps();
    const r = await run(
      await form({ ...validos, message: "curta", replyEmail: "x", privacyAck: "" }),
      d,
    );
    expect(r.status).toBe("invalid");
    if (r.status !== "invalid") return;
    expect(Object.keys(r.fieldErrors).sort()).toEqual(["message", "privacyAck", "replyEmail"]);
    expect(r.values.message).toBe("curta");
    expect(enviados).toHaveLength(0);
  });

  it("falha de cota: erro 'limite' com o texto mantido", async () => {
    const { d } = deps({ ok: false, kind: "quota" });
    const r = await run(await form(validos), d);
    expect(r).toMatchObject({ status: "error", reason: "limite" });
    expect(r.status === "error" && r.values.message).toBeTruthy();
  });

  it("outra falha de envio: erro 'envio' (FR-036b)", async () => {
    const { d } = deps({ ok: false, kind: "other" });
    expect(await run(await form(validos), d)).toMatchObject({
      status: "error",
      reason: "envio",
      message: MENSAGENS.envio,
    });
  });

  it("exceção do transporte vira erro 'envio', nunca erro 500", async () => {
    const { d } = deps();
    d.transport = {
      send: async () => {
        throw new Error("operation not permitted");
      },
    };
    const r = await run(await form(validos), d);
    expect(r).toMatchObject({ status: "error", reason: "envio" });
    expect(r.status === "error" && r.values.message).toBeTruthy();
  });

  it("nunca registra dados pessoais no log", async () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => undefined);
    const { d } = deps();
    await run(await form(validos), d);
    const logado = spy.mock.calls.map((c) => String(c[0])).join("\n");
    expect(logado).not.toContain("pessoa@example.com");
    expect(logado).not.toContain("março");
    spy.mockRestore();
  });
});
