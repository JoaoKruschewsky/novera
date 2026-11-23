import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import { fixture } from "@content-fixture";
import { assertDemoFilesExist } from "@/lib/demo";
import { reviews } from "./avaliacoes";
import { business } from "./empresa";
import { faq } from "./faq";
import { home } from "./home";
import { informacoesComerciais } from "./legal/informacoes-comerciais";
import { privacidade } from "./legal/privacidade";
import { termos } from "./legal/termos";
import { product } from "./produtos/planner-2027";
import { routes } from "./rotas";
import { siteContentSchema } from "./schemas";
import { site } from "./site";
import type { SiteContent } from "./types";

/**
 * Ponto único de leitura do conteúdo (plan.md, "Decisão de estrutura").
 * - Valida tudo com Zod no carregamento: conteúdo inválido FALHA o build.
 * - Em builds de teste, `@content-fixture` (next.config.ts) aplica um fixture de
 *   tests/fixtures/content/ por mesclagem profunda. Em produção é sempre `null`.
 */

type Plain = Record<string, unknown>;

function isPlainObject(v: unknown): v is Plain {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Mescla objetos recursivamente; arrays e valores primitivos do fixture substituem os da base. */
export function deepMerge<T>(base: T, patch: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(patch))
    return (patch === undefined ? base : patch) as T;
  const out: Plain = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    out[k] = k in base ? deepMerge((base as Plain)[k], v) : v;
  }
  return out as T;
}

const baseContent: SiteContent = {
  site,
  home,
  product,
  faq,
  legal: {
    privacidade,
    termos,
    "informacoes-comerciais": informacoesComerciais,
  },
  business,
  reviews,
  routes,
};

function load(): SiteContent {
  const merged = fixture ? deepMerge(baseContent, fixture) : baseContent;
  const parsed = siteContentSchema.safeParse(merged);
  if (!parsed.success) {
    const detalhes = parsed.error.issues
      .map((i) => `- ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Conteúdo inválido em src/content/:\n${detalhes}`);
  }
  assertDemoFilesExist(parsed.data.product.demo, (p) =>
    existsSync(path.join(process.cwd(), "public", p)),
  );
  return parsed.data;
}

const content = load();

export function getSiteContent(): SiteContent {
  return content;
}
