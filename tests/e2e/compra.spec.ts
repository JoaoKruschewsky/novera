import { expect, test } from "@playwright/test";
import { ROTAS } from "./helpers/support";

/** US2: acessar a compra com segurança (V-03 a V-06, FR-015 a FR-018). */

const CHECKOUT_TESTE = "https://pay.kiwify.com.br/teste-e2e";

test("vendas não abertas: sem checkout externo nem preço em nenhuma rota (V-03)", async ({
  page,
}) => {
  await page.goto("/#comprar");
  await expect(page.locator("#comprar")).toContainText(
    "As vendas do Planner 2027 ainda não estão abertas.",
  );
  for (const rota of ROTAS) {
    await page.goto(rota);
    await expect(
      page.locator("a[href*='kiwify'], a[href*='hotmart'], a[data-checkout]"),
    ).toHaveCount(0);
    expect(await page.locator("body").innerText()).not.toContain("R$");
  }
});

test("compra alcançada em até 2 interações de qualquer rota (V-06, SC-004)", async ({
  page,
}, info) => {
  const mobile = (page.viewportSize()?.width ?? 1440) < 640;
  for (const rota of ROTAS) {
    await page.goto(rota);
    if (mobile) {
      await page.getByRole("button", { name: "Menu" }).click(); // interação 1
      await page.getByRole("dialog").getByRole("link", { name: "Comprar" }).click(); // interação 2
    } else {
      await page.locator("header").getByRole("link", { name: "Comprar" }).click(); // interação 1
    }
    await expect(page).toHaveURL(/\/#comprar$/);
    await expect(page.locator("#comprar")).toBeInViewport();
  }
  info.annotations.push({
    type: "modo",
    description: mobile ? "menu + item" : "botão do cabeçalho",
  });
});

test("vendas abertas: CTA aponta para o checkout oficial em nova aba, com aviso @vendas-abertas", async ({
  page,
}) => {
  await page.goto("/#comprar");
  const cta = page.locator("#comprar a[data-checkout]");
  await expect(cta).toHaveAttribute("href", CHECKOUT_TESTE);
  await expect(cta).toHaveAttribute("target", "_blank");
  await expect(cta).toHaveAttribute("rel", "noopener noreferrer");
  await expect(cta).toContainText("Comprar o Planner 2027");
  await expect(cta).toContainText("abre em nova aba");
  await expect(page.locator("#comprar")).toContainText("Pagamento seguro na Kiwify (site externo)");
  expect(await page.locator("body").innerText()).not.toContain("R$");
});

test("vendas abertas também em /planner-2027 @vendas-abertas", async ({ page }) => {
  await page.goto("/planner-2027");
  await expect(page.locator("a[data-checkout]")).toHaveAttribute("href", CHECKOUT_TESTE);
});

test("interruptor de emergência fecha as vendas @interruptor", async ({ page }) => {
  for (const rota of ["/", "/planner-2027"]) {
    await page.goto(rota);
    await expect(page.locator("a[data-checkout]")).toHaveCount(0);
    await expect(
      page.getByText("As vendas do Planner 2027 ainda não estão abertas."),
    ).toBeVisible();
  }
});
