---
description: "Lista de tarefas para a implementação do MVP do Site Oficial Novera"
---

# Tarefas: MVP do Site Oficial Novera

**Entrada**: documentos de design em `specs/001-novera-site-mvp/`

**Pré-requisitos**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [design-system.md](./design-system.md),
[contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Testes**: **incluídos**. O plano (Testes e Qualidade, R-13) e a Constitution VIII exigem
Vitest + Playwright + axe, e o quickstart define os cenários V-01 a V-32. Cada tarefa de teste
cita o cenário V-xx que comprova. As verificações manuais são registradas em
`specs/001-novera-site-mvp/checklists/verificacao-manual.md`. Nenhuma verificação pode ser
marcada como feita sem execução real.

**Organização**: as tarefas estão agrupadas por história de usuário, para que cada história
seja implementada e testada de forma independente.

## Formato: `[ID] [P?] [História] Descrição`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependência de tarefa incompleta)
- **[USn]**: história de usuário da [spec.md](./spec.md) à qual a tarefa pertence
- Todos os caminhos são relativos à raiz do repositório (`novera-site/`)

## Convenções que valem para todas as tarefas

- **Nada inventado** (Constitution IV): todo texto comercial novo entra como
  `Copy { text, status: 'pendente' }`. Preço, dados da empresa, contatos, compatibilidade,
  políticas e materiais de demonstração só recebem valor quando o responsável fornecer. Use
  o texto da spec como rascunho, sempre `pendente`.
- **Cores** só por tokens semânticos de `src/styles/tokens.css` (o lint bloqueia literais).
- **Rotas finas**: `src/app/**/page.tsx` só compõe componentes e exporta `metadata`; a lógica
  fica em `src/lib/` ou `src/features/`, e o conteúdo em `src/content/`.
- **Testes e2e** usam a matriz de builds da T046. Testes sem tag rodam no build `padrao`;
  testes que dependem de outro conteúdo ou ambiente usam a tag correspondente
  (`@vendas-abertas`, `@interruptor`, `@avaliacoes`, `@turnstile-reprova`).
- Commits em Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`, `docs:`), um assunto
  por commit: na branch `feature/initial-config` durante a Fase 1 e na
  `feature/001-novera-site-mvp` a partir da Fase 2.

---

## Fase 1: Configuração (infraestrutura compartilhada)

**Objetivo**: repositório, projeto Next.js, qualidade de código, CI e prova técnica da
hospedagem (plano, Fase técnica 1).

- [X] T001 O repositório Git **já existe** (criado pelo responsável) e está na branch `feature/initial-config`, ainda sem commits. A `main` **já existe no GitHub**; **não** rodar `git init` nem criar a `main`. Como o repositório local ainda não tem remoto: pedir a URL ao responsável, rodar `git remote add origin <url>` e `git fetch origin`, e basear a branch atual na `main` remota com `git checkout -B feature/initial-config origin/main` (se algum arquivo não versionado conflitar com o conteúdo da `main`, parar e perguntar ao responsável). Nessa branch, criar `.gitignore` cobrindo `node_modules/`, `.next*/`, `.open-next/`, `.wrangler/`, `.env*.local`, `.tmp/`, `playwright-report/`, `test-results/`, e fazer o primeiro commit `chore: estrutura inicial e artefatos do Spec Kit` com `.gitignore`, `.specify/`, `.claude/` e `specs/`. O push só acontece com confirmação do responsável. Toda a Fase 1 é feita na `feature/initial-config`; a partir da Fase 2, usar `feature/001-novera-site-mvp`, criada a partir da `main` depois do merge da Fase 1 (research R-14). Não renomear `specs/001-novera-site-mvp/`
- [X] T002 Gerar o app Next.js 16 com `npx create-next-app@latest` em uma pasta temporária (TypeScript, App Router, ESLint, Tailwind, diretório `src/`, alias `@/*`) e mover o resultado para a raiz sem sobrescrever `.specify/`, `.claude/` e `specs/`; fixar `next`, `react` e `react-dom` sem `^` em `package.json` (versões exatas obtidas com `npm view <pacote> version`, R-01) e definir `"engines": { "node": ">=24" }`
- [X] T003 [P] Configurar `tsconfig.json` com `strict: true`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `paths` `@/*` → `src/*` e `include` cobrindo `src/`, `tests/`, `scripts/` e os arquivos de configuração
- [X] T004 [P] Instalar as dependências com versões exatas em `package.json`: produção `zod`, `lucide-react`, `resend`, `server-only`; desenvolvimento `tsx`, `vitest`, `@playwright/test`, `@axe-core/playwright`, `prettier`, `prettier-plugin-tailwindcss`, `typescript-eslint`, `eslint-plugin-jsx-a11y`, `sharp`. **Não** instalar Motion (R-06)
- [X] T005 [P] Criar `eslint.config.mjs` (flat config): `eslint-config-next` (core-web-vitals), `typescript-eslint` strict, `eslint-plugin-jsx-a11y` recommended, `no-unused-vars` como erro, e `no-restricted-syntax` bloqueando (a) literais de cor (`#rgb`, `#rrggbb`, `rgb(`, `hsl(`) e classes Tailwind com cor arbitrária (`-[#`) em strings JSX `className`/`style`, e (b) o atributo `target="_blank"` fora de `src/components/product/PurchaseCta.tsx` (R-12, contrato de rotas §3)
- [X] T006 [P] Criar `.prettierrc` (com `prettier-plugin-tailwindcss` e `tailwindStylesheet: "./src/styles/globals.css"`) e `.prettierignore` (`.next*`, `.open-next`, `public/media`, `specs/`)
- [X] T007 [P] Criar `vitest.config.ts` (ambiente `node`, alias `@` → `src`, `include: ['tests/unit/**/*.test.ts']`)
- [X] T008 [P] Criar `playwright.config.ts`: projetos `chromium-320` (320×800), `chromium-768` (768×1024), `chromium-1440` (1440×900) e `webkit-mobile` (`devices['iPhone 13']`); `baseURL` em `http://localhost:${E2E_PORT ?? 3100}`; `webServer` com `next start -p $E2E_PORT` e `env` de teste (`MAIL_TRANSPORT=fake`, `FAKE_MAIL_DIR=.tmp/fake-mail`, chaves de teste do Turnstile, `FORM_SIGNING_SECRET` de teste com 32+ bytes); `grep`/`grepInvert` lidos de `E2E_GREP` e `E2E_GREP_INVERT`; reporter `html` + `list`
- [X] T009 [P] Criar `.env.example` com todas as variáveis de [contracts/ambiente.md](./contracts/ambiente.md), **sem valores reais**, com comentário por variável e as chaves de teste oficiais do Turnstile (site key "sempre aprova" `1x00000000000000000000AA`, secret "sempre aprova" `1x0000000000000000000000000000000AA`, secret "sempre reprova" `2x0000000000000000000000000000000AA`, marcadas como **[VERIFICAR na documentação do Turnstile]**)
- [X] T010 Definir os scripts em `package.json`: `dev`, `build`, `start`, `typecheck` (`tsc --noEmit`), `lint`, `format`, `format:check`, `test` (`vitest run`), `e2e` (build `padrao` + Playwright), `e2e:matrix` (`node scripts/e2e-matrix.mjs`), `check:publicacao` (`tsx scripts/check-publicacao.ts`), `images:otimizar` (`node scripts/otimizar-imagens.mjs`), `preview:cf` e `deploy:cf`. Scripts cujo arquivo ainda não existe são criados nas tarefas indicadas (T046, T073, T095, T015)
- [X] T011 [P] Criar `.github/workflows/ci.yml` com o nome de workflow `ci`, disparado por `push` nas branches `main`, `feature/**`, `fix/**` e `chore/**` e por `pull_request` para a `main` (com `concurrency` por branch e `cancel-in-progress: true`), Node 24 e cache npm. Jobs separados, para que cada verificação apareça como check próprio no PR: `qualidade` (`npm ci` → `typecheck` → `lint` → `format:check`), `unitarios` (`npm test`), `seguranca` (`npm audit --omit=dev --audit-level=high`), `build` (`npm run build` com o build guardado como artefato) e `e2e` (depende de `build`; `npx playwright install --with-deps chromium webkit` → `npm run e2e:matrix` → upload de `playwright-report/` e `test-results/capturas/`, inclusive em falha). Sem segredos de produção; `MAIL_TRANSPORT=fake` e chaves de teste do Turnstile. Os disparos por `push` garantem que os checks também rodem nos PRs abertos automaticamente pela T012 (PRs criados com o `GITHUB_TOKEN` não disparam o evento `pull_request`, mas os checks são vinculados ao commit)
- [X] T012 [P] Criar `.github/workflows/auto-pr.yml`: disparado por `push` em `feature/**`, `fix/**` e `chore/**`, com `permissions: { contents: read, pull-requests: write }`; usa `gh pr list --head <branch> --base main --state open` e, se não houver PR aberto, roda `gh pr create --base main --head <branch> --title "<assunto do último commit>" --body-file .github/pull_request_template.md` com `GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}`; se já existir PR, não faz nada. Nunca faz merge automático: o merge continua manual, depois dos checks do `ci` verdes. Exige que o responsável ative em Settings → Actions → General a opção "Allow GitHub Actions to create and approve pull requests" (T017)
- [X] T013 [P] Criar `.github/dependabot.yml` com atualização semanal agrupada para `npm` e `github-actions`
- [X] T014 [P] Criar `.github/pull_request_template.md` com o checklist da Constitution VIII (typecheck, lint, testes, build, acessibilidade e teclado, estados de carregamento, erro e sucesso, nada declarado sem execução) e o checklist de revisão visual de [design-system.md §6.4](./design-system.md)
- [X] T015 Instalar `@opennextjs/cloudflare` e `wrangler` (dev, versões exatas); criar `open-next.config.ts` e `wrangler.jsonc` (`nodejs_compat`, `compatibility_date` atual, binding de assets) e os scripts `preview:cf` (`opennextjs-cloudflare build && opennextjs-cloudflare preview`) e `deploy:cf` em `package.json`
- [X] T016 Executar a prova técnica R-03a: criar a rota temporária `src/app/prova-cf/page.tsx` com uma Server Action que valida um campo com Zod e chama `fetch` externo; rodar `npm run preview:cf`; medir o tamanho do Worker comprimido (limite de 3 MiB) e o tempo de CPU da action; registrar os resultados e a decisão (manter Cloudflare ou mudar para o plano B Netlify) em `specs/001-novera-site-mvp/research.md` (seção R-03a, "Resultado da prova"); **remover** `src/app/prova-cf/` em seguida. Se o Worker passar de 3 MiB, parar e pedir decisão ao responsável
- [X] T017 **Ação manual do responsável** no GitHub: em Settings → Actions → General, ativar "Allow GitHub Actions to create and approve pull requests" (necessário para a T012); configurar o ruleset da `main` (PR obrigatório; checks `qualidade`, `unitarios`, `seguranca`, `build` e `e2e` obrigatórios; sem force push nem exclusão); publicar a `feature/initial-config` com `git push -u origin feature/initial-config` e conferir que o PR para a `main` foi aberto automaticamente e que os checks rodaram. Se o plano Free não permitir em repositório privado, registrar o processo alternativo em `README.md` (R-14). Nunca fazer push sem confirmação do responsável

**Checkpoint**: `npm run build`, `npm run lint`, `npm run typecheck` e `npm run preview:cf` funcionando; decisão de hospedagem registrada.

---

## Fase 2: Fundação (pré-requisitos bloqueantes)

**Objetivo**: design system, conteúdo tipado, layout global, SEO base e infraestrutura de
testes, que **todas** as histórias usam (fases técnicas 2 e 3 do plano).

**⚠️ CRÍTICO**: nenhuma história começa antes desta fase terminar.

### Design system

- [X] T018 Criar `src/styles/tokens.css` com `@theme` do Tailwind 4: primitivos de cor (os 6 hex de [design-system.md §2.1](./design-system.md)), derivados por `color-mix()` (`graphite-deep`, `champagne-strong`, `line`), escalas de espaço (base 4 px), tipografia fluida com `clamp()` (`text-display` a `text-eyebrow`, §2.3), larguras (`--w-content` 1200 px, `--w-prose` 68ch, `--w-wide` 1360 px), raios, `--shadow-paper`, `--duration-fast`/`--duration-base` e a curva; tokens semânticos de §3 (`surface-*`, `text-*`, `border-*`, `accent`, `accent-hover`, `focus-ring`, `state-error`, `state-success`). Definir `state-error` a partir de champagne ou sand (sempre acompanhado de ícone e texto). Zerar as durações em `@media (prefers-reduced-motion: reduce)`
- [X] T019 Criar `src/styles/globals.css` (`@import "tailwindcss"` + `tokens.css`; `body` com `surface-base`/`text-primary`; anel de foco `focus-visible` de 2 px com deslocamento de 2 px pelo token `focus-ring`; classe de medida de leitura de 68ch; `.sr-only`); apagar o boilerplate do create-next-app (`src/app/globals.css`, `src/app/page.tsx` de exemplo, SVGs de `public/`)
- [X] T020 [P] Criar `src/app/fonts.ts` com Newsreader (variável, eixo `opsz`, pesos 400–600, itálico 400) e Hanken Grotesk (variável, 400–600) via `next/font/google`, `subsets: ['latin']`, `display: 'swap'`, expostas como `--font-display` e `--font-sans` e ligadas aos tokens de família em `src/styles/tokens.css` (R-04)

### Conteúdo tipado e configuração

- [X] T021 [P] Criar `src/content/types.ts` com todos os tipos de [data-model.md §1](./data-model.md): `ContentStatus`, `Copy`, `Product`, `Feature`, `SalesConfig`, `DemoMaterial`, `CompatibilityRecord`, `FaqItem`, `LegalPage` (com blocos `heading`/`paragraph`/`list`), `BusinessInfo` (status por campo), `PublishedReview`, e mais `HomeContent` (hero, benefícios, passos do "Como funciona"), `NavItem` (`label`, `href`), `SiteContent` (agregado de tudo) e `RouteEntry` (`path`, `indexable`)
- [X] T022 Criar `src/content/schemas.ts` com schemas Zod espelhando `types.ts`: `checkoutUrl` com `https:` e host na lista permitida por plataforma (`pay.kiwify.com.br`, `pay.hotmart.com`, **[VERIFICAR]**); `vendas-abertas` exige `platform` e `checkoutUrl`; `price` com `currency: 'BRL'`; `DemoMaterial` do tipo vídeo exige `poster` e `textEquivalent`; `LegalPage` com `aprovado` exige `effectiveDate`; `PublishedReview` (id `aaaa-mm-dd-nn`, nota inteira 1–5, comentário 20–1.500, nome público 2–60, `publishedOn ≥ submittedOn`, `verifiedPurchase: true` literal, sem `@` nem sequência de 8+ dígitos em comentário e nome) (depende de T021)
- [X] T023 [P] Escrever `tests/unit/content-schemas.test.ts` cobrindo cada regra da T022 (casos válidos e inválidos, inclusive `vendas-abertas` sem URL, host não permitido, `http:`, avaliação com e-mail no comentário, `verifiedPurchase: false`)
- [X] T024 [P] Criar `src/content/rotas.ts` (registro de rotas usado por sitemap, robots e testes e2e), inicialmente só com `{ path: '/', indexable: true }`. Cada história acrescenta suas rotas
- [X] T025 Criar os módulos de conteúdo iniciais, válidos e sem dados inventados: `src/content/site.ts` (`brand`, `tagline` como `Copy` pendente com o texto do FR-001, `nav: []`, `footer: []`), `src/content/empresa.ts` (todos os campos `null` com `status: 'pendente'`), `src/content/avaliacoes.ts` (`export const reviews: PublishedReview[] = []`), `src/content/faq.ts` (`[]`), `src/content/home.ts` (estrutura vazia) e `src/content/produtos/planner-2027/index.ts` (slug, nome, `period`, `format: 'pdf-interativo'`, `sales: { state: 'vendas-nao-abertas', platform: null, checkoutUrl: null, price: null }`, listas vazias, `seo`)
- [X] T026 Criar `next.config.ts`: `images: { unoptimized: true }` (R-15), `poweredByHeader: false`, `distDir` lido de `NEXT_DIST_DIR` (padrão `.next`), cabeçalhos de segurança em todas as rotas (`Content-Security-Policy` com `default-src 'self'`, `script-src` e `frame-src` permitindo `https://challenges.cloudflare.com`, `frame-ancestors 'none'`; `X-Content-Type-Options: nosniff`; `Referrer-Policy: strict-origin-when-cross-origin`; `Permissions-Policy` negando câmera, microfone e geolocalização) e alias `@content-fixture` (Turbopack `resolveAlias` e webpack) apontando para `tests/fixtures/content/${NOVERA_CONTENT_FIXTURE}.ts` quando a variável existir, ou para `src/content/no-fixture.ts` caso contrário
- [X] T027 Criar `src/content/no-fixture.ts` (`export const fixture = null`) e `src/content/index.ts` com `getSiteContent()`: agrega os módulos de `src/content/`, aplica o `fixture` de `@content-fixture` por mesclagem profunda (só no build de teste) e valida tudo com os schemas da T022 no carregamento do módulo, para que conteúdo inválido **falhe o build** (depende de T022, T025, T026)
- [X] T028 [P] Criar `src/config/env.ts` com Zod: `publicEnv` (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_SALES_OVERRIDE` opcional `'nao-abertas'`) e `getServerEnv()` (importa `server-only`; `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `MAIL_TRANSPORT` `resend|fake` com padrão `fake` fora de produção, `MAIL_FROM`, `NOVERA_INBOX_EMAIL`, `FORM_SIGNING_SECRET` ≥ 32 caracteres, `FAKE_MAIL_DIR`, `NOVERA_PUBLICACAO_OFICIAL`); exportar `listMissingProductionEnv()` com as variáveis obrigatórias em produção oficial ausentes ([contracts/ambiente.md](./contracts/ambiente.md))
- [X] T029 [P] Criar `src/lib/format.ts` (`formatDatePtBR('2026-11-18')` → "18 de novembro de 2026", `formatAverage(3.33)` → "3,3", `pluralize(n, 'avaliação', 'avaliações')`) e `tests/unit/format.test.ts`
- [X] T030 [P] Criar `src/lib/metadata.ts` com `buildPageMetadata({ title, description, path, noindex? })` → `Metadata` do Next (título no modelo `%s · Novera`, descrição de até 160 caracteres, `alternates.canonical`, `openGraph` com `locale: 'pt_BR'`, `type: 'website'` e imagem `/og/novera-padrao.png` 1200 × 630; `robots: { index: false, follow: false }` quando `noindex`) (contrato de rotas §4)

### Componentes base

- [X] T031 [P] Criar `src/components/ui/Button.tsx` com variantes `primary`, `secondary` e `quiet`; estados hover, `focus-visible`, active, `disabled` (`aria-disabled`) e `loading` (rótulo "Enviando…", `aria-busy`); alvo ≥ 44 × 44 px; renderiza `<button>` ou `<a>` por propriedade ([design-system.md §4](./design-system.md))
- [X] T032 [P] Criar `src/components/ui/TextLink.tsx` (interno com `next/link`; externo com ícone `ArrowUpRight` da Lucide e texto `sr-only` "(abre site externo)"; sublinhado visível em texto corrido)
- [X] T033 [P] Criar `src/components/ui/Notice.tsx` (bloco informativo tipográfico para estados pendentes: "vendas não abertas", "materiais em breve", "documento em preparação"; `role="status"` apenas com a propriedade `live`)
- [X] T034 [P] Criar `src/components/layout/SectionHeader.tsx` (numeração + eyebrow em versalete + título com nível por propriedade `as` + lead) e `src/components/layout/EditorialRule.tsx` (fio champagne de 1 px com numeração, `aria-hidden`)
- [X] T035 [P] Criar `src/components/layout/PaperBand.tsx` (faixa `surface-paper` com largura `--w-wide`, que troca os tokens de texto para `text-on-paper` e de foco para graphite dentro dela)
- [X] T036 Rodar `npx shadcn@latest init` (configuração mínima) e `npx shadcn@latest add sheet`; mover e reescrever o componente para `src/components/ui/Sheet.tsx` usando só tokens Novera (sem cores literais); remover os arquivos do shadcn que não forem usados
- [X] T037 [P] Criar `src/components/layout/SkipLink.tsx` ("Pular para o conteúdo" → `#conteudo`, visível ao receber foco)
- [X] T038 Criar `src/components/layout/SiteHeader.tsx` (logotipo tipográfico → `/`; itens de `site.nav` em ≥ 1024 px) e `src/components/layout/MobileNav.tsx` (`'use client'`, `Sheet` da T036; botão "Menu" com `aria-expanded` e `aria-controls`; foco retido; Esc e "Fechar" devolvem o foco ao botão "Menu"; mesmos itens de `site.nav`) (depende de T036)
- [X] T039 [P] Criar `src/components/layout/SiteFooter.tsx` (`surface-footer`; links de `site.footer`; e-mail de suporte, razão social e CNPJ **só** quando o campo de `BusinessInfo` estiver `aprovado`)
- [X] T040 Criar `src/app/layout.tsx`: `<html lang="pt-BR">` com as variáveis de fonte, `SkipLink` como primeiro elemento focável, `SiteHeader`, `<main id="conteudo" tabIndex={-1}>`, `SiteFooter`; `metadata` padrão com `metadataBase` a partir de `NEXT_PUBLIC_SITE_URL` (padrão `http://localhost:3000`) e `title.template: '%s · Novera'`; criar a pasta `src/app/(site)/` (depende de T020, T037–T039)
- [X] T041 [P] Criar `src/app/not-found.tsx` na identidade Novera, com `h1` e link "Voltar ao início" para `/` (FR-043)
- [X] T042 [P] Criar `src/app/sitemap.ts` (só as entradas `indexable` de `src/content/rotas.ts`, com `NEXT_PUBLIC_SITE_URL`) e `src/app/robots.ts` (permite tudo, exceto `/avaliar` e `/especime`; aponta para o sitemap)
- [X] T043 [P] Criar `scripts/gerar-og.mjs` (sharp, renderiza um SVG tipográfico com tokens da paleta em PNG 1200 × 630) e gerar `public/og/novera-padrao.png`; criar `src/app/icon.svg` tipográfico (monograma "N" em champagne sobre graphite)
- [X] T044 Criar `src/app/especime/page.tsx` (chama `notFound()` quando `process.env.NODE_ENV === 'production'`; `metadata` com `noindex`): amostras dos tokens de cor com a razão de contraste de cada par, escala tipográfica, `Button` em todos os estados, `TextLink`, `Notice`, `SectionHeader`, `EditorialRule` e `PaperBand` ([design-system.md §6.1](./design-system.md))
- [X] T045 [P] Escrever `tests/unit/contraste.test.ts`: lê os hex primitivos de `src/styles/tokens.css`, calcula a razão de contraste WCAG e confirma os pares de [design-system.md §2.2](./design-system.md) (offwhite/graphite ≥ 4,5; champagne/graphite ≥ 4,5; graphite/champagne ≥ 4,5; graphite/sand ≥ 4,5; sage/offwhite ≥ 4,5; champagne/slate ≥ 3)

### Infraestrutura de testes e2e

- [X] T046 Criar `scripts/e2e-matrix.mjs`: para cada configuração — `padrao` (sem fixture; `E2E_GREP_INVERT=@vendas-abertas|@interruptor|@avaliacoes|@turnstile-reprova`), `vendas-abertas` (`NOVERA_CONTENT_FIXTURE=vendas-abertas`), `interruptor` (mesmo fixture + `NEXT_PUBLIC_SALES_OVERRIDE=nao-abertas`), `avaliacoes` (`NOVERA_CONTENT_FIXTURE=avaliacoes`) e `turnstile-reprova` (reutiliza o build `padrao` com o secret "sempre reprova" em tempo de execução) — faz `next build` com `NEXT_DIST_DIR=.next-<nome>` e roda o Playwright com a porta e o `E2E_GREP` da configuração; pula configurações cujo fixture ainda não exista em `tests/fixtures/content/`; termina com código ≠ 0 se alguma falhar. Criar também `tests/e2e/helpers/rotas.ts` (lê `src/content/rotas.ts`), `tests/e2e/helpers/axe.ts` (`expectNoSeriousViolations(page)`: falha em `serious`/`critical`, tags WCAG 2.2 AA) e `tests/e2e/helpers/viewports.ts` (320, 375, 768, 1024, 1440, 1920)
- [X] T047 Escrever `tests/e2e/global.spec.ts`, parametrizado por todas as rotas de `src/content/rotas.ts` (assim cobre automaticamente as rotas que as histórias acrescentarem): SkipLink é o primeiro foco e leva a `#conteudo`; landmarks `header`, `nav`, `main`, `footer`; V-22 (`/rota-inexistente` → status 404, página Novera, link para `/`); V-23 (`scrollWidth ≤ clientWidth` em 320, 768 e 1440 px); V-24 (axe sem violações sérias ou críticas); V-25 parcial (em 375 px o menu abre por teclado, retém o foco, fecha com Esc e devolve o foco ao botão "Menu"); V-26 (`reducedMotion: 'reduce'`: durações calculadas iguais a 0 e conteúdo presente); V-27 (`<title>` e `meta description` únicos por rota, `lang="pt-BR"`, exatamente um `h1`)
- [ ] T048 Criar `specs/001-novera-site-mvp/checklists/verificacao-manual.md` com seções para V-25, V-29, V-30, V-31, V-32, SC-001/SC-002, SC-003 e SC-012 (data, quem executou, ambiente, resultado, evidência). Fazer a revisão visual do `/especime` nas 6 larguras de revisão e registrar o resultado lá (checklist de [design-system.md §6.4](./design-system.md); validação da tipografia, R-04)

**Checkpoint**: `npm run typecheck && npm run lint && npm test && npm run build && npm run e2e:matrix` verdes; espécime aprovado na revisão visual. As histórias podem começar.

---

## Fase 3: História de Usuário 1 — Entender a marca e o Planner 2027 (Prioridade: P1) 🎯 MVP

**Objetivo**: a home apresenta a marca, o Planner 2027 (PDF interativo, não aplicativo),
os benefícios concretos e os quatro passos de "Como funciona" (FR-001 a FR-008).

**Teste independente**: publicar só a home com essas seções; V-01 e V-02 passam; teste de
compreensão (SC-001, SC-002) com pessoas do público-alvo.

### Testes da US1

- [X] T049 [P] [US1] Escrever `tests/unit/product.test.ts`: `selectVisibleFeatures` só retorna `Feature` com `verifiedInFile: true` (FR-006); `formatLabel('pdf-interativo')` contém "arquivo PDF" e "não é um aplicativo"; `formatPeriod` → "janeiro a dezembro de 2027"
- [X] T050 [P] [US1] Escrever `tests/e2e/home.spec.ts`: V-01 (em 320 e 1440 px, a marca, a proposta e o CTA "Conhecer o Planner 2027" estão visíveis sem rolar); V-02 (frase "arquivo PDF … não é um aplicativo" presente); período "janeiro a dezembro de 2027" e "PDF interativo" presentes; ordem das seções: marca → produto → benefícios → como funciona; exatamente 4 passos em "Como funciona"; nenhum termo de promessa proibida no HTML (`garant`, `transform`, `aumente sua produtividade`, `resultado`) (US1-4, FR-007)

### Implementação da US1

- [X] T051 [US1] Preencher `src/content/produtos/planner-2027/index.ts`: `tagline` e `description` como `Copy` pendente (rascunho a partir da spec); `features` com os itens do FR-004 (navegação por links internos; páginas diárias, semanais e mensais; prioridades; compromissos; tarefas; metas; finanças; organização; anotações; espaço para escrita manual), todos com `verifiedInFile: false` e `status: 'pendente'` até a conferência contra o PDF real (T141); `limitations` com o texto do FR-005 (sem sincronização, lembretes ou automações; preenchimento manual)
- [X] T052 [P] [US1] Preencher `src/content/home.ts`: hero (título e proposta do FR-001 como `Copy` pendente; rótulo do CTA "Conhecer o Planner 2027"), os 5 benefícios concretos do FR-007 e os 4 passos do FR-008 (comprar; receber e baixar o PDF; importar em um aplicativo compatível com PDF interativo e escrita manual; navegar e preencher), sem citar aplicativo ou dispositivo, tudo `pendente`
- [X] T053 [US1] Criar `src/lib/product.ts` com `selectVisibleFeatures`, `formatLabel` e `formatPeriod` (faz passar a T049) (depende de T051)
- [X] T054 [P] [US1] Criar `src/components/product/FeatureList.tsx` (lista editorial com fios entre os itens, sem cards nem ícones decorativos; recebe as features já filtradas)
- [X] T055 [P] [US1] Criar `src/components/product/HowItWorks.tsx` (4 passos numerados; linha do tempo horizontal ≥ 1024 px e vertical no mobile, ligada pelo fio champagne; lista ordenada `<ol>`)
- [X] T056 [P] [US1] Criar `src/components/sections/HeroSection.tsx` (título serifado em 7 de 12 colunas, proposta em uma frase, CTA primário `Button` "Conhecer o Planner 2027" → `#planner-2027`; à direita, a régua editorial com o índice tipográfico das seções do produto, sem simular o produto) (FR-001, FR-003, design-system §5)
- [X] T057 [P] [US1] Criar `src/components/sections/ProductIntroSection.tsx` (`id="planner-2027"`; nome, descrição, período, `formatLabel` em destaque, `FeatureList` e a frase de limitações do FR-005)
- [X] T058 [P] [US1] Criar `src/components/sections/BenefitsSection.tsx` (lista editorial numerada em duas colunas, com fios entre os itens) e `src/components/sections/HowItWorksSection.tsx` (envolve `HowItWorks` com `SectionHeader` numerado)
- [X] T059 [US1] Criar `src/app/(site)/page.tsx` compondo, nesta ordem, `HeroSection` → `ProductIntroSection` → `BenefitsSection` → `HowItWorksSection` (deixando comentários de posição para demonstração, avaliações e compra, que entram nas US2, US3 e US6), com `metadata` via `buildPageMetadata` (depende de T053–T058)
- [X] T060 [US1] Verificação da US1: rodar `npm run typecheck`, `lint`, `test`, `build` e `e2e:matrix`; conferir que T049 e T050 passam; revisar visualmente a home nas 6 larguras e registrar em `specs/001-novera-site-mvp/checklists/verificacao-manual.md`

**Checkpoint**: a home comunica marca e produto de forma independente (MVP mínimo publicável em prévia).

---

## Fase 4: História de Usuário 2 — Acessar a compra com segurança (Prioridade: P1)

**Objetivo**: CTA de compra único (`PurchaseCta`) com dois estados honestos, interruptor de
emergência e acesso à compra em ≤ 2 interações (FR-015 a FR-018, contrato de rotas §3).

**Teste independente**: V-03 a V-06 nos dois estados de configuração (build `padrao` e
fixtures `vendas-abertas` e `interruptor`).

### Testes da US2

- [X] T061 [P] [US2] Escrever `tests/unit/sales.test.ts` para `resolveSalesState`: padrão → `nao-abertas`; `vendas-abertas` válido → `abertas` com URL e rótulo da plataforma ("Kiwify"/"Hotmart"); override `nao-abertas` sobre vendas abertas → `nao-abertas`; preço com `status: 'pendente'` → sem preço; preço `aprovado` → "R$ 00,00" formatado em pt-BR
- [X] T062 [P] [US2] Criar `tests/fixtures/content/vendas-abertas.ts` exportando `fixture` com `sales: { state: 'vendas-abertas', platform: 'kiwify', checkoutUrl: 'https://pay.kiwify.com.br/teste-e2e', price: null }` e um comentário deixando claro que é **dado de teste**, nunca usado em produção
- [X] T063 [P] [US2] Escrever `tests/e2e/compra.spec.ts`: V-03 (sem tag: nenhum `href` externo de checkout, texto "ainda não estão abertas", nenhum "R$" em nenhuma rota); V-04 (`@vendas-abertas`: CTA aponta para a URL do fixture com `target="_blank"`, `rel="noopener noreferrer"`, aviso "abre em nova aba" e nota de site externo com o nome da plataforma); V-05 (`@interruptor`: estado "não abertas" mesmo com o fixture); V-06 (de cada rota de `rotas.ts`, `/#comprar` é alcançado em ≤ 2 cliques, nos larguras de 320 e 1440 px)

### Implementação da US2

- [X] T064 [US2] Criar `src/lib/sales.ts` com `resolveSalesState(sales, override)` → `{ state: 'nao-abertas' } | { state: 'abertas', checkoutUrl, platformLabel, price?: string }`, preço formatado com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })` só quando `aprovado` (faz passar a T061)
- [X] T065 [US2] Criar `src/components/product/PurchaseCta.tsx` (variantes `hero`, `section`, `header`), lendo `getSiteContent().product.sales` e `publicEnv.NEXT_PUBLIC_SALES_OVERRIDE`: estado `nao-abertas` → texto "As vendas do Planner 2027 ainda não estão abertas." (sem `href` externo, preço, desconto ou contador); estado `abertas` → `<a>` "Comprar o Planner 2027" com `target="_blank"`, `rel="noopener noreferrer"`, ícone `ArrowUpRight`, `sr-only` "abre em nova aba" e nota visível "Pagamento seguro na <plataforma> (site externo)"; preço só se houver (depende de T064)
- [X] T066 [US2] Criar `src/components/sections/PurchaseSection.tsx` (`id="comprar"`; bloco único e calmo com `SectionHeader` e `PurchaseCta` variante `section`) e inseri-lo como última seção em `src/app/(site)/page.tsx`
- [X] T067 [US2] Adicionar o botão "Comprar" (`Button` compacto → `/#comprar`) em `src/components/layout/SiteHeader.tsx` e como último item em `src/components/layout/MobileNav.tsx` (SC-004: compra em 1 clique de qualquer página)
- [X] T068 [US2] Verificação da US2: rodar `npm run e2e:matrix` (configurações `padrao`, `vendas-abertas` e `interruptor`) e `npm test`; conferir V-03 a V-06; registrar em `specs/001-novera-site-mvp/checklists/verificacao-manual.md`

**Checkpoint**: US1 + US2 formam o núcleo comercial publicável (com vendas fechadas por padrão).

---

## Fase 5: História de Usuário 3 — Ver o produto real antes de comprar (Prioridade: P2)

**Objetivo**: seção `#demonstracao` na home com imagens e vídeo **reais** aprovados, ou o
estado informativo quando não houver materiais (FR-009 a FR-011, R-15).

**Teste independente**: V-07 (estado vazio, sem `<img>`) e V-08 (todo `<img>` com `alt`
descritivo, quando houver material real).

### Testes da US3

- [X] T069 [P] [US3] Escrever `tests/unit/demo.test.ts`: `selectApprovedDemo` só retorna materiais `aprovado`; `assertDemoFilesExist` lança erro quando um material aprovado aponta para arquivo inexistente em `public/`; vídeo sem `poster` ou `textEquivalent` é rejeitado pelo schema
- [X] T070 [P] [US3] Escrever `tests/e2e/demonstracao.spec.ts`: V-07 (sem materiais aprovados, `#demonstracao` mostra "As imagens do produto serão publicadas em breve" e contém 0 `<img>` e 0 `<video>`; nenhum texto alegando demonstrações realizadas); V-08 (`test.skip` documentado enquanto não houver material real aprovado: cada `<img>` da seção tem `alt` não vazio; vídeo com `controls`, `muted`, sem `autoplay`, com equivalente textual visível)

### Implementação da US3

- [X] T071 [US3] Criar `src/content/produtos/planner-2027/demonstracao.ts` (`export const demo: DemoMaterial[] = []`, com comentário explicando como registrar uma captura real: `src`, `alt` descrevendo o conteúdo real, `caption`, `section`, `status`) e importá-lo em `src/content/produtos/planner-2027/index.ts`
- [X] T072 [US3] Criar `src/lib/demo.ts` com `selectApprovedDemo` e `assertDemoFilesExist` (usa `node:fs` sobre `public/`) e chamá-lo em `getSiteContent()` em `src/content/index.ts`, para que o build falhe se um material aprovado não existir no disco (faz passar a T069)
- [X] T073 [P] [US3] Criar `scripts/otimizar-imagens.mjs` (sharp): lê as capturas originais de um diretório passado por argumento (padrão `media-originais/planner-2027/`) e gera AVIF e WebP em 640, 1080 e 1600 px em `public/media/planner-2027/`, imprimindo largura e altura de cada uma para o registro em `demonstracao.ts` (R-15)
- [X] T074 [P] [US3] Criar `src/components/product/ProductFigure.tsx` (`<picture>` com `srcset` AVIF/WebP das 3 larguras, `width`/`height` obrigatórios para evitar CLS, `alt` obrigatório pelo tipo, legenda em `<figcaption>`, `--radius-md`, `--shadow-paper`; propriedade `priority` só para o hero; sem moldura de dispositivo falsa)
- [X] T075 [US3] Criar `src/components/product/DemoGallery.tsx` (`'use client'`): página principal grande + tira de miniaturas rotuladas pela seção (`navegacao`, `diario`, `semanal`…) como botões com `aria-pressed`; legenda do que cada imagem mostra; pares de navegação por links (origem → destino) com legenda textual; vídeo com `controls`, `muted`, `preload="none"`, `poster` e equivalente textual visível; transição de troca de imagem só por CSS (zerada com movimento reduzido); com lista vazia, renderiza `Notice` "As imagens do produto serão publicadas em breve" (FR-010)
- [X] T076 [US3] Criar `src/components/sections/DemoSection.tsx` (`id="demonstracao"`, dentro de `PaperBand`, com `SectionHeader` e `DemoGallery`) e inseri-lo em `src/app/(site)/page.tsx` logo após `ProductIntroSection` (ordem do FR-002)
- [X] T077 [US3] Adicionar o item "Demonstração" → `/#demonstracao` em `site.nav` (`src/content/site.ts`) e fazer `src/components/sections/HeroSection.tsx` usar o primeiro material aprovado como recorte real (via `ProductFigure` com `priority`) quando existir, mantendo a régua editorial tipográfica quando não houver
- [X] T078 [US3] Verificação da US3: rodar `npm test` e `npm run e2e:matrix`; conferir V-07 e o estado sem lacunas visuais nas 6 larguras; registrar em `specs/001-novera-site-mvp/checklists/verificacao-manual.md`. **Quando P-09 for entregue** (ação do responsável): exportar capturas do PDF aprovado sem alterá-lo, rodar `npm run images:otimizar`, registrá-las em `demonstracao.ts` com `status: 'aprovado'` após conferência, remover o `test.skip` de V-08 e rodar a suíte de novo

**Checkpoint**: a demonstração funciona com zero ou N materiais reais, sem simulação.

---

## Fase 6: História de Usuário 4 — Conhecer os detalhes do produto (Prioridade: P2)

**Objetivo**: página `/planner-2027` com descrição, conteúdo incluído, exemplos reais,
formato, navegação interna, orientações, compatibilidade verificada e CTA (FR-012 a FR-014).

**Teste independente**: abrir `/planner-2027` isoladamente; V-09 (compatibilidade sem testes
mostra só requisitos gerais); nenhum parágrafo com mais de 120 caracteres repetido da home.

**Dependências**: usa `PurchaseCta` (US2) e, se já existir, `DemoGallery` (US3); sem a US3,
mostra o `Notice` de materiais pendentes.

### Testes da US4

- [X] T079 [P] [US4] Escrever `tests/unit/compatibility.test.ts` para `src/lib/compatibility.ts`: lista vazia → modo "requisitos gerais"; só `compativel` aparece como compatível; `parcial` aparece com a limitação de `notes`; `incompativel` nunca aparece como compatível
- [X] T080 [P] [US4] Escrever `tests/e2e/planner-2027.spec.ts`: presença dos blocos do US4-1 (descrição, conteúdo incluído, exemplos visuais ou estado pendente, formato, navegação interna, orientações de uso, compatibilidade, área de compra); V-02 na página; V-09 (com a lista vazia, aparecem os requisitos gerais e nenhuma das marcas `GoodNotes`, `Notability`, `Noteshelf`, `Xodo`, `Samsung Notes`, `Acrobat`, `iPad`, `Galaxy Tab` é citada como compatível); anti-duplicação (nenhum parágrafo `<p>` com mais de 120 caracteres aparece em `/` e em `/planner-2027` ao mesmo tempo, US4-4)

### Implementação da US4

- [X] T081 [US4] Criar `src/content/produtos/planner-2027/compatibilidade.ts` (`export const compatibility: CompatibilityRecord[] = []` e `generalRequirements: Copy` com o texto do US4-2: aplicativo que abra PDF com links internos e permita escrita ou anotação; a lista de aplicativos testados será publicada após os testes) e preencher em `src/content/produtos/planner-2027/index.ts` os campos `includedContent`, `usageGuidance` e a explicação da navegação interna, todos `Copy` pendente e sem repetir os textos de `src/content/home.ts`
- [X] T082 [US4] Criar `src/lib/compatibility.ts` com `resolveCompatibilityView(records)` (faz passar a T079)
- [X] T083 [P] [US4] Criar `src/components/product/CompatibilityTable.tsx` (`<table>` com `<caption>`, colunas aplicativo, sistema/dispositivo, links internos, escrita, resultado e data do teste; no modo "requisitos gerais", só o texto de `generalRequirements`)
- [X] T084 [US4] Criar `src/app/(site)/planner-2027/page.tsx` (`h1` com o nome do produto; seções: descrição, conteúdo incluído, exemplos visuais com `DemoGallery` ou `Notice`, formato com `formatLabel`, navegação interna, orientações de uso, `CompatibilityTable`, `PurchaseCta` variante `section`), com `metadata` a partir de `product.seo` (depende de T081–T083)
- [X] T085 [US4] Registrar `/planner-2027` em `src/content/rotas.ts` (`indexable: true`), adicionar "Planner 2027" como primeiro item de `site.nav` em `src/content/site.ts` e adicionar o link "Ver todos os detalhes" → `/planner-2027` em `src/components/sections/ProductIntroSection.tsx`
- [X] T086 [US4] Verificação da US4: rodar `npm test` e `npm run e2e:matrix` (a T047 passa a cobrir `/planner-2027` automaticamente); revisão visual nas 6 larguras; registrar em `specs/001-novera-site-mvp/checklists/verificacao-manual.md`

**Checkpoint**: a página de detalhes aprofunda a home sem duplicá-la.

---

## Fase 7: História de Usuário 5 — Tirar dúvidas, pedir suporte e enviar feedback privado (Prioridade: P2)

**Objetivo**: `/faq`, `/contato` com formulário de feedback privado encaminhado por e-mail,
páginas legais, rodapé completo e guarda de publicação (FR-019 a FR-026, FR-036 a FR-036c).
Esta fase também cria o **núcleo de envios** (`src/features/envios/`) que a US7 reutiliza.

**Teste independente**: navegar até o FAQ e o contato a partir de qualquer página; enviar
feedback e verificar que chega ao transporte falso e não aparece em nenhuma página pública
(V-10, V-11, V-12, V-28).

### FAQ

- [X] T087 [P] [US5] Escrever `tests/unit/faq.test.ts`: existem os 8 ids obrigatórios (`o-que-e-planner-pdf`, `precisa-de-aplicativo`, `como-escrever`, `como-funcionam-links`, `celular-ou-tablet`, `como-recebo`, `funciona-automaticamente`, `como-pedir-suporte`); a resposta de `funciona-automaticamente` menciona ausência de automações, sincronização e lembretes e o preenchimento manual (US5-2); a resposta de `celular-ou-tablet` não cita nenhuma marca da lista da T080 (US5-3)
- [X] T088 [US5] Preencher `src/content/faq.ts` com as 8 perguntas obrigatórias (ids da T087, `order` sequencial, respostas como `Copy` pendente redigidas a partir da spec; `como-recebo` explica a entrega pela plataforma de checkout sem nomeá-la enquanto P-01 estiver pendente; `como-pedir-suporte` aponta para `/contato`)
- [X] T089 [US5] Criar `src/app/(site)/faq/page.tsx` com `<details>`/`<summary>` nativos (sem JavaScript, R-06), `h1` "Dúvidas frequentes" e `metadata`; registrar `/faq` em `src/content/rotas.ts` e adicionar "Dúvidas" a `site.nav` e a `site.footer` em `src/content/site.ts`

### Páginas legais, dados da empresa e rodapé

- [X] T090 [P] [US5] Preencher `src/content/legal/privacidade.ts`, `src/content/legal/termos.ts` e `src/content/legal/informacoes-comerciais.ts` com `status: 'pendente'`, `title` e a **estrutura de tópicos obrigatórios** (sem texto jurídico inventado): a privacidade lista finalidade de cada formulário, dados coletados, operadores (Cloudflare, Resend), transferência internacional, retenção de 6 meses (FR-036c), direitos do titular e canal `/contato`; informações comerciais lista empresa (P-04), entrega, reembolso e arrependimento (P-07)
- [X] T091 [P] [US5] Criar `src/components/legal/LegalDocument.tsx` (renderiza os blocos `heading`/`paragraph`/`list` em medida de 68ch e mostra "Vigente desde …" quando aprovado; com `status: 'pendente'`, mostra só o título e o `Notice` "Documento em preparação")
- [X] T092 [US5] Criar `src/app/(site)/privacidade/page.tsx`, `src/app/(site)/termos/page.tsx` e `src/app/(site)/informacoes-comerciais/page.tsx` (cada uma com `metadata` própria e `LegalDocument`; a de informações comerciais também mostra os campos `aprovado` de `BusinessInfo` e um `Notice` para os pendentes); registrar as 3 rotas em `src/content/rotas.ts` e adicionar "Política de privacidade", "Termos" e "Informações comerciais" a `site.footer` em `src/content/site.ts` (US5-6)

### Guarda de publicação

- [X] T093 [P] [US5] Escrever `tests/unit/publication-guard.test.ts`: `collectPublicationBlockers` lista cada `Copy`, `FaqItem`, `LegalPage` e campo de `BusinessInfo` com `status: 'pendente'` (com caminho legível, por exemplo `faq.como-recebo`); lista as variáveis de `listMissingProductionEnv()`; lista `MAIL_TRANSPORT=fake`; lista `Feature` `aprovado` com `verifiedInFile: false`; conteúdo todo aprovado e ambiente completo → lista vazia
- [X] T094 [US5] Criar `src/lib/publication-guard.ts` com `collectPublicationBlockers(content, env) → Blocker[]` ([data-model.md §3](./data-model.md)) (faz passar a T093)
- [X] T095 [US5] Criar `scripts/check-publicacao.ts` (imprime os bloqueios agrupados por pendência P-xx/G-xx; sai com código 1 se houver bloqueio **e** `NOVERA_PUBLICACAO_OFICIAL=true`, ou com `--estrito`) e o script `"prebuild": "tsx scripts/check-publicacao.ts"` em `package.json`, para que o build oficial falhe com pendências (V-28)

### Núcleo de envios (compartilhado com a US7)

- [X] T096 [P] [US5] Criar `src/features/envios/result.ts` (tipo `SubmissionResult` de [data-model.md §2.3](./data-model.md)), `src/features/envios/normalize.ts` (`trim`, colapso de espaços, remoção de caracteres de controle) e `src/features/envios/log.ts` (`logSubmission({ action, outcome, reason?, durationMs })` com `console.info` estruturado, **sem** e-mail, nome ou texto)
- [X] T097 [P] [US5] Criar `src/features/envios/form-token.ts` (`issueFormToken()` gera `timestamp.assinatura` com HMAC-SHA256 via Web Crypto e `FORM_SIGNING_SECRET`; `verifyFormToken(token, now)` aceita só assinatura válida e idade entre 3 s e 2 h) e `tests/unit/form-token.test.ts` (válido, adulterado, cedo demais, expirado)
- [X] T098 [P] [US5] Criar `src/features/envios/turnstile.ts` (`verifyTurnstile(token, ip)`: `POST https://challenges.cloudflare.com/turnstile/v0/siteverify` com `TURNSTILE_SECRET_KEY`, token e `CF-Connecting-IP`; tempo limite de 5 s com `AbortSignal.timeout`; falha, timeout ou `success: false` → `false`) e `tests/unit/turnstile.test.ts` com `fetch` simulado
- [X] T099 [P] [US5] Criar `src/features/envios/mail/transport.ts` (interface `MailTransport.send({ to, from, replyTo, subject, text }) → { ok: true } | { ok: false, kind: 'quota' | 'other' }`), `src/features/envios/mail/resend.ts` (SDK `resend`, só texto puro, tempo limite de 8 s, erro de cota/limite diário → `quota`), `src/features/envios/mail/fake.ts` (grava cada e-mail como JSON em `FAKE_MAIL_DIR`; se existir o arquivo `fail-next` nesse diretório, consome-o e retorna `{ ok: false, kind: <conteúdo do arquivo: 'quota' | 'other'> }`) e `src/features/envios/mail/index.ts` (seleciona por `MAIL_TRANSPORT`); escrever `tests/unit/mail-fake.test.ts` ([contracts/encaminhamento-email.md](./contracts/encaminhamento-email.md))
- [X] T100 [US5] Criar `src/features/envios/pipeline.ts` com `processSubmission({ formData, schema, buildEmail, action })`, seguindo a sequência de [contracts/envio-formularios.md](./contracts/envio-formularios.md): honeypot `website` preenchido → `success` sem enviar; token inválido → `error/verificacao`; Turnstile reprovado → `error/verificacao`; Zod inválido → `invalid` com `fieldErrors` e `values`; normalização; envio → `success`, `error/limite` (mensagem com o e-mail de suporte, se aprovado) ou `error/envio`; `logSubmission` em todos os desfechos. Escrever `tests/unit/pipeline.test.ts` cobrindo cada ramo e a ordem das verificações, e confirmando que `values` preserva o texto em todos os erros (depende de T096–T099)

### Feedback privado em `/contato`

- [X] T101 [P] [US5] Criar `tests/e2e/helpers/fake-mail.ts` (`clearOutbox()`, `readOutbox()` → e-mails gravados em `FAKE_MAIL_DIR`, `failNext('quota' | 'other')`)
- [X] T102 [US5] Criar `src/features/envios/schemas.ts` com `feedbackSchema` (`type` em `sugestao|problema|duvida|suporte`, `message` 10–3.000 após `trim`, `replyEmail` com formato válido e ≤ 254, `name` opcional ≤ 60, `privacyAck` igual a `true`) com mensagens de erro em pt-BR, e `tests/unit/feedback-schema.test.ts` (limites e mensagens)
- [X] T103 [US5] Criar `src/features/envios/mail/templates.ts` com `buildFeedbackEmail(data, now)` (assunto `[Novera][Feedback][{Sugestão|Problema|Dúvida|Suporte}] {primeiros 50 caracteres}`, corpo idêntico ao do contrato, data no fuso de Brasília, `replyTo` = `replyEmail`) e `tests/unit/feedback-email.test.ts` (assunto, corpo, texto com `<script>` mantido como texto puro)
- [X] T104 [US5] Criar `src/features/envios/actions.ts` (`'use server'`) com `submitFeedback(prev, formData)` usando `processSubmission`, `feedbackSchema` e `buildFeedbackEmail` (depende de T100, T102, T103)
- [X] T105 [P] [US5] Criar os componentes de formulário em `src/components/ui/`: `Field.tsx` (`label` visível, ajuda e erro ligados por `aria-describedby`, `aria-invalid`), `TextArea.tsx` (mesmas regras, contador de caracteres), `ChoiceGroup.tsx` (`fieldset`/`legend` com rádios nativos), `ConsentCheckbox.tsx` e `FormStatus.tsx` (`ErrorSummary` com `role="alert"`, links para cada campo e foco programático; `SuccessMessage` com `tabIndex={-1}`, foco ao aparecer, ícone `CircleCheck` e link "Voltar ao início"); erros sempre com texto + ícone `CircleAlert` + borda, nunca só cor
- [X] T106 [P] [US5] Criar `src/features/envios/components/TurnstileWidget.tsx` (`'use client'`; carrega `https://challenges.cloudflare.com/turnstile/v0/api.js` só quando montado; modo *managed*; rótulo textual; se o script falhar ao carregar, mostra instrução textual e o e-mail de contato aprovado como alternativa) e `src/features/envios/components/PrivacyNotice.tsx` (finalidade, dados coletados, prazo de 6 meses e link para `/privacidade`; FR-023, FR-036c)
- [X] T107 [US5] Criar `src/features/envios/components/FeedbackForm.tsx` (`'use client'`, `<form action={formAction}>` com `useActionState(submitFeedback)`; campos `type`, `message`, `replyEmail`, `name`, `privacyAck`; honeypot `website` oculto com `aria-hidden`, `tabIndex={-1}`, `autoComplete="off"`; `formToken` recebido por propriedade; `TurnstileWidget`; `PrivacyNotice` acima do botão; repreenche com `values` após erro; foco no resumo de erros; botão com estado "Enviando…"; mensagem de sucesso substitui o formulário; funciona sem JavaScript) (depende de T104–T106)
- [X] T108 [US5] Criar `src/app/(site)/contato/page.tsx` (`h1` "Contato e suporte"; canais e prazo de resposta de `BusinessInfo` quando aprovados, ou `Notice` pendente; `FeedbackForm` com `formToken` emitido no servidor; texto orientando a pedir por aqui o link de avaliação perdido (FR-030a), a remoção da própria avaliação (FR-035) e a exclusão antecipada dos dados (FR-036c), **sem** link para `/avaliar`); registrar `/contato` em `src/content/rotas.ts` e adicionar "Contato" a `site.nav` e a `site.footer`
- [X] T109 [US5] Adicionar o link secundário "Tem dúvidas? Fale com a gente" (→ `/contato`) e "Ver dúvidas frequentes" (→ `/faq`) ao estado `nao-abertas` de `src/components/product/PurchaseCta.tsx` (contrato de rotas §3)
- [X] T110 [US5] Escrever `tests/e2e/faq-contato.spec.ts`: V-10 e2e (8 perguntas visíveis e expansíveis por teclado); US5-6 (de cada rota, o rodapé tem Contato, Política de privacidade, Termos e Informações comerciais); páginas legais pendentes mostram "Documento em preparação"; V-11 (envio válido após esperar 3 s → confirmação com foco; `readOutbox()` tem 1 e-mail com `replyTo` correto e assunto `[Novera][Feedback]`; o texto enviado não aparece em nenhuma rota pública); V-12 (`failNext('other')` → mensagem de erro clara e o texto continua nos campos; `failNext('quota')` → mensagem de limite); honeypot preenchido → sucesso aparente e outbox vazia; campos vazios → resumo de erros com links e foco no resumo; `@turnstile-reprova` → erro de verificação com o texto mantido (V-17 para o feedback)
- [X] T111 [US5] Acrescentar ao `src/app/especime/page.tsx` os campos `Field`, `TextArea`, `ChoiceGroup`, `ConsentCheckbox` e `FormStatus` nos estados normal, foco, erro e desabilitado
- [X] T112 [US5] Verificação da US5: rodar `npm test`, `npm run e2e:matrix` e `npm run check:publicacao` (deve listar as pendências atuais); rodar `NOVERA_PUBLICACAO_OFICIAL=true npm run build` e confirmar que **falha** listando as pendências (V-28); revisão visual de `/faq`, `/contato` e legais; registrar tudo em `specs/001-novera-site-mvp/checklists/verificacao-manual.md`

**Checkpoint**: atendimento, informações legais e bloqueio de publicação completos; o núcleo de envios está pronto para a US7.

---

## Fase 8: História de Usuário 6 — Consultar avaliações reais de compradores (Prioridade: P3)

**Objetivo**: seção `#avaliacoes` na home que **não existe no HTML** sem dados e, com dados,
mostra média, contagem, nota, comentário, nome, data e selo, em ordem cronológica
(FR-031 a FR-034, contrato de rotas §5).

**Teste independente**: V-18 (zero avaliações, build `padrao`) e V-19 (3 avaliações com nota
baixa, build `avaliacoes`).

### Testes da US6

- [X] T113 [P] [US6] Escrever `tests/unit/review-stats.test.ts` para `reviewStats`: lista vazia → `null`; 1 avaliação → média igual à nota e contagem 1; notas 5, 4 e 1 → média 3,3 e contagem 3; ordenação por `submittedOn` decrescente, nunca por nota
- [X] T114 [P] [US6] Criar `tests/fixtures/content/avaliacoes.ts` exportando `fixture` com 3 `PublishedReview` de **teste** (notas 5, 4 e 1, datas de envio diferentes, `verifiedPurchase: true`), com comentário deixando claro que nunca vão para produção
- [X] T115 [P] [US6] Escrever `tests/e2e/avaliacoes.spec.ts`: V-18 (sem tag: o HTML da home não contém `id="avaliacoes"` nem as palavras "estrela", "média" ou "avaliações"); V-19 (`@avaliacoes`: 3 avaliações exibidas, "Média 3,3 de 5 · 3 avaliações de compradores verificados", selo "Compra verificada" em todas, texto "Nota 1 de 5" presente, ordem por data decrescente, datas no formato "dd de mês de aaaa")

### Implementação da US6

- [X] T116 [US6] Criar `src/features/avaliacoes/stats.ts` com `reviewStats(reviews) → { count, average, sorted } | null` (média arredondada a 1 casa) (faz passar a T113)
- [X] T117 [US6] Criar `src/features/avaliacoes/ReviewsSection.tsx` (retorna `null` quando `reviewStats` é `null`, então nada vai para o HTML; caso contrário, `<section id="avaliacoes">` com `SectionHeader`, cabeçalho "Média X,X de 5 · N avaliação(ões) de compradores verificados" via `formatAverage` e `pluralize`, e cada avaliação como citação editorial: estrelas `Star` com `aria-hidden` + texto "Nota N de 5", comentário em `<blockquote>`, nome público, data com `formatDatePtBR` e selo "Compra verificada" textual; sem carrossel; mesmo tratamento para notas baixas)
- [X] T118 [US6] Inserir `ReviewsSection` em `src/app/(site)/page.tsx` entre `HowItWorksSection` e `PurchaseSection`; conferir que header, rodapé e demais textos da home não usam as palavras de V-18 no estado vazio
- [X] T119 [US6] Verificação da US6: rodar `npm test` e `npm run e2e:matrix` (configurações `padrao` e `avaliacoes`); revisão visual da seção com o fixture nas 6 larguras; registrar em `specs/001-novera-site-mvp/checklists/verificacao-manual.md`

**Checkpoint**: o site fica completo sem avaliações e mostra avaliações reais quando forem publicadas por PR.

---

## Fase 9: História de Usuário 7 — Enviar uma avaliação como comprador (Prioridade: P3)

**Objetivo**: página oculta `/avaliar` com formulário sem conta, encaminhado por e-mail para
moderação manual (FR-027 a FR-030a, FR-036 a FR-036b).

**Teste independente**: enviar avaliações de teste (positiva, negativa, sem autorização,
spam por honeypot) e conferir que nenhuma é publicada e que cada uma tem o destino correto
(V-13 a V-17, V-20).

**Dependências**: reutiliza o núcleo de envios e os componentes de formulário da US5
(T096–T100, T105, T106).

### Testes da US7

- [X] T120 [P] [US7] Escrever `tests/unit/review-schema.test.ts` para `reviewSchema`: nota inteira 1–5; comentário 20–1.500 após `trim`; `publicName` 2–60, rejeitando `@` e sequência de 8+ dígitos; `purchaseEmail` válido e ≤ 254; `publicationConsent` falso → mensagem com orientação para `/contato` (US7-6); `privacyAck` obrigatório; mensagens idênticas às de [data-model.md §2.1](./data-model.md)
- [X] T121 [P] [US7] Escrever `tests/unit/review-email.test.ts` para `buildReviewEmail`: assunto `[Novera][Avaliação] Nota 4 — {publicName}`; corpo idêntico ao do [contrato de e-mail](./contracts/encaminhamento-email.md), inclusive "NÃO publicada" e os próximos passos de moderação; `replyTo` = `purchaseEmail`; data no fuso de Brasília
- [X] T122 [P] [US7] Escrever `tests/e2e/avaliar.spec.ts`: V-13 (envio vazio → resumo de erros com links, foco no resumo, texto digitado mantido); V-14 (sem autorização → não aceita, mensagem com link para `/contato`, outbox vazia); V-15 (envio válido após 3 s → mensagem "publicada somente depois que confirmarmos a compra e fizermos a moderação"; outbox com 1 e-mail `[Novera][Avaliação]`; o comentário não aparece em nenhuma rota pública); V-16 (honeypot → sucesso aparente, outbox vazia); V-17 (`@turnstile-reprova` → erro de verificação, texto mantido); `RatingInput` operável só com teclado (setas e espaço); V-20 (`/sitemap.xml` sem `/avaliar`; `<meta name="robots" content="noindex, nofollow">` em `/avaliar`; nenhuma rota de `rotas.ts` contém `a[href*="/avaliar"]`)

### Implementação da US7

- [X] T123 [US7] Adicionar `reviewSchema` em `src/features/envios/schemas.ts` (campos e mensagens de [data-model.md §2.1](./data-model.md)) (faz passar a T120)
- [X] T124 [US7] Adicionar `buildReviewEmail(data, now)` em `src/features/envios/mail/templates.ts` (faz passar a T121)
- [X] T125 [US7] Adicionar `submitReview(prev, formData)` em `src/features/envios/actions.ts` usando `processSubmission`, `reviewSchema` e `buildReviewEmail` (depende de T123, T124)
- [X] T126 [P] [US7] Criar `src/components/ui/RatingInput.tsx` (`'use client'`; `fieldset` com `legend` "Sua nota", 5 rádios nativos estilizados como estrelas com rótulos "1 de 5" … "5 de 5", foco visível em cada estrela, erro por `aria-describedby`; funciona sem JavaScript)
- [X] T127 [US7] Criar `src/features/envios/components/ReviewForm.tsx` (`'use client'`, `useActionState(submitReview)`; campos `rating` (`RatingInput`), `comment` (`TextArea`), `publicName` (ajuda: "pode ser nome, primeiro nome com inicial ou apelido"), `purchaseEmail` (ajuda: "usado só para confirmar a compra; nunca é publicado"), `publicationConsent` e `privacyAck` (`ConsentCheckbox`); honeypot, `formToken`, `TurnstileWidget`, `PrivacyNotice`; mesmo comportamento de erro, carregamento, sucesso e repreenchimento da T107) (depende de T125, T126)
- [X] T128 [US7] Criar `src/app/(site)/avaliar/page.tsx` (`metadata` via `buildPageMetadata({ noindex: true })`; `h1` "Avalie o Planner 2027"; explicação de que a avaliação só é publicada após a confirmação manual da compra e a moderação, e de que notas baixas também são publicadas; `ReviewForm` com `formToken` emitido no servidor); registrar `/avaliar` em `src/content/rotas.ts` com `indexable: false` e **não** adicioná-la a `site.nav` nem a `site.footer` (FR-030a)
- [X] T129 [US7] Acrescentar o `RatingInput` em todos os estados ao `src/app/especime/page.tsx`
- [X] T130 [US7] Verificação da US7: rodar `npm test` e `npm run e2e:matrix`; conferir V-13 a V-17 e V-20; cronometrar um envio completo de avaliação (meta de até 3 minutos, SC-009) e de feedback (até 2 minutos); registrar em `specs/001-novera-site-mvp/checklists/verificacao-manual.md`

**Checkpoint**: todas as histórias funcionam de forma independente.

---

## Fase 10: Acabamento e Itens Transversais

**Objetivo**: rastreamento de links, capturas, deploy, documentação, medições e o
checklist de publicação oficial (fase técnica 9 do plano).

- [X] T131 [P] Escrever `tests/e2e/links.spec.ts` (V-21): rastreador que parte de `/`, segue todos os `<a href>` internos, inclusive âncoras, e confirma 0 respostas ≠ 200, 0 âncoras sem destino e 0 `href` vazio ou `"#"`; roda sem tag e com `@vendas-abertas`
- [X] T132 [P] Escrever `tests/e2e/capturas.spec.ts` (apoio a V-31): captura de página inteira de cada rota de `rotas.ts` nas 6 larguras de `viewports.ts`, gravada em `test-results/capturas/<rota>-<largura>.png` (sem comparação de pixels), e garantir que o upload desse diretório está em `.github/workflows/ci.yml`
- [X] T133 [P] Criar `.github/workflows/deploy.yml`: dispara só na `main` depois do workflow `ci` verde (`workflow_run`), roda `npm ci` e `npm run deploy:cf` com os segredos `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`; os segredos do Worker (Resend, Turnstile, `FORM_SIGNING_SECRET`, `NOVERA_INBOX_EMAIL`) são configurados só no painel da Cloudflare ou por `wrangler secret put`, nunca no repositório
- [X] T134 [P] Escrever `README.md`: pré-requisitos, instalação, scripts, variáveis (link para [contracts/ambiente.md](./contracts/ambiente.md)), como mudar conteúdo e status `pendente`/`aprovado`, como abrir as vendas e usar o interruptor, como adicionar material de demonstração (`images:otimizar`), deploy e plano B, proteção da `main` e, em detalhe, a **rotina de moderação**: marcadores da caixa (`Novera/Avaliação/Pendente`, `/Publicada`, `/Rejeitada`), verificação da compra no painel do checkout, motivos de rejeição permitidos (FR-029), publicação por PR em `src/content/avaliacoes.ts` sem o e-mail, remoção a pedido (FR-035), reenvio do link de `/avaliar`, resposta a feedback e exclusão mensal dos e-mails com mais de 6 meses (FR-036c)
- [X] T135 Repetir a prova de hospedagem com o app completo (V-32): `npm run preview:cf`, tamanho do Worker comprimido ≤ 3 MiB e tempo de CPU das Server Actions; registrar em `specs/001-novera-site-mvp/research.md` (R-03a) e em `specs/001-novera-site-mvp/checklists/verificacao-manual.md`
- [X] T136 Medir o orçamento de JavaScript a partir da saída do `npm run build` (≤ 90 KB comprimidos nas páginas sem formulário; confirmar que o Turnstile só carrega em `/contato` e `/avaliar`) e registrar em `specs/001-novera-site-mvp/checklists/verificacao-manual.md`; corrigir se passar do limite
- [X] T137 Validar a expansão de produtos (SC-012): criar `tests/fixtures/content/produto-teste.ts` com um segundo produto fictício (nunca publicado) e renderizá-lo no `src/app/especime/page.tsx` com os mesmos componentes de produto (`ProductIntroSection`, `FeatureList`, `CompatibilityTable`, `PurchaseCta`); confirmar que não foram necessários novos padrões visuais e registrar em `specs/001-novera-site-mvp/checklists/verificacao-manual.md`
- [X] T138 [P] Atualizar a tabela "Pendências de Decisão" de `specs/001-novera-site-mvp/spec.md` com G-01 (domínio) e G-03 (termos da hospedagem), conforme recomendação do plano
- [X] T139 Limpeza final: remover código morto, exports e dependências sem uso (conferir `package.json` contra os imports), arquivos de exemplo restantes; `npm run lint`, `npm run format:check` e `npm run typecheck` sem erros
- [ ] T140 **Manual**: V-25 (teclado em todas as rotas), V-30 (NVDA no Windows e TalkBack ou VoiceOver no celular em home, `/avaliar` e `/contato`), V-31 (capturas do CI nas 6 larguras + celular Android, iPhone se disponível e tablet; teste de reconhecimento sem logotipo, design-system §6.5) e V-29 (PageSpeed Insights mobile na prévia de produção: LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms); registrar valores e evidências em `specs/001-novera-site-mvp/checklists/verificacao-manual.md`
- [ ] T141 **Ação do responsável**: conferir cada `Feature` e cada texto do produto contra o PDF real e marcar `verifiedInFile: true` só no que existir (SC-003, FR-006); aprovar a redação final (P-10) trocando `status` para `aprovado` em `src/content/`; fornecer os dados de P-01 a P-07, G-01 e G-02. Nenhum desses valores pode ser preenchido sem a informação do responsável
- [ ] T142 **Manual, depois da T141**: teste de compreensão com pelo menos 5 pessoas do público-alvo (SC-001: ≥ 4/5 descrevem a marca; SC-002: ≥ 90% respondem que não é um aplicativo), registrado em `specs/001-novera-site-mvp/checklists/verificacao-manual.md`
- [ ] T143 Executar o [quickstart.md](./quickstart.md) completo (V-01 a V-32) e o checklist de publicação oficial (§5): `npm run check:publicacao` sem pendências, termos da hospedagem confirmados (G-03), domínio verificado no Resend, hostname no Turnstile, envio real de teste chegando à caixa, link de `/avaliar` previsto no PDF (G-05); anexar as evidências ao PR de publicação. Nada é declarado como feito sem execução

---

## Dependências e Ordem de Execução

### Dependências entre fases

- **Configuração (Fase 1)**: sem dependências. T016 (prova técnica) pode exigir decisão do responsável antes de seguir.
- **Fundação (Fase 2)**: depende da Fase 1. **Bloqueia todas as histórias.**
- **US1 (Fase 3)** e **US2 (Fase 4)**: dependem só da Fundação. A T066 insere a seção na home criada na T059; se a US2 for feita antes da US1, criar `src/app/(site)/page.tsx` mínimo com a `PurchaseSection`.
- **US3 (Fase 5)**: depende da Fundação; integra-se à home da US1 (T076, T077).
- **US4 (Fase 6)**: depende da Fundação e da **US2** (`PurchaseCta`); usa `DemoGallery` da US3 se existir.
- **US5 (Fase 7)**: depende da Fundação; a T109 altera o `PurchaseCta` da US2 (pular se a US2 ainda não existir e fazer depois).
- **US6 (Fase 8)**: depende da Fundação; integra-se à home (T118).
- **US7 (Fase 9)**: depende da **US5** (núcleo de envios T096–T100 e componentes T105–T106).
- **Acabamento (Fase 10)**: depende das histórias desejadas; T141–T143 dependem de informações do responsável.

### Grafo de conclusão das histórias

```text
Fase 1 → Fase 2 ─┬─ US1 (P1) ─┬─ US3 (P2)
                 │            └─ US6 (P3)
                 ├─ US2 (P1) ─── US4 (P2)
                 └─ US5 (P2) ─── US7 (P3)
                                         └─→ Fase 10
```

### Dentro de cada história

- Testes primeiro, falhando antes da implementação.
- Conteúdo (`src/content/`) → lógica pura (`src/lib/`, `src/features/`) → componentes → página → registro de rota e navegação → verificação.
- A tarefa de verificação fecha a história; não avançar com testes vermelhos.

### Oportunidades de paralelismo

- **Fase 1**: T003–T009 e T011–T014 em paralelo depois da T002.
- **Fase 2**: T020, T021, T024, T028–T035, T037, T039, T041–T043 e T045 em paralelo (arquivos diferentes).
- **Entre histórias**: depois da Fundação, US1, US2 e US5 podem andar em paralelo; depois, US3/US6 (sobre a home), US4 (sobre a US2) e US7 (sobre a US5).
- **Cuidado com arquivos compartilhados**: `src/app/(site)/page.tsx` (US1, US2, US3, US6), `src/content/site.ts` e `src/content/rotas.ts` (US3, US4, US5, US7), `src/features/envios/schemas.ts`, `templates.ts` e `actions.ts` (US5, US7) e `src/app/especime/page.tsx`. Tarefas que tocam o mesmo arquivo devem ser feitas em sequência.

---

## Exemplos de Execução Paralela

### US1

```text
Tarefa: "T049 tests/unit/product.test.ts"
Tarefa: "T050 tests/e2e/home.spec.ts"
Tarefa: "T052 src/content/home.ts"
# depois da T053:
Tarefa: "T054 src/components/product/FeatureList.tsx"
Tarefa: "T055 src/components/product/HowItWorks.tsx"
Tarefa: "T056 src/components/sections/HeroSection.tsx"
Tarefa: "T057 src/components/sections/ProductIntroSection.tsx"
Tarefa: "T058 src/components/sections/BenefitsSection.tsx + HowItWorksSection.tsx"
```

### US2

```text
Tarefa: "T061 tests/unit/sales.test.ts"
Tarefa: "T062 tests/fixtures/content/vendas-abertas.ts"
Tarefa: "T063 tests/e2e/compra.spec.ts"
```

### US3

```text
Tarefa: "T069 tests/unit/demo.test.ts"
Tarefa: "T070 tests/e2e/demonstracao.spec.ts"
Tarefa: "T073 scripts/otimizar-imagens.mjs"
Tarefa: "T074 src/components/product/ProductFigure.tsx"
```

### US4

```text
Tarefa: "T079 tests/unit/compatibility.test.ts"
Tarefa: "T080 tests/e2e/planner-2027.spec.ts"
Tarefa: "T083 src/components/product/CompatibilityTable.tsx"
```

### US5

```text
Tarefa: "T087 tests/unit/faq.test.ts"
Tarefa: "T090 src/content/legal/*.ts"
Tarefa: "T091 src/components/legal/LegalDocument.tsx"
Tarefa: "T093 tests/unit/publication-guard.test.ts"
Tarefa: "T096 src/features/envios/result.ts + normalize.ts + log.ts"
Tarefa: "T097 src/features/envios/form-token.ts"
Tarefa: "T098 src/features/envios/turnstile.ts"
Tarefa: "T099 src/features/envios/mail/*"
Tarefa: "T105 src/components/ui/Field.tsx, TextArea.tsx, ChoiceGroup.tsx, ConsentCheckbox.tsx, FormStatus.tsx"
Tarefa: "T106 TurnstileWidget.tsx + PrivacyNotice.tsx"
```

### US6

```text
Tarefa: "T113 tests/unit/review-stats.test.ts"
Tarefa: "T114 tests/fixtures/content/avaliacoes.ts"
Tarefa: "T115 tests/e2e/avaliacoes.spec.ts"
```

### US7

```text
Tarefa: "T120 tests/unit/review-schema.test.ts"
Tarefa: "T121 tests/unit/review-email.test.ts"
Tarefa: "T122 tests/e2e/avaliar.spec.ts"
Tarefa: "T126 src/components/ui/RatingInput.tsx"
```

---

## Estratégia de Implementação

### MVP primeiro (US1 + US2)

1. Fase 1 (Configuração) e Fase 2 (Fundação).
2. Fase 3 (US1): home com marca, produto, benefícios e "Como funciona".
3. **PARAR e VALIDAR**: V-01, V-02 e a revisão visual.
4. Fase 4 (US2): área de compra com vendas fechadas por padrão. O par US1 + US2 é o menor
   incremento com valor comercial e seguro (nada leva a destino inexistente).
5. Deploy de prévia (sem publicação oficial: a guarda continua listando as pendências).

### Entrega incremental

1. Fundação → US1 → US2 → prévia.
2. US3 (demonstração, pronta para receber P-09) e US4 (detalhes) → prévia.
3. US5 (FAQ, contato, legais, guarda) → prévia. Pré-requisito para a publicação oficial.
4. US6 (avaliações, invisível até haver dados) e US7 (envio de avaliações) → prévia.
5. Fase 10 → checklist de publicação oficial → deploy de produção.

### Equipe em paralelo

Depois da Fundação: pessoa A em US1 → US3 → US6; pessoa B em US2 → US4; pessoa C em
US5 → US7. Combinar a ordem das edições nos arquivos compartilhados listados acima.

---

## Observações

- [P] = arquivos diferentes, sem dependências pendentes.
- [USn] liga a tarefa à história da spec, para rastreabilidade.
- Cada história termina com uma tarefa de verificação real (Constitution VIII).
- Fazer commit ao fim de cada tarefa ou grupo lógico, na branch da funcionalidade.
- Evitar: tarefas vagas, conflitos no mesmo arquivo, dependências entre histórias que quebrem a independência e qualquer dado comercial inventado.

---

## Notas de implementação (2026-11-21)

Desvios em relação ao texto das tarefas, decididos durante a execução:

- **T002**: o template do Next 16.4.6 vem com `cacheComponents: true`; foi desligado para manter o
  SSG clássico do plano (R-02) e reduzir o risco no OpenNext. Next 16.4.6, React 19.3.0, TS 5.9.3.
- **T036**: em vez da CLI do shadcn (que traria `clsx`, `tailwind-merge` e `class-variance-authority`),
  o `Sheet` foi escrito diretamente sobre `@radix-ui/react-dialog` seguindo o padrão do shadcn.
- **T026**: o alias `@content-fixture` foi configurado só no Turbopack (o bundler padrão do Next 16);
  não há configuração de webpack.
- **T097/T107/T127**: as páginas são estáticas, então o token de formulário não pode ser emitido no
  build (expiraria). Ele é emitido quando o formulário aparece, pela Server Action `getFormToken`.
  Sem JavaScript o envio não passa, mas o Turnstile já exige JavaScript.
- **T099/T101**: o transporte falso simula falhas por marcador no texto (`[[falhar:envio]]`,
  `[[falhar:cota]]`) em vez do arquivo `fail-next`, para os testes e2e rodarem em paralelo sem
  estado compartilhado. O helper `fake-mail.ts` virou parte de `tests/e2e/helpers/support.ts`.
- **T100**: exceções do transporte de e-mail viram "falha de envio" (nunca erro 500).
- **T133 (deploy)**: o build de deploy no CI não tem os segredos do Worker; com
  `NOVERA_GUARDA_SOMENTE_BUILD=true` a guarda confere só as variáveis de build, e os segredos são
  conferidos com `npx wrangler secret list` no checklist de publicação.
- **T136**: o orçamento de 90 KB de JavaScript não é alcançável com Next 16 + React 19 (~128 KB só
  do framework). Medição e decisão pendente em `checklists/verificacao-manual.md`.
- **Cabeçalho**: o botão "Comprar" aparece em todas as larguras (inclusive 320 px), garantindo a
  compra em 1 clique (SC-004).

Tarefas em aberto: **T001** (falta ligar o repositório ao GitHub e fazer o primeiro commit; precisa
da URL do remoto), **T017** (configuração manual no GitHub), **T048** (revisão visual humana do
`/especime`), **T136** (decisão sobre o orçamento de JS) e **T140 a T143** (verificações manuais e
ações do responsável).

### Atualização (2026-11-21, respostas do responsável)

- **T001**: remoto `origin` = `https://github.com/JoaoKruschewsky/novera.git`. A `main` remota só
  tinha o commit inicial com um `README.md` de uma linha; a branch foi baseada nela com
  `git reset origin/main` (não destrutivo; o `README.md` local substitui o de uma linha). Como toda
  a implementação já estava pronta, o primeiro commit leva o projeto inteiro, não só os artefatos do
  Spec Kit, e as fases 2+ ficaram na `feature/initial-config` (não houve `feature/001-novera-site-mvp`).
- **T017**: o responsável ativou "Allow GitHub Actions to create and approve pull requests". Por
  decisão dele, **não** haverá ruleset/proteção na `main`; os checks do CI rodam, mas não são
  obrigatórios para o merge.
- **T136**: decisão do responsável: trocar o menu mobile por `<dialog>` nativo (Radix Dialog e
  `Sheet.tsx` removidos) e aceitar bibliotecas quando fizerem sentido; a meta de 90 KB fica
  registrada como inalcançável com Next 16 + React 19. Nova medição em `verificacao-manual.md`.
- **P-05 (parcial) / G-02**: e-mail da empresa `novera.brazil@gmail.com` aprovado em
  `src/content/empresa.ts`; é também a caixa que recebe os envios (`NOVERA_INBOX_EMAIL`, segredo
  do Worker). Horário de atendimento e prazo de resposta continuam pendentes.
- **P-07 (parcial)**: texto da política de reembolso fornecido pelo responsável e incluído em
  `src/content/legal/informacoes-comerciais.ts`. A página continua `pendente` porque ainda faltam
  P-04 (dados da empresa) e P-01 (plataforma e entrega).

- **Reembolso**: o responsável mantém o texto como está por enquanto (ponto de atenção sobre o
  art. 49 do CDC registrado e conhecido).
- **E-mail agnóstico de provedor** (decisão do responsável, 2026-11-22): novo transporte
  `MAIL_TRANSPORT=smtp` (`src/features/envios/mail/smtp.ts`, `nodemailer`) que envia por qualquer
  caixa (Gmail, Outlook, domínio próprio) com `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASSWORD`;
  `MAIL_FROM` aceita qualquer endereço. O Resend continua como opção. A guarda aceita `smtp` ou
  `resend` e exige as variáveis do transporte escolhido; o deploy usa `smtp` por padrão
  (`vars.MAIL_TRANSPORT`). O `nodemailer` roda também no Worker (`nodejs_compat` fornece
  `node:net`/`node:tls`); `worker-mailer` foi testado e descartado (exige `serverExternalPackages`,
  que no Windows falha ao criar symlinks no build do OpenNext). Prova local: formulário enviado pelo
  preview do Worker (workerd) chegou a um servidor SMTP de teste com AUTH, From, Reply-To e assunto
  corretos. **Pendente**: envio real pelo Gmail (porta 465, TLS) com a senha de app, no Worker publicado.
- **Demonstração com materiais reais** (2026-11-24, materiais fornecidos pelo responsável):
  vídeo de apresentação (25 s, recomprimido de 5,9 MB para 1,7 MB, capa tirada do próprio vídeo),
  5 fotos do planner em tablet (AVIF/WebP 640/1080/1600) numa faixa em movimento (marquee) e a
  prévia gratuita em PDF (5 páginas, 99 KB) para download. Novo campo `product.freeSample` no
  schema. O responsável aprovou as fotos em ambiente (mockups de tablet), o que flexibiliza a
  regra "sem moldura de dispositivo" da R-15; as telas mostram páginas do produto. Exceções de
  movimento registradas no design-system §2.6. Originais em `media-originais/` (fora do Git).
- **Workflows separados por contexto** (pedido do responsável, 2026-11-24): `ci.yml` e
  `deploy.yml` (T011, T133) foram substituídos por `feat.yml` (**FEAT**: push nas branches de
  trabalho, verificações rápidas sem e2e), `pr-main.yml` (**PR → main**: bateria completa),
  `main.yml` (**MAIN**: bateria completa + deploy) e o reutilizável `_verificacoes.yml`. O
  `auto-pr.yml` passou a se chamar "FEAT · abrir PR" e dispara o `pr-main.yml` por
  `workflow_dispatch` logo após abrir o PR (PR criado pelo `GITHUB_TOKEN` não dispara
  `pull_request`). O deploy deixou de usar `workflow_run` e virou um job que depende das
  verificações no mesmo workflow.
