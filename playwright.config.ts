import { defineConfig, devices } from "@playwright/test";

// A matriz de builds (scripts/e2e-matrix.mjs) define E2E_PORT, E2E_GREP e E2E_GREP_INVERT.
const port = Number(process.env.E2E_PORT ?? 3100);
const grep = process.env.E2E_GREP ? new RegExp(process.env.E2E_GREP) : undefined;
const grepInvert = process.env.E2E_GREP_INVERT
  ? new RegExp(process.env.E2E_GREP_INVERT)
  : undefined;

// Chaves de teste oficiais do Turnstile [VERIFICAR na documentação do Turnstile].
export const TURNSTILE_TEST = {
  siteKeyAprova: "1x00000000000000000000AA",
  secretAprova: "1x0000000000000000000000000000000AA",
  secretReprova: "2x0000000000000000000000000000000AA",
};

export const FAKE_MAIL_DIR = process.env.FAKE_MAIL_DIR ?? ".tmp/fake-mail";

export default defineConfig({
  testDir: "tests/e2e",
  outputDir: "test-results/artefatos",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  grep,
  grepInvert,
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium-320",
      use: { ...devices["Desktop Chrome"], viewport: { width: 320, height: 800 } },
    },
    {
      name: "chromium-768",
      use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } },
    },
    {
      name: "chromium-1440",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    { name: "webkit-mobile", use: { ...devices["iPhone 13"] } },
  ],
  webServer: {
    command: `npx next start -p ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      NEXT_DIST_DIR: process.env.NEXT_DIST_DIR ?? ".next",
      MAIL_TRANSPORT: "fake",
      FAKE_MAIL_DIR,
      TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY ?? TURNSTILE_TEST.secretAprova,
      FORM_SIGNING_SECRET:
        process.env.FORM_SIGNING_SECRET ?? "segredo-de-teste-e2e-com-mais-de-32-caracteres",
      NOVERA_INBOX_EMAIL: "caixa-de-teste@example.com",
      MAIL_FROM: "Site Novera <no-reply@example.com>",
    },
  },
});
