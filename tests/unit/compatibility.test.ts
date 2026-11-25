import { describe, expect, it } from "vitest";
import type { CompatibilityRecord } from "@/content/types";
import { resolveCompatibilityView } from "@/lib/compatibility";

const r = (app: string, result: CompatibilityRecord["result"]): CompatibilityRecord => ({
  app,
  platform: "p",
  checks: { internalLinks: true, handwriting: true },
  result,
  testedOn: "2027-01-01",
});

describe("resolveCompatibilityView", () => {
  it("sem testes: requisitos gerais", () => {
    expect(resolveCompatibilityView([])).toEqual({ mode: "requisitos-gerais" });
  });
  it("incompatível nunca aparece como compatível", () => {
    expect(resolveCompatibilityView([r("x", "incompativel")])).toEqual({
      mode: "requisitos-gerais",
    });
  });
  it("separa compatíveis e parciais", () => {
    const v = resolveCompatibilityView([
      r("a", "compativel"),
      r("b", "parcial"),
      r("c", "incompativel"),
    ]);
    expect(v.mode === "lista" && v.compativeis.map((x) => x.app)).toEqual(["a"]);
    expect(v.mode === "lista" && v.parciais.map((x) => x.app)).toEqual(["b"]);
  });
});
