import { expect, test } from "@playwright/test";

/** US1: entender a marca e o Planner 2027 (V-01, V-02, FR-001 a FR-008). */

test("primeira dobra: marca, proposta e CTA visíveis sem rolar (V-01)", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("section[aria-labelledby='hero-titulo']");
  await expect(hero.getByText("Novera", { exact: true })).toBeInViewport();
  await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("simplicidade e elegância");
  await expect(hero.getByRole("link", { name: "Conhecer o Planner 2027" })).toBeInViewport();
});

test("CTA principal leva à apresentação do produto", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Conhecer o Planner 2027" }).click();
  await expect(page.locator("#planner-2027")).toBeInViewport();
});

test("produto: PDF interativo, não aplicativo, de janeiro a dezembro de 2027 (V-02, FR-004/005)", async ({
  page,
}) => {
  await page.goto("/");
  const produto = page.locator("#planner-2027");
  await expect(produto).toContainText("janeiro a dezembro de 2027");
  await expect(produto).toContainText("PDF interativo");
  await expect(produto).toContainText("não é um aplicativo");
  await expect(produto).toContainText("sincronização");
});

test("ordem da jornada: marca → produto → demonstração → benefícios → como funciona → compra (FR-002)", async ({
  page,
}) => {
  await page.goto("/");
  const ids = await page.evaluate(() =>
    [
      "hero-titulo",
      "planner-2027",
      "demonstracao",
      "beneficios-titulo",
      "como-funciona",
      "comprar",
    ].map((id) => {
      const el = document.getElementById(id);
      return el ? el.getBoundingClientRect().top + window.scrollY : -1;
    }),
  );
  expect(ids.every((y) => y >= 0)).toBe(true);
  expect([...ids].sort((a, b) => a - b)).toEqual(ids);
});

test("Como funciona tem exatamente 4 passos (US1-5, FR-008)", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#como-funciona ol > li")).toHaveCount(4);
});

test("sem promessas proibidas (US1-4, FR-007)", async ({ page }) => {
  await page.goto("/");
  const texto = (await page.locator("main").innerText()).toLowerCase();
  for (const proibido of [
    "garant",
    "transforme",
    "transformação",
    "aumente sua produtividade",
    "resultados",
  ]) {
    expect(texto).not.toContain(proibido);
  }
});
