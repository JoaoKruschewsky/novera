/**
 * Normalização do texto recebido (contrato de envio, passo 5): remove caracteres de controle,
 * colapsa espaços e faz trim. Preserva quebras de linha em textos longos.
 */
export function normalizeText(value: string, { multiline = false } = {}): string {
  const semControle = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  if (multiline) {
    return semControle
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .map((linha) => linha.replace(/[ \t]+/g, " ").trim())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
  return semControle.replace(/\s+/g, " ").trim();
}
