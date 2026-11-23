import { expect, test } from "@playwright/test";
import { demo } from "../../src/content/produtos/planner-2027/demonstracao";

/** US3: ver o produto real (V-07, V-08, FR-009 a FR-011). */

const aprovados = demo.filter((m) => m.status === "aprovado");

test("sem materiais aprovados: estado informativo, sem imagens nem vídeo (V-07)", async ({
  page,
}) => {
  test.skip(aprovados.length > 0, "Há materiais reais aprovados; o estado vazio não se aplica.");
  await page.goto("/");
  const secao = page.locator("#demonstracao");
  await expect(secao).toContainText("As imagens do produto serão publicadas em breve.");
  await expect(secao.locator("img")).toHaveCount(0);
  await expect(secao.locator("video")).toHaveCount(0);
  const texto = (await secao.innerText()).toLowerCase();
  expect(texto).not.toContain("demonstrações realizadas");
});

test("demonstração não tem página própria (FR-036e)", async ({ page }) => {
  const res = await page.goto("/demonstracao");
  expect(res?.status()).toBe(404);
});

test("materiais reais: alt descritivo e vídeo acessível (V-08)", async ({ page }) => {
  test.skip(aprovados.length === 0, "Aguardando materiais reais aprovados (P-09).");
  await page.goto("/");
  const secao = page.locator("#demonstracao");
  for (const img of await secao.locator("img").all()) {
    expect(((await img.getAttribute("alt")) ?? "").trim().length).toBeGreaterThan(10);
  }
  for (const video of await secao.locator("video").all()) {
    await expect(video).toHaveAttribute("controls", "");
    await expect(video).toHaveAttribute("muted", "");
    await expect(video).not.toHaveAttribute("autoplay", /.*/);
  }
});
