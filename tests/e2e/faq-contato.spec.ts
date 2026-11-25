import { expect, test, type Page } from "@playwright/test";
import { FALHA_SIMULADA } from "../../src/features/envios/mail/fake";
import {
  aguardarTempoMinimo,
  aguardarTurnstile,
  lerCaixaFalsa,
  marcador,
  ROTAS,
} from "./helpers/support";

/** US5: FAQ, contato, páginas legais e feedback privado (V-10, V-11, V-12, V-17, FR-019 a FR-026). */

test("FAQ: 8 perguntas obrigatórias, expansíveis por teclado (V-10)", async ({ page }) => {
  await page.goto("/faq");
  const perguntas = page.locator("details");
  expect(await perguntas.count()).toBeGreaterThanOrEqual(8);
  const auto = page.locator("details#funciona-automaticamente");
  await auto.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(auto).toHaveAttribute("open", "");
  await expect(auto).toContainText("não tem automações, sincronização nem lembretes");
});

test("rodapé com contato e informações legais em todas as rotas (US5-6)", async ({ page }) => {
  for (const rota of ROTAS) {
    await page.goto(rota);
    const rodape = page.getByRole("navigation", { name: "Rodapé" });
    for (const nome of [
      "Contato",
      "Dúvidas",
      "Política de privacidade",
      "Termos",
      "Informações comerciais",
    ]) {
      await expect(rodape.getByRole("link", { name: nome })).toBeVisible();
    }
  }
});

test("páginas legais pendentes mostram 'Documento em preparação' (FR-022)", async ({ page }) => {
  for (const rota of ["/privacidade", "/termos", "/informacoes-comerciais"]) {
    await page.goto(rota);
    await expect(page.locator("main")).toContainText("Documento em preparação");
  }
});

test("contato não tem link para /avaliar (FR-030a)", async ({ page }) => {
  await page.goto("/contato");
  await expect(page.locator("a[href*='/avaliar']")).toHaveCount(0);
});

async function preencherFeedback(page: Page, mensagem: string) {
  await page.goto("/contato");
  await page.getByLabel("Problema encontrado").check();
  await page.getByLabel("Mensagem", { exact: true }).fill(mensagem);
  await page.getByLabel("E-mail para resposta", { exact: true }).fill("pessoa-teste@example.com");
  await page.getByLabel("Li o aviso de privacidade.").check();
  await aguardarTurnstile(page);
  await aguardarTempoMinimo(page);
}

test.describe("feedback privado", () => {
  // Envios reais ao transporte falso: rodam em um único projeto para não multiplicar o tempo.
  test.beforeEach(({}, info) => {
    test.skip(
      info.project.name !== "chromium-1440" && info.project.name !== "webkit-mobile",
      "envio coberto em 2 projetos",
    );
  });

  test("sucesso: confirmação, e-mail com Reply-To e nada público (V-11)", async ({ page }) => {
    const m = marcador("feedback-ok");
    await preencherFeedback(page, `Mensagem de teste automatizado ${m}.`);
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    const sucesso = page
      .locator("main")
      .getByRole("status")
      .filter({ hasText: "Mensagem enviada" });
    await expect(sucesso).toBeVisible();
    await expect(sucesso).toBeFocused();
    const email = lerCaixaFalsa().find((e) => e.text.includes(m));
    expect(email?.replyTo).toBe("pessoa-teste@example.com");
    expect(email?.subject).toMatch(/^\[Novera\]\[Feedback\]\[Problema\]/);
    for (const rota of ROTAS) {
      await page.goto(rota);
      expect(await page.content()).not.toContain(m);
    }
  });

  test("falha de envio: erro claro e texto mantido (V-12)", async ({ page }) => {
    const texto = `Mensagem que deve falhar ${FALHA_SIMULADA.other} ${marcador("f")}`;
    await preencherFeedback(page, texto);
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    const alerta = page.locator("main").getByRole("alert").filter({ hasText: "não foi enviada" });
    await expect(alerta).toBeVisible();
    await expect(alerta).toContainText("Seu texto foi mantido");
    await expect(page.getByLabel("Mensagem", { exact: true })).toHaveValue(texto);
    await expect(page.getByLabel("E-mail para resposta", { exact: true })).toHaveValue(
      "pessoa-teste@example.com",
    );
  });

  test("limite diário: mensagem de limite e texto mantido (V-12)", async ({ page }) => {
    const texto = `Mensagem no limite ${FALHA_SIMULADA.quota} ${marcador("q")}`;
    await preencherFeedback(page, texto);
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(page.locator("main").getByRole("alert")).toContainText(
      "Recebemos muitos envios hoje",
    );
    await expect(page.getByLabel("Mensagem", { exact: true })).toHaveValue(texto);
  });

  test("honeypot: sucesso aparente, nenhum e-mail (FR-036)", async ({ page }) => {
    const m = marcador("feedback-robo");
    await preencherFeedback(page, `Mensagem de robô ${m}`);
    await page
      .locator("#website")
      .evaluate((el: HTMLInputElement) => (el.value = "http://spam.example"));
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(
      page.locator("main").getByRole("status").filter({ hasText: "Mensagem enviada" }),
    ).toBeVisible();
    expect(lerCaixaFalsa().some((e) => e.text.includes(m))).toBe(false);
  });

  test("campos vazios: resumo de erros com links e foco no resumo", async ({ page }) => {
    await page.goto("/contato");
    await aguardarTurnstile(page);
    await aguardarTempoMinimo(page);
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    const resumo = page.locator("main").getByRole("alert").filter({ hasText: "Revise os campos" });
    await expect(resumo).toBeFocused();
    await expect(resumo.getByRole("link")).toHaveCount(4);
    await expect(page.getByLabel("Mensagem", { exact: true })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  test("Turnstile reprovado: erro de verificação, texto mantido @turnstile-reprova", async ({
    page,
  }) => {
    const texto = `Mensagem com verificação reprovada ${marcador("t")}`;
    await preencherFeedback(page, texto);
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(page.locator("main").getByRole("alert")).toContainText(
      "confirmar que o envio é de uma pessoa",
    );
    await expect(page.getByLabel("Mensagem", { exact: true })).toHaveValue(texto);
  });
});
