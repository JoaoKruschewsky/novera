import { expect, test } from "@playwright/test";

/** US6: avaliações reais (V-18, V-19, FR-031 a FR-034). */

test("zero avaliações: nenhuma seção, média, contagem ou estrela no HTML (V-18)", async ({
  page,
}) => {
  await page.goto("/");
  const html = (await page.content()).toLowerCase();
  expect(html).not.toContain('id="avaliacoes"');
  for (const palavra of ["estrela", "média", "avaliações", "avaliação"]) {
    expect(
      await page
        .locator("body")
        .innerText()
        .then((t) => t.toLowerCase()),
    ).not.toContain(palavra);
  }
  expect(html).not.toContain("compra verificada");
});

test("com avaliações: média e contagem reais, nota baixa incluída, ordem por data @avaliacoes", async ({
  page,
}) => {
  await page.goto("/");
  const secao = page.locator("#avaliacoes");
  await expect(secao.getByTestId("resumo-avaliacoes")).toHaveText(
    "Média 3,3 de 5 · 3 avaliações de compradores verificados",
  );
  const itens = secao.getByTestId("avaliacao");
  await expect(itens).toHaveCount(3);
  await expect(itens.nth(0)).toContainText("Nota 1 de 5");
  await expect(itens.nth(0)).toContainText("3 de fevereiro de 2027");
  await expect(itens.nth(1)).toContainText("Nota 4 de 5");
  await expect(itens.nth(2)).toContainText("Nota 5 de 5");
  for (const item of await itens.all()) {
    await expect(item).toContainText("Compra verificada");
  }
});
