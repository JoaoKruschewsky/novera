#!/usr/bin/env node
/**
 * Gera as variantes AVIF e WebP (640, 1080 e 1600 px) das capturas REAIS do Planner 2027
 * (research R-15). Uso:
 *   npm run images:otimizar                      → lê media-originais/planner-2027/
 *   npm run images:otimizar -- <entrada> <saída>
 * Saída padrão: public/media/planner-2027/<nome>-<largura>.<formato>
 * Imprime largura e altura de cada imagem para o registro em demonstracao.ts.
 * As capturas devem ser exportadas do PDF APROVADO, sem alterá-lo. Nunca use imagens simuladas.
 */
import { mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const LARGURAS = [640, 1080, 1600];
const [, , entrada = "media-originais/planner-2027", saida = "public/media/planner-2027"] =
  process.argv;

const arquivos = (() => {
  try {
    return readdirSync(entrada).filter((f) => /\.(png|jpe?g|webp|tiff?)$/i.test(f));
  } catch {
    console.error(`Diretório de entrada não encontrado: ${entrada}`);
    process.exit(1);
  }
})();

if (arquivos.length === 0) {
  console.log(`Nenhuma imagem em ${entrada}.`);
  process.exit(0);
}

mkdirSync(saida, { recursive: true });

for (const arquivo of arquivos) {
  const nome = path
    .parse(arquivo)
    .name.toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-");
  const origem = path.join(entrada, arquivo);
  const meta = await sharp(origem).metadata();
  for (const largura of LARGURAS) {
    const base = sharp(origem).resize({ width: largura, withoutEnlargement: true });
    await base
      .clone()
      .avif({ quality: 60 })
      .toFile(path.join(saida, `${nome}-${largura}.avif`));
    await base
      .clone()
      .webp({ quality: 78 })
      .toFile(path.join(saida, `${nome}-${largura}.webp`));
  }
  const largura = Math.min(meta.width ?? 1600, 1600);
  const altura = Math.round(((meta.height ?? 0) * largura) / (meta.width ?? largura));
  console.log(`${nome}: src "/media/planner-2027/${nome}", width ${largura}, height ${altura}`);
}
