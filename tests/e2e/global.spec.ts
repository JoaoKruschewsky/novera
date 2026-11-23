import { expect, test } from "@playwright/test";
import { expectNoSeriousViolations, ROTAS } from "./helpers/support";

/**
 * Verificações transversais, parametrizadas pelo registro de rotas (V-22 a V-27).
 * Cada rota acrescentada a src/content/rotas.ts passa a ser coberta automaticamente.
 */

for (const rota of ROTAS) {
  test.describe(`rota ${rota}`, () => {
    test("SkipLink é o primeiro foco e leva ao conteúdo; landmarks presentes", async ({
      page,
      browserName,
    }) => {
      // No WebKit, Tab pula links por padrão (como no Safari); coberto na revisão manual V-25.
      test.skip(browserName === "webkit", "Tab não foca links no WebKit por padrão");
      await page.goto(rota);
      await page.keyboard.press("Tab");
      const skip = page.getByRole("link", { name: "Pular para o conteúdo" });
      await expect(skip).toBeFocused();
      await skip.press("Enter");
      await expect(page.locator("main#conteudo")).toBeFocused();
      await expect(page.locator("header").first()).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Rodapé" })).toBeVisible();
    });

    test("sem rolagem horizontal (V-23)", async ({ page }) => {
      await page.goto(rota);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });

    test("acessibilidade automatizada sem violações sérias (V-24)", async ({ page }) => {
      await page.goto(rota);
      await expectNoSeriousViolations(page);
    });

    test("metadados: lang, título, descrição e um h1 (V-27)", async ({ page }) => {
      await page.goto(rota);
      await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
      await expect(page).toHaveTitle(/Novera/);
      const desc = await page.locator('meta[name="description"]').getAttribute("content");
      expect(desc?.length ?? 0).toBeGreaterThan(20);
      expect(desc?.length ?? 0).toBeLessThanOrEqual(160);
      await expect(page.locator("h1")).toHaveCount(1);
    });
  });
}

test("títulos e descrições são únicos por rota (V-27)", async ({ page }) => {
  const titulos = new Set<string>();
  const descricoes = new Set<string>();
  for (const rota of ROTAS) {
    await page.goto(rota);
    titulos.add(await page.title());
    descricoes.add((await page.locator('meta[name="description"]').getAttribute("content")) ?? "");
  }
  expect(titulos.size).toBe(ROTAS.length);
  expect(descricoes.size).toBe(ROTAS.length);
});

test("404 na identidade Novera com caminho de volta (V-22)", async ({ page }) => {
  const res = await page.goto("/rota-inexistente");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("não foi encontrada");
  await page.getByRole("link", { name: "Voltar ao início" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("/especime não existe em produção", async ({ page }) => {
  const res = await page.goto("/especime");
  expect(res?.status()).toBe(404);
});

test("movimento reduzido: sem transições e conteúdo presente (V-26)", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  const duracao = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--duration-base").trim(),
  );
  expect(duracao).toMatch(/^0m?s$/);
  await expect(page.locator("#comprar")).toBeAttached();
  await expect(page.locator("#demonstracao")).toBeAttached();
  await context.close();
});

test.describe("menu mobile por teclado (V-25 parcial, FR-038)", () => {
  test.use({ viewport: { width: 375, height: 800 } });
  test("abre, retém o foco, fecha com Esc e devolve o foco", async ({ page }) => {
    await page.goto("/");
    const botao = page.locator("button[aria-controls='menu-mobile']");
    await expect(botao).toHaveAttribute("aria-expanded", "false");
    await botao.focus();
    await page.keyboard.press("Enter");
    const dialogo = page.getByRole("dialog");
    await expect(dialogo).toBeVisible();
    await expect(botao).toHaveAttribute("aria-expanded", "true");
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      const dentro = await dialogo.evaluate((d) => d.contains(document.activeElement));
      expect(dentro).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(dialogo).toBeHidden();
    await expect(botao).toBeFocused();
  });
  test("itens do menu levam às páginas", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "Dúvidas" }).click();
    await expect(page).toHaveURL(/\/faq$/);
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});
