import { expect, test, type Page } from "@playwright/test";

/** V-21 (SC-005, FR-044): 0 links internos quebrados e 0 destinos vazios ou fictícios. */

async function rastrear(page: Page): Promise<string[]> {
  const visitadas = new Set<string>();
  const fila = ["/"];
  const ancoras = new Set<string>(); // "rota#id"
  const problemas: string[] = [];

  while (fila.length) {
    const rota = fila.shift() as string;
    if (visitadas.has(rota)) continue;
    visitadas.add(rota);
    // Arquivos (PDF, vídeo, imagem): só confere que existem; não são páginas para rastrear.
    if (/\.[a-z0-9]+$/i.test(rota)) {
      const arquivo = await page.request.get(rota);
      if (arquivo.status() !== 200) problemas.push(`${rota} → ${arquivo.status()}`);
      continue;
    }
    const res = await page.goto(rota);
    if (res?.status() !== 200) problemas.push(`${rota} → ${res?.status()}`);
    const hrefs = await page
      .locator("a")
      .evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    for (const href of hrefs) {
      if (!href || href.trim() === "" || href === "#") {
        problemas.push(`${rota}: href vazio ou "#"`);
        continue;
      }
      if (href.startsWith("mailto:") || /^https?:\/\//.test(href)) continue;
      const [caminho, ancora] = href.split("#");
      const alvo = caminho || rota;
      if (ancora) ancoras.add(`${alvo}#${ancora}`);
      if (!visitadas.has(alvo)) fila.push(alvo);
    }
  }

  for (const a of ancoras) {
    const [caminho, id] = a.split("#");
    await page.goto(caminho || "/");
    if ((await page.locator(`[id="${id}"]`).count()) === 0)
      problemas.push(`${a}: âncora inexistente`);
  }
  return problemas;
}

test.describe("rastreamento de links", () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name !== "chromium-1440", "rastreamento roda em um projeto");
  });
  test("vendas não abertas: nenhum link quebrado (V-21)", async ({ page }) => {
    expect(await rastrear(page)).toEqual([]);
  });
  test("vendas abertas: nenhum link quebrado (V-21) @vendas-abertas", async ({ page }) => {
    expect(await rastrear(page)).toEqual([]);
  });
});
