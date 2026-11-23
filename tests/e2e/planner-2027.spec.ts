import { expect, test } from "@playwright/test";
import { MARCAS } from "../fixtures/marcas";

/** US4: detalhes do produto (V-09, US4-1 a US4-4, FR-012 a FR-013). */

test("a página de detalhes tem todos os blocos do US4-1", async ({ page }) => {
  await page.goto("/planner-2027");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Novera Planner Digital 2027");
  for (const titulo of [
    "Formato do arquivo",
    "Conteúdo incluído",
    "Navegação interna",
    "Orientações de uso",
    "Compatibilidade",
    "Exemplos visuais",
    "Comprar o Planner 2027",
  ]) {
    await expect(page.getByRole("heading", { level: 2, name: titulo })).toBeVisible();
  }
  await expect(page.locator("main")).toContainText("não é um aplicativo");
});

test("compatibilidade sem testes: só requisitos gerais, nenhuma marca (V-09)", async ({ page }) => {
  await page.goto("/planner-2027");
  const texto = await page.locator("main").innerText();
  expect(texto).toContain("será publicada depois dos testes");
  for (const marca of MARCAS) expect(texto).not.toContain(marca);
  await expect(page.locator("main table")).toHaveCount(0);
});

test("a home leva aos detalhes", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Ver todos os detalhes do produto" }).click();
  await expect(page).toHaveURL(/\/planner-2027$/);
});

test("sem blocos de texto repetidos entre a home e os detalhes (US4-4)", async ({ page }) => {
  const paragrafos = async (rota: string) => {
    await page.goto(rota);
    const textos = await page.locator("main p, main li").allInnerTexts();
    return new Set(textos.map((t) => t.trim()).filter((t) => t.length > 120));
  };
  const home = await paragrafos("/");
  const detalhes = await paragrafos("/planner-2027");
  expect([...home].filter((t) => detalhes.has(t))).toEqual([]);
});
