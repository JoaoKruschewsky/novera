import { describe, expect, it } from "vitest";
import type { Feature } from "@/content/types";
import { formatLabel, formatPeriod, selectVisibleFeatures } from "@/lib/product";

const f = (id: string, verifiedInFile: boolean): Feature => ({
  id,
  title: id,
  description: "d",
  verifiedInFile,
  status: "pendente",
});

describe("product", () => {
  it("só exibe funcionalidades conferidas no PDF", () => {
    expect(selectVisibleFeatures([f("a", true), f("b", false)]).map((x) => x.id)).toEqual(["a"]);
  });
  it("rótulo do formato deixa claro que não é aplicativo", () => {
    const label = formatLabel("pdf-interativo");
    expect(label).toContain("PDF");
    expect(label).toContain("não é um aplicativo");
  });
  it("período por extenso", () => {
    expect(formatPeriod({ start: "2027-01", end: "2027-12" })).toBe("janeiro a dezembro de 2027");
  });
});
