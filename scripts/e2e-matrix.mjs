#!/usr/bin/env node
/**
 * Matriz de builds e2e (tasks T046). Cada configuração faz um `next build` próprio em
 * `.next-<nome>` (conteúdo e variáveis públicas são fixados no build) e roda o Playwright
 * com a tag correspondente. Uso:
 *   node scripts/e2e-matrix.mjs            → todas as configurações
 *   node scripts/e2e-matrix.mjs padrao     → só as indicadas
 * Argumentos depois de `--` vão para o Playwright (ex.: `-- --project=chromium-320`).
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const TAGS = "@vendas-abertas|@interruptor|@avaliacoes|@turnstile-reprova";
const SECRET_REPROVA = "2x0000000000000000000000000000000AA";

const CONFIGURACOES = [
  { nome: "padrao", porta: 3100, build: "padrao", grepInvert: TAGS },
  {
    nome: "vendas-abertas",
    porta: 3101,
    build: "vendas-abertas",
    fixture: "vendas-abertas",
    grep: "@vendas-abertas",
  },
  {
    nome: "interruptor",
    porta: 3102,
    build: "interruptor",
    fixture: "vendas-abertas",
    env: { NEXT_PUBLIC_SALES_OVERRIDE: "nao-abertas" },
    grep: "@interruptor",
  },
  {
    nome: "avaliacoes",
    porta: 3103,
    build: "avaliacoes",
    fixture: "avaliacoes",
    grep: "@avaliacoes",
  },
  {
    nome: "turnstile-reprova",
    porta: 3104,
    build: "padrao", // reutiliza o build padrão; muda só o secret em tempo de execução
    runtimeEnv: { TURNSTILE_SECRET_KEY: SECRET_REPROVA },
    grep: "@turnstile-reprova",
  },
];

const [, , ...argv] = process.argv;
const sep = argv.indexOf("--");
const nomes = sep === -1 ? argv : argv.slice(0, sep);
const extras = sep === -1 ? [] : argv.slice(sep + 1);
const selecionadas = nomes.length
  ? CONFIGURACOES.filter((c) => nomes.includes(c.nome))
  : CONFIGURACOES;

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const construidos = new Set();
// O next build acrescenta ".next-<nome>/types" ao tsconfig.json; o original é restaurado no fim.
const tsconfigOriginal = readFileSync("tsconfig.json", "utf8");
process.on("exit", () => writeFileSync("tsconfig.json", tsconfigOriginal));
const falhas = [];

function run(cmd, args, env) {
  const r = spawnSync(cmd, args, {
    stdio: "inherit",
    env: { ...process.env, ...env },
    shell: process.platform === "win32",
  });
  return r.status ?? 1;
}

for (const c of selecionadas) {
  if (c.fixture && !existsSync(path.join("tests", "fixtures", "content", `${c.fixture}.ts`))) {
    console.log(`\n[e2e] ${c.nome}: fixture ${c.fixture} inexistente, configuração pulada.`);
    continue;
  }
  const distDir = `.next-${c.build}`;
  const buildEnv = {
    NEXT_DIST_DIR: distDir,
    NOVERA_CONTENT_FIXTURE: c.fixture ?? "",
    NEXT_PUBLIC_SITE_URL: `http://localhost:${c.porta}`,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
    NOVERA_PUBLICACAO_OFICIAL: "",
    ...(c.env ?? {}),
  };
  if (!construidos.has(c.build)) {
    console.log(`\n[e2e] build ${c.build} → ${distDir}`);
    if (run(npx, ["next", "build"], buildEnv) !== 0) {
      falhas.push(`${c.nome} (build)`);
      continue;
    }
    construidos.add(c.build);
  }
  const mailDir = path.join(".tmp", `fake-mail-${c.nome}`);
  rmSync(mailDir, { recursive: true, force: true });
  mkdirSync(mailDir, { recursive: true });
  console.log(`\n[e2e] testes ${c.nome} (porta ${c.porta})`);
  const status = run(npx, ["playwright", "test", ...extras], {
    ...buildEnv,
    ...(c.runtimeEnv ?? {}),
    E2E_CONFIG: c.nome,
    E2E_PORT: String(c.porta),
    E2E_GREP: c.grep ?? "",
    E2E_GREP_INVERT: c.grepInvert ?? "",
    FAKE_MAIL_DIR: mailDir,
    PLAYWRIGHT_HTML_OUTPUT_DIR: path.join("playwright-report", c.nome),
  });
  if (status !== 0) falhas.push(c.nome);
}

if (falhas.length) {
  console.error(`\n[e2e] falharam: ${falhas.join(", ")}`);
  process.exit(1);
}
console.log("\n[e2e] todas as configurações passaram.");
