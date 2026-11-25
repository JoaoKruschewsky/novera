import { describe, expect, it } from "vitest";
import { faq, FAQ_IDS_OBRIGATORIOS } from "@/content/faq";
import { MARCAS } from "../fixtures/marcas";

const resposta = (id: string) => faq.find((f) => f.id === id)?.answer.text ?? "";

describe("FAQ (FR-019, V-10)", () => {
  it("tem as 8 perguntas obrigatórias", () => {
    const ids = faq.map((f) => f.id);
    for (const id of FAQ_IDS_OBRIGATORIOS) expect(ids).toContain(id);
  });
  it("ids e ordens únicos", () => {
    expect(new Set(faq.map((f) => f.id)).size).toBe(faq.length);
    expect(new Set(faq.map((f) => f.order)).size).toBe(faq.length);
  });
  it("'funciona automaticamente' nega automações, sincronização e lembretes (US5-2)", () => {
    const r = resposta("funciona-automaticamente").toLowerCase();
    expect(r).toMatch(/^não/);
    expect(r).toContain("automações");
    expect(r).toContain("sincronização");
    expect(r).toContain("lembretes");
    expect(r).toContain("manual");
  });
  it("nenhuma resposta cita marca de aplicativo ou aparelho", () => {
    for (const item of faq) {
      for (const marca of MARCAS) expect(item.answer.text).not.toContain(marca);
    }
  });
});
