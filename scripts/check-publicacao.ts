/**
 * Lista as pendências que bloqueiam a publicação oficial (data-model §3, quickstart V-28).
 *
 * - `npm run check:publicacao`: imprime o relatório (sai com 0, para consulta).
 * - Como `prebuild`: falha (código 1) se houver bloqueio E NOVERA_PUBLICACAO_OFICIAL=true.
 * - `--estrito`: falha sempre que houver bloqueio.
 */
import { listMissingProductionEnv } from "../src/config/env";
import { collectPublicationBlockers } from "../src/lib/publication-guard";

async function main() {
  // O módulo de conteúdo importa "server-only", que só funciona dentro do Next.
  // Aqui carregamos os módulos de conteúdo diretamente.
  const { siteContentSchema } = await import("../src/content/schemas");
  const { site } = await import("../src/content/site");
  const { home } = await import("../src/content/home");
  const { product } = await import("../src/content/produtos/planner-2027");
  const { faq } = await import("../src/content/faq");
  const { privacidade } = await import("../src/content/legal/privacidade");
  const { termos } = await import("../src/content/legal/termos");
  const { informacoesComerciais } = await import("../src/content/legal/informacoes-comerciais");
  const { business } = await import("../src/content/empresa");
  const { reviews } = await import("../src/content/avaliacoes");
  const { routes } = await import("../src/content/rotas");

  const content = siteContentSchema.parse({
    site,
    home,
    product,
    faq,
    legal: { privacidade, termos, "informacoes-comerciais": informacoesComerciais },
    business,
    reviews,
    routes,
  });

  const oficial = process.env.NOVERA_PUBLICACAO_OFICIAL === "true";
  const estrito = process.argv.includes("--estrito");
  const relatorio = process.argv.includes("--relatorio");

  // Fora da publicação oficial, o prebuild não faz nada (prévias e homologação mostram os pendentes).
  if (!oficial && !estrito && !relatorio) return;

  const blockers = collectPublicationBlockers(content, {
    // No deploy pelo CI (NOVERA_GUARDA_SOMENTE_BUILD=true) os segredos do Worker não estão no
    // ambiente; eles são conferidos à parte com `npx wrangler secret list`.
    missing: listMissingProductionEnv(process.env, {
      somenteBuild: process.env.NOVERA_GUARDA_SOMENTE_BUILD === "true",
    }),
    mailTransport: process.env.MAIL_TRANSPORT,
  });

  if (blockers.length === 0) {
    console.log("Nenhuma pendência de publicação.");
    return;
  }

  const porPendencia = new Map<string, string[]>();
  for (const b of blockers) {
    const lista = porPendencia.get(b.pendencia) ?? [];
    lista.push(`  - ${b.item}: ${b.motivo}`);
    porPendencia.set(b.pendencia, lista);
  }
  console.log(`Pendências que bloqueiam a publicação oficial (${blockers.length}):`);
  for (const [pendencia, itens] of [...porPendencia].sort()) {
    console.log(`\n${pendencia}`);
    console.log(itens.join("\n"));
  }

  if (oficial || estrito) {
    console.error("\nPublicação oficial bloqueada: resolva as pendências acima.");
    process.exit(1);
  }
}

main().catch((e: unknown) => {
  console.error(e);
  process.exit(1);
});
