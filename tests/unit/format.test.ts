import { describe, expect, it } from "vitest";
import {
  formatAverage,
  formatBRL,
  formatDatePtBR,
  formatDateTimeBrasilia,
  pluralize,
} from "@/lib/format";

describe("format", () => {
  it("formata datas por extenso", () => {
    expect(formatDatePtBR("2026-11-18")).toBe("18 de novembro de 2026");
    expect(formatDatePtBR("2027-03-01")).toBe("1 de março de 2027");
  });
  it("formata média com uma casa e vírgula", () => {
    expect(formatAverage(10 / 3)).toBe("3,3");
    expect(formatAverage(5)).toBe("5,0");
  });
  it("pluraliza", () => {
    expect(pluralize(1, "avaliação", "avaliações")).toBe("avaliação");
    expect(pluralize(3, "avaliação", "avaliações")).toBe("avaliações");
  });
  it("formata reais", () => expect(formatBRL(9700)).toBe("R$ 97,00"));
  it("formata data e hora em Brasília", () => {
    expect(formatDateTimeBrasilia(new Date("2026-11-18T17:32:00Z"))).toBe(
      "2026-11-18 14:32 (horário de Brasília)",
    );
  });
});
