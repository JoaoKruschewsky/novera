#!/usr/bin/env node
/**
 * Gera public/og/novera-padrao.png (1200 × 630), imagem Open Graph TIPOGRÁFICA com a paleta
 * Novera (contrato de rotas §4). Não simula o produto. Uso: npm run og:gerar
 */
import { mkdirSync } from "node:fs";
import sharp from "sharp";

// Paleta aprovada (src/styles/tokens.css).
const GRAPHITE = "#252B32";
const CHAMPAGNE = "#B49A70";
const OFFWHITE = "#F2F0EA";
const SAND = "#D8D0C3";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${GRAPHITE}"/>
  <text x="96" y="150" font-family="Georgia, 'Times New Roman', serif" font-size="40" fill="${CHAMPAGNE}" letter-spacing="6">NOVERA</text>
  <line x1="96" y1="186" x2="560" y2="186" stroke="${CHAMPAGNE}" stroke-width="2"/>
  <text x="96" y="330" font-family="Georgia, 'Times New Roman', serif" font-size="88" fill="${OFFWHITE}">Planner Digital 2027</text>
  <text x="96" y="420" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="${SAND}">Planner em PDF interativo, de janeiro a dezembro de 2027.</text>
</svg>`;

mkdirSync("public/og", { recursive: true });
await sharp(Buffer.from(svg)).png().toFile("public/og/novera-padrao.png");
console.log("public/og/novera-padrao.png gerado.");
