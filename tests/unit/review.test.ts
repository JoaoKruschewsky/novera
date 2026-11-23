import { describe, expect, it } from "vitest";
import { buildReviewEmail } from "@/features/envios/mail/templates";
import { MENSAGEM_SEM_AUTORIZACAO, reviewSchema } from "@/features/envios/schemas";

const base = {
  rating: "4",
  comment: "Gostei da navegação entre os meses e do espaço para escrever.",
  publicName: "Ana S.",
  purchaseEmail: "ana@example.com",
  publicationConsent: "on",
  privacyAck: "on",
};

describe("reviewSchema (data-model §2.1)", () => {
  it("aceita envio válido e converte a nota", () => {
    expect(reviewSchema.parse(base).rating).toBe(4);
  });
  it.each([
    ["sem nota", { rating: "" }, "Escolha uma nota de 1 a 5 estrelas."],
    ["nota 0", { rating: "0" }, "Escolha uma nota de 1 a 5 estrelas."],
    ["nota 6", { rating: "6" }, "Escolha uma nota de 1 a 5 estrelas."],
    [
      "comentário curto",
      { comment: "Bom." },
      "Escreva pelo menos 20 caracteres sobre sua experiência.",
    ],
    [
      "nome curto",
      { publicName: "A" },
      "Informe como seu nome deve aparecer (2 a 60 caracteres, sem e-mail ou telefone).",
    ],
    [
      "nome com e-mail",
      { publicName: "ana@x.com" },
      "Informe como seu nome deve aparecer (2 a 60 caracteres, sem e-mail ou telefone).",
    ],
    [
      "nome com telefone",
      { publicName: "Ana 71999998888" },
      "Informe como seu nome deve aparecer (2 a 60 caracteres, sem e-mail ou telefone).",
    ],
    [
      "e-mail inválido",
      { purchaseEmail: "ana" },
      "Informe o e-mail usado na compra, no formato nome@exemplo.com.",
    ],
    ["sem autorização (US7-6)", { publicationConsent: "" }, MENSAGEM_SEM_AUTORIZACAO],
    ["sem aviso de privacidade", { privacyAck: "" }, "Confirme que leu o aviso de privacidade."],
  ])("rejeita %s", (_n, patch, mensagem) => {
    const r = reviewSchema.safeParse({ ...base, ...patch });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0]?.message).toBe(mensagem);
  });
  it("a mensagem sem autorização orienta para o contato", () => {
    expect(MENSAGEM_SEM_AUTORIZACAO).toContain("página de contato");
  });
});

describe("buildReviewEmail (contrato de e-mail)", () => {
  const email = buildReviewEmail(reviewSchema.parse(base), new Date("2026-11-18T17:32:00Z"));
  it("assunto filtrável", () => expect(email.subject).toBe("[Novera][Avaliação] Nota 4 — Ana S."));
  it("Reply-To é o e-mail da compra", () => expect(email.replyTo).toBe("ana@example.com"));
  it("corpo segue o contrato", () => {
    expect(email.text).toContain("Nova avaliação recebida pelo site (NÃO publicada).");
    expect(email.text).toContain("Nota: 4 de 5");
    expect(email.text).toContain(
      "E-mail usado na compra (verificar no painel do checkout): ana@example.com",
    );
    expect(email.text).toContain("Data de envio: 2026-11-18 14:32 (horário de Brasília)");
    expect(email.text).toContain("Nota baixa NÃO é motivo de rejeição.");
    expect(email.text).toContain("src/content/avaliacoes.ts via Pull Request (sem o e-mail)");
  });
});
