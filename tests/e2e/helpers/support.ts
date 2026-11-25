import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { routes } from "../../../src/content/rotas";

/** Rotas públicas do registro (src/content/rotas.ts): os testes cobrem cada nova rota. */
export const ROTAS = routes.map((r) => r.path);
export const ROTAS_INDEXAVEIS = routes.filter((r) => r.indexable).map((r) => r.path);

/** Larguras de revisão visual (design-system §6.2). */
export const LARGURAS_REVISAO = [320, 375, 768, 1024, 1440, 1920] as const;

/** Auditoria axe: falha em violações sérias ou críticas de WCAG 2.2 AA (V-24). */
export async function expectNoSeriousViolations(page: Page) {
  const r = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    // O widget do Turnstile vive em iframe de terceiros, fora do nosso controle.
    .exclude("iframe[src*='challenges.cloudflare.com']")
    .analyze();
  const graves = r.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(
    graves.map((v) => `${v.id}: ${v.help} → ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`),
  ).toEqual([]);
}

export interface EmailGravado {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  text: string;
}

/** Lê os e-mails gravados pelo transporte falso desta configuração da matriz. */
export function lerCaixaFalsa(): EmailGravado[] {
  const dir = process.env.FAKE_MAIL_DIR ?? ".tmp/fake-mail";
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => JSON.parse(readFileSync(path.join(dir, f), "utf8")) as EmailGravado);
  } catch {
    return [];
  }
}

/** Marcador único por teste, para achar o e-mail certo com testes em paralelo. */
export function marcador(prefixo: string) {
  return `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** O token de formulário exige 3 s entre a exibição e o envio (R-10). */
export async function aguardarTempoMinimo(page: Page) {
  await page.waitForTimeout(3_200);
}

/** Espera o Turnstile (chave de teste) preencher o token. */
export async function aguardarTurnstile(page: Page) {
  await expect(page.locator("input[name='cf-turnstile-response']")).toHaveValue(/.+/, {
    timeout: 20_000,
  });
  await expect(page.locator("input[name='formToken']")).toHaveValue(/.+/);
}
