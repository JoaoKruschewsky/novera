/** Cálculo de contraste WCAG 2.x a partir da paleta primitiva (design-system §2.2). */
export const PALETA = {
  graphite: "#252B32",
  slate: "#343D47",
  sage: "#596B69",
  champagne: "#B49A70",
  sand: "#D8D0C3",
  offwhite: "#F2F0EA",
} as const;

export type CorPrimitiva = keyof typeof PALETA;

function luminancia(hex: string): number {
  const canais = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = canais.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  ) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatioHex(a: string, b: string): number {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x) as [number, number];
  return (l1 + 0.05) / (l2 + 0.05);
}

export function contrastRatio(fg: CorPrimitiva, bg: CorPrimitiva): number {
  return contrastRatioHex(PALETA[fg], PALETA[bg]);
}

/** Pares usados no site com o mínimo WCAG exigido para o uso permitido. */
export const PARES_DE_CONTRASTE: ReadonlyArray<{
  fg: CorPrimitiva;
  bg: CorPrimitiva;
  min: number;
  uso: string;
}> = [
  { fg: "offwhite", bg: "graphite", min: 4.5, uso: "todo texto" },
  { fg: "sand", bg: "graphite", min: 4.5, uso: "texto secundário" },
  { fg: "champagne", bg: "graphite", min: 4.5, uso: "texto, links, foco" },
  { fg: "offwhite", bg: "slate", min: 4.5, uso: "todo texto" },
  { fg: "sand", bg: "slate", min: 4.5, uso: "texto secundário" },
  { fg: "champagne", bg: "slate", min: 3, uso: "só texto grande e ícones" },
  { fg: "graphite", bg: "champagne", min: 4.5, uso: "rótulo do botão primário" },
  { fg: "graphite", bg: "sand", min: 4.5, uso: "texto nas faixas de papel" },
  { fg: "sage", bg: "offwhite", min: 4.5, uso: "texto auxiliar sobre offwhite" },
];
