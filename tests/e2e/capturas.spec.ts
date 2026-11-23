import { test } from "@playwright/test";
import { LARGURAS_REVISAO, ROTAS } from "./helpers/support";

/**
 * Capturas para revisão visual humana (design-system §6.2, V-31). Sem comparação de pixels.
 * Saída: test-results/capturas/<config>/<rota>-<largura>.png (artefato "capturas" do CI).
 */
test.describe("capturas de revisão", () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name !== "chromium-1440", "capturas geradas uma vez por configuração");
  });
  for (const rota of ROTAS) {
    test(`capturas de ${rota}`, async ({ page }) => {
      const nome = rota === "/" ? "home" : rota.slice(1).replaceAll("/", "-");
      const config = process.env.E2E_CONFIG ?? "padrao";
      for (const largura of LARGURAS_REVISAO) {
        await page.setViewportSize({ width: largura, height: 900 });
        await page.goto(rota);
        await page.screenshot({
          path: `test-results/capturas/${config}/${nome}-${largura}.png`,
          fullPage: true,
        });
      }
    });
  }
});
