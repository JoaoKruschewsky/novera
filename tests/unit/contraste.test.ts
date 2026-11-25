import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio, PALETA, PARES_DE_CONTRASTE } from "@/lib/contrast";

describe("contraste (design-system §2.2)", () => {
  it("a paleta usada no teste é a mesma de tokens.css", () => {
    const css = readFileSync(
      path.join(process.cwd(), "src/styles/tokens.css"),
      "utf8",
    ).toLowerCase();
    for (const [nome, hex] of Object.entries(PALETA)) {
      expect(css).toContain(`--color-${nome}: ${hex.toLowerCase()};`);
    }
  });
  it.each(PARES_DE_CONTRASTE)("$fg sobre $bg atinge $min:1 ($uso)", ({ fg, bg, min }) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(min);
  });
  it("sage sobre graphite fica abaixo de 3:1, por isso é só decorativo", () => {
    expect(contrastRatio("sage", "graphite")).toBeLessThan(3);
  });
});
