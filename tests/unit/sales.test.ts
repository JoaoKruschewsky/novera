import { describe, expect, it } from "vitest";
import type { SalesConfig } from "@/content/types";
import { resolveSalesState } from "@/lib/sales";

const fechadas: SalesConfig = {
  state: "vendas-nao-abertas",
  platform: null,
  checkoutUrl: null,
  price: null,
};
const abertas: SalesConfig = {
  state: "vendas-abertas",
  platform: "kiwify",
  checkoutUrl: "https://pay.kiwify.com.br/x",
  price: null,
};

describe("resolveSalesState", () => {
  it("padrão: não abertas", () => {
    expect(resolveSalesState(fechadas, undefined)).toEqual({ state: "nao-abertas" });
  });
  it("abertas com URL e plataforma", () => {
    expect(resolveSalesState(abertas, undefined)).toEqual({
      state: "abertas",
      checkoutUrl: "https://pay.kiwify.com.br/x",
      platformLabel: "Kiwify",
      price: null,
    });
  });
  it("o interruptor fecha as vendas", () => {
    expect(resolveSalesState(abertas, "nao-abertas")).toEqual({ state: "nao-abertas" });
  });
  it("preço pendente não aparece", () => {
    const r = resolveSalesState(
      { ...abertas, price: { amountCents: 9700, currency: "BRL", status: "pendente" } },
      undefined,
    );
    expect(r.state === "abertas" && r.price).toBe(null);
  });
  it("preço aprovado aparece formatado", () => {
    const r = resolveSalesState(
      { ...abertas, price: { amountCents: 9700, currency: "BRL", status: "aprovado" } },
      undefined,
    );
    expect(r.state === "abertas" && r.price).toBe("R$ 97,00");
  });
});
