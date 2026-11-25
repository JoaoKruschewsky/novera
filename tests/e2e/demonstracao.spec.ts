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
    // Nunca inicia com som (FR-011): toca sozinho só sem áudio.
    expect(await video.evaluate((v: HTMLVideoElement) => v.muted)).toBe(true);
    await expect(video).not.toHaveAttribute("autoplay", /.*/);
    const descricao = await video.getAttribute("aria-describedby");
    await expect(page.locator(`#${descricao ?? "x"}`)).not.toBeEmpty();
  }
});

test("vídeo toca sem som ao aparecer na tela", async ({ page }) => {
  test.skip(!aprovados.some((m) => m.kind === "video"), "Sem vídeo aprovado.");
  await page.goto("/");
  const video = page.locator("#demonstracao video");
  await video.scrollIntoViewIfNeeded();
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.muted), { timeout: 10_000 })
    .toBe(true);
});

test("com movimento reduzido: vídeo não toca sozinho e as fotos não se movem", async ({
  browser,
}) => {
  test.skip(aprovados.length === 0, "Sem materiais aprovados.");
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  const secao = page.locator("#demonstracao");
  const video = secao.locator("video");
  if ((await video.count()) > 0) {
    await video.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1_000);
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  }
  const trilha = secao.locator(".marquee-trilha");
  if ((await trilha.count()) > 0) {
    expect(await trilha.evaluate((t) => getComputedStyle(t).animationName)).toBe("none");
    await expect(secao.getByRole("button", { name: /Pausar fotos/ })).toBeHidden();
  }
  await context.close();
});

test("faixa de fotos: botão pausa e retoma o movimento (WCAG 2.2.2)", async ({ page }) => {
  test.skip(!aprovados.some((m) => m.kind === "imagem"), "Sem fotos aprovadas.");
  await page.goto("/");
  const secao = page.locator("#demonstracao");
  const trilha = secao.locator(".marquee-trilha");
  const estado = () => trilha.evaluate((t) => getComputedStyle(t).animationPlayState);
  await secao.getByRole("button", { name: "Pausar fotos" }).click();
  await page.mouse.move(0, 0);
  expect(await estado()).toBe("paused");
  await secao.getByRole("button", { name: "Continuar fotos" }).click();
  await page.mouse.move(0, 0);
  await page.locator("body").press("Tab"); // tira o foco do botão (foco dentro também pausa)
  expect(await estado()).toBe("running");
});

test("prévia gratuita: link baixa o PDF real", async ({ page, request }) => {
  await page.goto("/");
  const link = page.locator("#demonstracao").getByRole("link", { name: /Baixar prévia gratuita/ });
  test.skip((await link.count()) === 0, "Prévia não aprovada.");
  await expect(link).toHaveAttribute("download", "");
  const href = (await link.getAttribute("href")) ?? "";
  const res = await request.get(href);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("application/pdf");
});
