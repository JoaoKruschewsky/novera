import { describe, expect, it } from "vitest";
import { buildFeedbackEmail } from "@/features/envios/mail/templates";
import { feedbackSchema } from "@/features/envios/schemas";

const base = {
  type: "duvida",
  message: "Como importo o arquivo?",
  replyEmail: "p@example.com",
  name: "",
  privacyAck: "on",
};

describe("feedbackSchema (data-model §2.2)", () => {
  it("aceita envio válido; nome é opcional", () => {
    expect(feedbackSchema.safeParse(base).success).toBe(true);
  });
  it.each([
    ["tipo inválido", { type: "elogio" }, "Escolha o tipo de mensagem."],
    ["mensagem curta", { message: "oi" }, "Escreva pelo menos 10 caracteres."],
    [
      "mensagem longa",
      { message: "a".repeat(3001) },
      "A mensagem pode ter no máximo 3000 caracteres.",
    ],
    [
      "e-mail inválido",
      { replyEmail: "pessoa" },
      "Informe um e-mail para resposta no formato nome@exemplo.com.",
    ],
    ["nome longo", { name: "a".repeat(61) }, "O nome pode ter no máximo 60 caracteres."],
    ["sem aviso de privacidade", { privacyAck: "" }, "Confirme que leu o aviso de privacidade."],
  ])("rejeita %s com mensagem clara", (_n, patch, mensagem) => {
    const r = feedbackSchema.safeParse({ ...base, ...patch });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0]?.message).toBe(mensagem);
  });
});

describe("buildFeedbackEmail (contrato de e-mail)", () => {
  const data = feedbackSchema.parse({
    ...base,
    type: "problema",
    message: "O link de março não abre <script>alert(1)</script> no aparelho.",
  });
  const email = buildFeedbackEmail(data, new Date("2026-11-18T17:32:00Z"));
  it("assunto filtrável com os primeiros 50 caracteres", () => {
    expect(email.subject).toBe(`[Novera][Feedback][Problema] ${data.message.slice(0, 50)}`);
  });
  it("Reply-To é o e-mail da pessoa", () => expect(email.replyTo).toBe("p@example.com"));
  it("corpo segue o contrato e mantém o texto como texto puro", () => {
    expect(email.text).toContain(
      "Nova mensagem de feedback privado (NUNCA publicar sem consentimento explícito do autor).",
    );
    expect(email.text).toContain("Tipo: Problema encontrado");
    expect(email.text).toContain("Data de envio: 2026-11-18 14:32 (horário de Brasília)");
    expect(email.text).toContain("<script>alert(1)</script>");
    expect(email.text).toContain(
      "Excluir este e-mail até 6 meses após a conclusão do atendimento.",
    );
  });
  it("assunto não aceita quebra de linha (injeção de cabeçalho)", () => {
    const d = feedbackSchema.parse({ ...base, message: "linha um\nBcc: x@y.com e mais texto" });
    expect(buildFeedbackEmail(d, new Date()).subject).not.toMatch(/[\r\n]/);
  });
});
