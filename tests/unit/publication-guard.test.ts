import { describe, expect, it } from "vitest";
import { listMissingProductionEnv, VARIAVEIS_OBRIGATORIAS_PRODUCAO } from "@/config/env";
import { business } from "@/content/empresa";
import { faq } from "@/content/faq";
import { home } from "@/content/home";
import { informacoesComerciais } from "@/content/legal/informacoes-comerciais";
import { privacidade } from "@/content/legal/privacidade";
import { termos } from "@/content/legal/termos";
import { product } from "@/content/produtos/planner-2027";
import { routes } from "@/content/rotas";
import { site } from "@/content/site";
import type { Copy, SiteContent } from "@/content/types";
import { collectPublicationBlockers } from "@/lib/publication-guard";

const atual: SiteContent = {
  site,
  home,
  product,
  faq,
  legal: { privacidade, termos, "informacoes-comerciais": informacoesComerciais },
  business,
  reviews: [],
  routes,
};

const ok = { missing: [], mailTransport: "resend" };

/** Aprova recursivamente todos os status (simula o conteúdo final). */
function aprovarTudo<T>(v: T): T {
  if (Array.isArray(v)) return v.map(aprovarTudo) as T;
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) out[k] = k === "status" ? "aprovado" : aprovarTudo(x);
    return out as T;
  }
  return v;
}

function conteudoAprovado(): SiteContent {
  const c = aprovarTudo(atual);
  c.product.features = c.product.features.map((f) => ({ ...f, verifiedInFile: true }));
  for (const k of Object.keys(c.business) as Array<keyof SiteContent["business"]>) {
    c.business[k] = { value: "valor real", status: "aprovado" };
  }
  return c;
}

describe("collectPublicationBlockers (FR-022, V-28)", () => {
  it("o conteúdo atual tem pendências", () => {
    const b = collectPublicationBlockers(atual, ok);
    expect(b.length).toBeGreaterThan(0);
    expect(b.map((x) => x.item)).toContain("faq.como-recebo");
    expect(b.map((x) => x.item)).toContain("legal.privacidade");
    expect(b.map((x) => x.item)).toContain("business.taxId");
  });
  it("conteúdo todo aprovado e ambiente completo: nenhuma pendência", () => {
    expect(collectPublicationBlockers(conteudoAprovado(), ok)).toEqual([]);
  });
  it("lista variáveis ausentes e transporte falso", () => {
    const b = collectPublicationBlockers(conteudoAprovado(), {
      missing: ["NOVERA_INBOX_EMAIL"],
      mailTransport: "fake",
    });
    expect(b.map((x) => x.item)).toEqual(["env.NOVERA_INBOX_EMAIL", "env.MAIL_TRANSPORT"]);
    expect(b[0]?.pendencia).toBe("G-02");
  });
  it("funcionalidade aprovada sem conferência no PDF bloqueia", () => {
    const c = conteudoAprovado();
    c.product.features = c.product.features.map((f, i) =>
      i === 0 ? { ...f, verifiedInFile: false } : f,
    );
    expect(collectPublicationBlockers(c, ok).map((x) => x.pendencia)).toEqual(["SC-003"]);
  });
  it("um único texto pendente bloqueia", () => {
    const c = conteudoAprovado();
    const pendente: Copy = { text: "x", status: "pendente" };
    c.home.hero.title = pendente;
    expect(collectPublicationBlockers(c, ok).map((x) => x.item)).toEqual(["home.hero.title"]);
  });
});

describe("listMissingProductionEnv", () => {
  it("lista todas quando vazio", () => {
    expect(listMissingProductionEnv({} as NodeJS.ProcessEnv)).toEqual([
      ...VARIAVEIS_OBRIGATORIAS_PRODUCAO,
    ]);
  });
  it("no modo somente build, ignora os segredos do Worker", () => {
    expect(listMissingProductionEnv({} as NodeJS.ProcessEnv, { somenteBuild: true })).toEqual([
      "NEXT_PUBLIC_SITE_URL",
      "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
      "MAIL_TRANSPORT",
    ]);
  });
  it("trata vazio como ausente", () => {
    const env = Object.fromEntries(
      VARIAVEIS_OBRIGATORIAS_PRODUCAO.map((k) => [k, "x"]),
    ) as NodeJS.ProcessEnv;
    env.MAIL_FROM = " ";
    expect(listMissingProductionEnv(env)).toEqual(["MAIL_FROM"]);
  });
});

describe("transporte de e-mail agnóstico", () => {
  const base = (transporte: string) =>
    ({
      ...Object.fromEntries(VARIAVEIS_OBRIGATORIAS_PRODUCAO.map((k) => [k, "x"])),
      MAIL_TRANSPORT: transporte,
    }) as unknown as NodeJS.ProcessEnv;
  it("smtp exige host, usuário e senha (qualquer provedor)", () => {
    expect(listMissingProductionEnv(base("smtp"))).toEqual([
      "SMTP_HOST",
      "SMTP_USER",
      "SMTP_PASSWORD",
    ]);
  });
  it("resend exige a chave da API", () => {
    expect(listMissingProductionEnv(base("resend"))).toEqual(["RESEND_API_KEY"]);
  });
  it("smtp e resend são aceitos pela guarda; fake bloqueia", () => {
    const c = conteudoAprovado();
    expect(collectPublicationBlockers(c, { missing: [], mailTransport: "smtp" })).toEqual([]);
    expect(collectPublicationBlockers(c, { missing: [], mailTransport: "resend" })).toEqual([]);
    expect(
      collectPublicationBlockers(c, { missing: [], mailTransport: "fake" }).map((x) => x.item),
    ).toEqual(["env.MAIL_TRANSPORT"]);
  });
});
