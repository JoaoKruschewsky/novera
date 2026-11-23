import { expect, test, type Page } from "@playwright/test";
import {
  aguardarTempoMinimo,
  aguardarTurnstile,
  lerCaixaFalsa,
  marcador,
  ROTAS,
} from "./helpers/support";

/** US7: enviar uma avaliação (V-13 a V-17, V-20, FR-027 a FR-030a). */

test("/avaliar é oculta: fora do sitemap, noindex e sem links internos (V-20)", async ({
  page,
  request,
}) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("/avaliar");
  expect(sitemap).toContain("/planner-2027");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /avaliar");
  await page.goto("/avaliar");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  for (const rota of ROTAS) {
    await page.goto(rota);
    await expect(page.locator("a[href*='/avaliar']")).toHaveCount(0);
  }
});

test("nota operável só com teclado", async ({ page }) => {
  await page.goto("/avaliar");
  await page.getByRole("radio", { name: "1 de 5" }).focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "3 de 5" })).toBeChecked();
});

async function preencher(page: Page, comentario: string, { autorizar = true } = {}) {
  await page.goto("/avaliar");
  await page.getByRole("radio", { name: "2 de 5" }).check({ force: true });
  await page.getByLabel("Comentário", { exact: true }).fill(comentario);
  await page.getByLabel("Nome público", { exact: true }).fill("Pessoa Teste");
  await page.getByLabel("E-mail usado na compra", { exact: true }).fill("compradora@example.com");
  if (autorizar) await page.getByLabel(/Autorizo a publicação/).check();
  await page.getByLabel("Li o aviso de privacidade.").check();
  await aguardarTurnstile(page);
  await aguardarTempoMinimo(page);
}

test.describe("envio de avaliação", () => {
  test.beforeEach(({}, info) => {
    test.skip(
      info.project.name !== "chromium-1440" && info.project.name !== "webkit-mobile",
      "envio coberto em 2 projetos",
    );
  });

  test("campos vazios: resumo de erros, foco no resumo (V-13)", async ({ page }) => {
    await page.goto("/avaliar");
    await page.getByLabel("Comentário", { exact: true }).fill("curto");
    await aguardarTurnstile(page);
    await aguardarTempoMinimo(page);
    await page.getByRole("button", { name: "Enviar avaliação" }).click();
    const resumo = page.locator("main").getByRole("alert").filter({ hasText: "Revise os campos" });
    await expect(resumo).toBeFocused();
    await expect(resumo).toContainText("Escolha uma nota de 1 a 5 estrelas.");
    await expect(resumo).toContainText("Escreva pelo menos 20 caracteres");
    await expect(page.getByLabel("Comentário", { exact: true })).toHaveValue("curto");
  });

  test("sem autorização: não aceita e orienta para o contato (V-14)", async ({ page }) => {
    const m = marcador("sem-autorizacao");
    await preencher(page, `Comentário longo o suficiente para o teste ${m}`, { autorizar: false });
    await page.getByRole("button", { name: "Enviar avaliação" }).click();
    await expect(page.locator("main").getByRole("alert")).toContainText("autorize a publicação");
    await expect(page.getByRole("link", { name: "Ir para a página de contato" })).toBeVisible();
    expect(lerCaixaFalsa().some((e) => e.text.includes(m))).toBe(false);
  });

  test("sucesso: mensagem de moderação, e-mail enviado, nada publicado (V-15)", async ({
    page,
  }) => {
    const m = marcador("avaliacao-ok");
    await preencher(page, `Gostei da navegação entre os meses. ${m}`);
    await page.getByRole("button", { name: "Enviar avaliação" }).click();
    await expect(page.locator("main").getByRole("status")).toContainText(
      "será publicada somente depois que confirmarmos a compra e fizermos a moderação",
    );
    const email = lerCaixaFalsa().find((e) => e.text.includes(m));
    expect(email?.subject).toBe("[Novera][Avaliação] Nota 2 — Pessoa Teste");
    expect(email?.replyTo).toBe("compradora@example.com");
    for (const rota of ROTAS) {
      await page.goto(rota);
      expect(await page.content()).not.toContain(m);
    }
  });

  test("honeypot: sucesso aparente, nenhum e-mail (V-16)", async ({ page }) => {
    const m = marcador("avaliacao-robo");
    await preencher(page, `Comentário enviado por robô automatizado ${m}`);
    await page.locator("#website").evaluate((el: HTMLInputElement) => (el.value = "spam"));
    await page.getByRole("button", { name: "Enviar avaliação" }).click();
    await expect(page.locator("main").getByRole("status")).toContainText("Obrigado!");
    expect(lerCaixaFalsa().some((e) => e.text.includes(m))).toBe(false);
  });

  test("Turnstile reprovado: erro de verificação, texto mantido (V-17) @turnstile-reprova", async ({
    page,
  }) => {
    const texto = `Comentário com verificação reprovada ${marcador("t")}`;
    await preencher(page, texto);
    await page.getByRole("button", { name: "Enviar avaliação" }).click();
    await expect(page.locator("main").getByRole("alert")).toContainText(
      "confirmar que o envio é de uma pessoa",
    );
    await expect(page.getByLabel("Comentário", { exact: true })).toHaveValue(texto);
  });
});
