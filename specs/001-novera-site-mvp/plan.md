# Plano de Implementação: MVP do Site Oficial Novera

**Branch**: `001-novera-site-mvp` (diretório Spec Kit) → branch Git `feature/001-novera-site-mvp` (ver R-14) | **Data**: 2026-11-18 | **Spec**: [spec.md](./spec.md)

**Entrada**: especificação em `specs/001-novera-site-mvp/spec.md` (com Clarifications de
2026-11-18) e Constitution da Novera v1.1.0.

**Artefatos deste plano**: [research.md](./research.md) · [design-system.md](./design-system.md) ·
[data-model.md](./data-model.md) · [contracts/](./contracts/) · [quickstart.md](./quickstart.md)

## Resumo

Site institucional e comercial da Novera para apresentar e vender o Novera Planner Digital
2027 (PDF interativo). A abordagem técnica:

- **Next.js 16 (App Router) + TypeScript strict + Tailwind 4**, com todas as páginas
  **geradas estaticamente** a partir de conteúdo tipado e versionado no repositório.
- **Design system próprio "papel sobre grafite"**: tokens semânticos sobre a paleta aprovada,
  Newsreader + Hanken Grotesk, composição editorial. O shadcn/ui é usado só no menu mobile.
- **Compra** por CTA único configurado no conteúdo, que leva ao checkout externo (Kiwify ou
  Hotmart, P-01). Com o checkout não configurado, mostra o estado "vendas ainda não abertas".
- **Avaliações e feedback sem banco de dados**: duas Server Actions validam (Zod), verificam o
  antispam (Turnstile + honeypot + token de tempo) e **encaminham por e-mail** (Resend) para a
  caixa da Novera. As avaliações aprovadas são publicadas por PR em
  `src/content/avaliacoes.ts`. Média e contagem vêm só dos dados reais.
- **Hospedagem a custo zero** na Cloudflare Workers (plano gratuito, adaptador OpenNext), com
  verificação técnica e de termos antes da publicação. O plano B é a Netlify Free.

## Contexto Técnico

**Linguagem/Versão**: TypeScript (estável mais recente aceita pelo Next 16, `strict`), Node.js 24 LTS.

**Dependências principais**: next 16.x, react / react-dom 19.2.x, tailwindcss 4.x,
lucide-react, zod, menu mobile com `<dialog>` nativo (Radix removido na T136), resend (SDK),
@opennextjs/cloudflare + wrangler (deploy). Dependências de desenvolvimento: eslint (+
eslint-config-next, typescript-eslint, eslint-plugin-jsx-a11y), prettier (+
prettier-plugin-tailwindcss), vitest, @playwright/test, @axe-core/playwright, sharp (script de
imagens). Versões exatas fixadas na Fase 1 (R-01). **Sem Motion** no MVP (R-06).

**Armazenamento**: nenhum banco. Conteúdo em módulos TS versionados; envios só por e-mail
(FR-036a).

**Testes**: Vitest (unidade), Playwright + axe (e2e e acessibilidade), revisão manual de
teclado, leitor de tela e visual ([quickstart.md](./quickstart.md)).

**Plataforma alvo**: navegadores modernos (2 últimas versões de Chrome, Safari iOS, Firefox,
Edge, Samsung Internet), mobile-first; hospedagem Cloudflare Workers.

**Tipo de projeto**: aplicação web única (Next.js), sem backend separado.

**Metas de desempenho**: LCP ≤ 2,5 s em conexão móvel típica (SC-011), CLS ≤ 0,1,
INP ≤ 200 ms; JavaScript de cliente nas páginas sem formulário ≤ 90 KB comprimidos (base do
Next + menu); fontes ≤ 2 arquivos variáveis com subconjunto latin. As metas são verificadas
por medição; pontuação de ferramenta não é garantia.

**Restrições**: custo recorrente zero no lançamento; sem login, painel, pagamento próprio ou
banco; WCAG 2.2 AA; conteúdo só pt-BR; nada inventado (Constitution IV).

**Escala/Escopo**: 8 rotas públicas + 404; 1 produto; volume baixo de envios (bem abaixo de
100 por dia); tráfego inicial de baixo volume.

Não há itens "NEEDS CLARIFICATION" técnicos em aberto: todos foram resolvidos em
[research.md](./research.md). As lacunas de **negócio** encontradas (G-01 a G-05) estão
registradas em research.md e na seção Riscos e Pendências; elas não bloqueiam a
implementação, só a publicação.

## Constitution Check

*Portão: avaliado antes da Fase 0 e reavaliado após a Fase 1 (design). Resultado: **APROVADO**, sem violações.*

| Princípio | Como o plano atende | Situação |
|---|---|---|
| **I. Simplicidade** | Sem banco, CMS, autenticação nem Motion; conteúdo em arquivos TS; um único app; shadcn só no menu; FAQ com `<details>`; expansão de produtos por diretório, sem catálogo | ✅ |
| **II. Design autoral** | Design system antes das páginas ([design-system.md](./design-system.md)); tokens primitivos e semânticos; lint bloqueia cores soltas; lista de proibições; revisão visual com checklist | ✅ |
| **III. Usabilidade e acessibilidade** | Mobile-first; 1 CTA primário por seção; WCAG 2.2 AA com axe + revisão manual; contraste medido; formulários com erros explicativos; `prefers-reduced-motion`; sem pop-ups | ✅ |
| **IV. Integridade comercial** | Status `pendente`/`aprovado` em todo conteúdo; `Feature.verifiedInFile`; preço só aprovado; seção de avaliações inexistente sem dados; ordem cronológica (não por nota); selo só para compra verificada manualmente; feedback nunca publicado; guarda de publicação | ✅ |
| **V. Qualidade de código** | TS strict; ESLint + Prettier; separação `app/` (rotas) · `components/` · `features/` · `content/` · `lib/` · `styles/`; sem código morto (lint `no-unused`) | ✅ |
| **VI. Segurança e configuração** | Segredos só no servidor e na hospedagem; env validado por Zod; validação no servidor; antispam; dados mínimos; nada de dados pessoais em logs ou no repositório; prazo de 6 meses; operadores declarados na política | ✅ |
| **VII. Performance e SEO** | SSG; Server Components por padrão; JS de cliente só no menu e nos formulários; fontes locais; imagens AVIF/WebP pré-geradas; metadados, OG, sitemap e robots | ✅ |
| **VIII. Verificação real** | Quickstart com 32 cenários mapeados à spec; CI com typecheck, lint, testes e build; checklist de publicação; nada declarado sem execução | ✅ |
| **IX. Git** | Repositório novo com `main` protegida (ou processo documentado), `feature/`, `fix/`, `chore/`, Conventional Commits, PR com CI obrigatório; nenhuma operação destrutiva | ✅ |
| **Limites do MVP** | Usa a exceção de "processamento no servidor" só para encaminhar formulários; **não** usa armazenamento (mais restritivo que o permitido); checkout externo | ✅ |
| **Novas dependências** | Cada uma justificada em research.md (R-01, R-06, R-08, R-09, R-12, R-13, R-15) | ✅ |
| **Artefatos em pt-BR** | Todos os artefatos deste plano em português | ✅ |

**Reavaliação pós-design**: o modelo de dados, os contratos e o design system não introduzem
infraestrutura além do previsto. O único ponto de atenção é a rota `/especime`, que existe só
em desenvolvimento e não é uma página do site (FR-036e); está documentada em
design-system.md §6.

## Estrutura do Projeto

### Documentação (esta funcionalidade)

```text
specs/001-novera-site-mvp/
├── spec.md
├── plan.md                 # este arquivo
├── research.md             # Fase 0
├── design-system.md        # Fase 1 (design system Novera)
├── data-model.md           # Fase 1
├── quickstart.md           # Fase 1 (validação)
├── contracts/
│   ├── rotas-e-componentes.md
│   ├── envio-formularios.md
│   ├── encaminhamento-email.md
│   └── ambiente.md
├── checklists/requirements.md
└── tasks.md                # Fase 2 (/speckit-tasks; não criado aqui)
```

### Código-fonte (raiz do repositório)

```text
.github/
├── workflows/
│   ├── _verificacoes.yml       # reutilizável: qualidade, unitários, audit, build, e2e (+ capturas)
│   ├── feat.yml                # FEAT: push nas branches de trabalho, verificações rápidas (sem e2e)
│   ├── auto-pr.yml             # FEAT: abre o PR para a main
│   ├── pr-main.yml             # PR → main: bateria completa, com e2e
│   └── main.yml                # MAIN: bateria completa + deploy Cloudflare
└── pull_request_template.md    # checklist Constitution VIII + revisão visual

public/
├── media/planner-2027/         # imagens e vídeo REAIS (otimizados pelo script)
├── og/                         # imagens Open Graph
└── favicon / ícones

scripts/
├── otimizar-imagens.mjs        # gera AVIF/WebP 640/1080/1600 (sharp)
└── check-publicacao.ts         # imprime os bloqueios de publicação

src/
├── app/
│   ├── layout.tsx              # <html lang="pt-BR">, fontes, SkipLink, header, footer
│   ├── not-found.tsx
│   ├── sitemap.ts · robots.ts
│   ├── especime/page.tsx       # só em desenvolvimento
│   └── (site)/
│       ├── page.tsx            # home
│       ├── planner-2027/page.tsx
│       ├── faq/page.tsx
│       ├── contato/page.tsx
│       ├── avaliar/page.tsx
│       ├── privacidade/page.tsx
│       ├── termos/page.tsx
│       └── informacoes-comerciais/page.tsx
├── components/
│   ├── ui/                     # Button, TextLink, Field, TextArea, RatingInput, Notice, Sheet (shadcn adaptado)…
│   ├── layout/                 # SiteHeader, MobileNav, SiteFooter, SkipLink, SectionHeader, EditorialRule, PaperBand
│   └── product/                # PurchaseCta, ProductFigure, DemoGallery, FeatureList, HowItWorks, CompatibilityTable
├── features/
│   ├── envios/                 # actions.ts, schemas.ts, form-token.ts, turnstile.ts, mail/ (transport, resend, fake, templates)
│   │   └── components/         # ReviewForm, FeedbackForm (cliente)
│   └── avaliacoes/             # stats.ts (média/contagem), ReviewsSection
├── content/
│   ├── types.ts · schemas.ts   # tipos e schemas de conteúdo (data-model §1)
│   ├── site.ts                 # navegação, textos globais
│   ├── empresa.ts
│   ├── faq.ts
│   ├── avaliacoes.ts           # inicia VAZIO
│   ├── legal/{privacidade,termos,informacoes-comerciais}.ts
│   └── produtos/planner-2027/{index,demonstracao,compatibilidade}.ts
├── config/
│   └── env.ts                  # validação Zod das variáveis
├── lib/
│   ├── publication-guard.ts    # collectPublicationBlockers
│   ├── sales.ts                # resolveSalesState
│   └── format.ts               # datas pt-BR, números
└── styles/
    ├── tokens.css              # @theme: primitivos + semânticos (única fonte de cor)
    └── globals.css

tests/
├── unit/                       # vitest
├── e2e/                        # playwright (+ axe, capturas)
└── fixtures/content/           # conteúdo de teste (vendas abertas, avaliações com nota baixa)

open-next.config.ts · wrangler.jsonc · next.config.ts · eslint.config.mjs · .prettierrc
.env.example · README.md (setup, variáveis, deploy, rotina de moderação)
```

**Decisão de estrutura**: um único projeto Next.js com `src/`. A divisão é
`app/` (rotas finas, só composição e metadados) → `components/` (apresentação reutilizável)
→ `features/` (lógica com estado ou servidor: envios, avaliações) → `content/` (dados e textos,
sem JSX) → `lib/` (funções puras testáveis). O conteúdo não importa componentes; os
componentes recebem dados por props. Para o teste de troca de conteúdo (V-04, V-19), as
páginas leem o conteúdo por um único módulo (`src/content/index.ts`), que em modo de teste
(`NOVERA_CONTENT_FIXTURE`) carrega `tests/fixtures/content/` **apenas no build de teste**.

## Decisões Arquiteturais e Trade-offs

| # | Decisão | Ganho | Custo / trade-off | Ref. |
|---|---|---|---|---|
| ADR-1 | SSG para todas as páginas + Server Actions só nos formulários | Desempenho, custo zero, segurança | Mudança de conteúdo exige deploy (aceitável: 1 autor, poucos updates) | R-02 |
| ADR-2 | Conteúdo em TS versionado, sem CMS | Tipagem, histórico, zero custo | Edição requer PR (a equipe tem fluxo Git) | R-07 |
| ADR-3 | Envios só por e-mail (Resend), sem banco | Sem custo; atende a clarificação | Sem consulta estruturada; limite de 100 por dia; caixa como registro manual | R-08 |
| ADR-4 | Turnstile + honeypot + token de tempo | Antispam sem conta nem armazenamento | Sem limite de taxa por IP | R-10 |
| ADR-5 | Avaliações publicadas por PR | Moderação auditável no Git; zero infraestrutura | Publicação não é instantânea | R-11 |
| ADR-6 | Cloudflare Workers + OpenNext | Estáticos ilimitados, deploys sem cota, uso futuro do domínio na Cloudflare | Adaptador de terceiros; limite de 3 MiB no Worker; termos a verificar | R-03 |
| ADR-7 | Imagens pré-otimizadas no build | Sem serviço pago de imagens | Script e passo manual ao adicionar mídia | R-15 |
| ADR-8 | Sem Motion; shadcn só no Sheet | JS mínimo, identidade própria | Transições limitadas a CSS (desejado) | R-06 |

## Páginas, Navegação e Conteúdo (resumo)

Detalhes em [contracts/rotas-e-componentes.md](./contracts/rotas-e-componentes.md).

- **Home**: jornada do FR-002. A demonstração é uma **seção** (`#demonstracao`, FR-036e), sem
  página própria.
- **Sem duplicação** (US4-4): a home tem o resumo (benefícios, 4 passos, demonstração
  curada); `/planner-2027` tem a profundidade (conteúdo incluído, navegação interna, orientações,
  compatibilidade) e reutiliza **componentes**, não blocos de texto. Um teste verifica que
  nenhum parágrafo com mais de 120 caracteres se repete entre as duas páginas.
- **Avaliações**: seção na home só com dados. `/avaliar` é oculta e acessada pelo link no
  PDF (G-05) ou pedido via `/contato`.
- **Links externos**: só o checkout abre em nova aba, com aviso (contrato §3).

## Demonstração Real do Planner 2027

- **Fonte**: capturas exportadas do **PDF aprovado, sem alterá-lo**. Cobertura desejada:
  navegação por links (sequência origem → destino com legenda), diário, semanal, mensal e
  calendário, metas, finanças, anotações e espaço de escrita.
- **Navegação por links** representada por pares de imagens reais ("toque em *Março* no
  índice" → página de março), com legenda textual. Sem animação simulando um aplicativo.
- **Dependência P-09**: enquanto não houver materiais aprovados, a seção mostra o estado
  informativo (FR-010). O build falha se um material aprovado não existir no disco. Para o
  desenvolvimento, **não** se criam imagens simuladas; os testes cobrem o estado vazio e um
  fixture com 1 a 2 capturas reais quando disponíveis.

## Avaliações e Feedback (resumo do fluxo)

```text
Comprador → link no PDF → /avaliar → Server Action (honeypot → token → Turnstile → Zod)
   → Resend → caixa Novera [Avaliação] → verificação manual no painel do checkout
   → moderação → PR em src/content/avaliacoes.ts → deploy → seção pública
Visitante → /contato → Server Action → Resend → caixa Novera [Feedback] → resposta por "Responder"
```

Requisitos do usuário atendidos: sem conta; serviço externo de baixo custo; moderação manual;
antispam; privacidade; avaliações negativas preservadas (ordem por data, motivos de rejeição
restritos ao FR-029); **selo de compra verificada apoiado em mecanismo real** (verificação
manual pelo e-mail da compra, FR-030); o link no PDF **não** é tratado como prova de compra;
nenhuma média ou contagem fictícia; seção ausente sem dados.

Rotina operacional (documentada no README): marcadores na caixa, checklist de moderação no
próprio e-mail ([contracts/encaminhamento-email.md](./contracts/encaminhamento-email.md)) e
limpeza mensal dos e-mails com mais de 6 meses após a conclusão (FR-036c).

## Checkout

- Configuração centralizada em `src/content/produtos/planner-2027/index.ts` → `sales`
  ([data-model §1.4](./data-model.md)). O schema exige `https` e um host da plataforma
  escolhida.
- `PurchaseCta` único, com 3 variantes visuais, e `resolveSalesState()` testado em unidade.
- Interruptor de emergência `NEXT_PUBLIC_SALES_OVERRIDE=nao-abertas`.
- Plataforma identificada no texto do CTA quando definida. Preço só com `status: aprovado`.
- Nenhum processamento de pagamento, cartão ou checkout próprio (FR-016).

## SEO e Performance

- Metadados por página, OG, canonical, `sitemap.ts` (sem `/avaliar`), `robots.ts`, um `h1`,
  URLs em português.
- Fontes com `next/font` (auto-hospedadas, `swap`, subconjunto latin); imagens AVIF/WebP com
  `width`/`height` (evita CLS), `priority` só na imagem do hero; vídeo com `preload="none"`.
- Sem scripts de terceiros nas páginas sem formulário. O Turnstile só é carregado em
  `/avaliar` e `/contato`.
- Orçamento de JavaScript e metas de Web Vitals em Contexto Técnico; medição manual (V-29).
- **Sem analytics no MVP**: não está na spec; evita banner de cookies e tratamento de dados.
  Se for desejado, exige decisão e uma atualização da spec e da política de privacidade.

## Acessibilidade

Integrada aos componentes ([design-system.md §4](./design-system.md)): SkipLink, landmarks
(`header`, `nav`, `main#conteudo`, `footer`), foco visível com token próprio, alvos ≥ 44 px,
`RatingInput` com rádios nativos, erros com resumo e associação por `aria-describedby`, menu
com retenção e devolução de foco, `<details>` no FAQ, `prefers-reduced-motion`, contraste
medido por par de cores, estado e erro nunca comunicados só por cor. Verificação: axe no CI
(V-24) + teclado e leitor de tela manuais (V-25, V-30).

## Segurança e Privacidade

- Segredos só no servidor e na hospedagem ([contracts/ambiente.md](./contracts/ambiente.md));
  `.env.example` sem valores; `.gitignore` cobre `.env*.local`.
- Validação no servidor com Zod; texto sempre tratado como texto puro; e-mail em texto puro
  (sem injeção de HTML); `Reply-To` validado como e-mail.
- Sem dados pessoais em logs, no repositório ou em analytics. O e-mail do autor nunca entra em
  `avaliacoes.ts`.
- Cabeçalhos de segurança em `next.config.ts`: `Content-Security-Policy` (permitindo só
  `challenges.cloudflare.com` para o Turnstile), `X-Content-Type-Options`, `Referrer-Policy:
  strict-origin-when-cross-origin`, `Permissions-Policy` restritiva, `frame-ancestors 'none'`.
- Dependências: `npm audit` no CI (falha em `high`/`critical` de produção), Dependabot
  semanal agrupado e revisão manual antes do merge.
- A política de privacidade (P-06) **MUST** incluir: finalidades (avaliação, verificação,
  suporte), dados coletados, operadores (Cloudflare, Resend) e transferência internacional,
  retenção de 6 meses, direitos do titular e canal (`/contato`).

## GitHub e Versionamento

Detalhes em [research.md R-14](./research.md).

1. `git init` com a branch padrão `main`; primeiro commit `chore: estrutura inicial e artefatos
   do Spec Kit`; publicação no GitHub (repositório privado sugerido).
2. Branch `feature/001-novera-site-mvp` a partir da `main`. Sub-branches por fase são
   opcionais (`feature/design-system`, `feature/formularios`), com merge por PR na branch da
   funcionalidade ou direto na `main` em incrementos funcionais.
3. **Proteção da `main`** (ruleset): PR obrigatório, checks `ci` obrigatórios, sem force push
   nem exclusão. Se o plano do GitHub não permitir em repositório privado, vale o processo
   documentado no README.
4. **CI** (`_verificacoes.yml`, chamado por `feat.yml` sem e2e, `pr-main.yml` e `main.yml`): `npm ci` → `typecheck` → `lint` → `format:check` → `test` → `build` →
   `e2e` (Chromium + WebKit mobile) → artefato com as capturas das 6 larguras e o relatório
   Playwright.
5. **Deploy** (job de `main.yml`): só na `main`, depois das verificações verdes; prévias de PR opcionais via
   `wrangler versions upload` (sem custo), se o limite permitir.
6. O template de PR traz o checklist da Constitution VIII e da revisão visual.

## Testes e Qualidade

Estratégia em [research.md R-13](./research.md) e cenários em [quickstart.md](./quickstart.md):
- **Unidade**: schemas (limites, mensagens), `resolveSalesState`, `reviewStats`,
  `collectPublicationBlockers`, montagem do e-mail, token de formulário.
- **E2E**: navegação, CTA nos 2 estados e com o interruptor, formulários (sucesso,
  validação, falha, honeypot, Turnstile reprovado), zero e N avaliações, `/avaliar` oculta,
  rastreamento de links, 404, rolagem horizontal, axe, movimento reduzido, metadados.
- **Manual**: teclado, leitor de tela, dispositivos reais, revisão visual, desempenho,
  teste de compreensão.

## Hospedagem e Custos

| Item | Escolha | Custo previsto no lançamento | Observação |
|---|---|---|---|
| Hospedagem | Cloudflare Workers Free + OpenNext | R$ 0 | Termos comerciais **[VERIFICAR]** (G-03); plano B Netlify Free; plano C Vercel Pro (US$ 20/mês, só com aprovação) |
| E-mail transacional | Resend Free | R$ 0 | 100/dia e 3.000/mês; exige domínio verificado |
| Antispam | Turnstile Free | R$ 0 | |
| Domínio | a definir (G-01) | ~R$ 40/ano para `.com.br` (Registro.br) **[VERIFICAR]** | **Único custo provável**; não será contratado neste plano |
| Caixa de e-mail da Novera | existente ou a definir (P-05) | R$ 0 (se a caixa já existir) | |
| GitHub | Free | R$ 0 | |
| Checkout | Kiwify/Hotmart | sem mensalidade; taxa por venda da plataforma | P-01 |

Nenhum serviço pago será contratado ou configurado automaticamente.

## Plano Incremental (fases técnicas)

Cada fase termina com CI verde e com as verificações do Princípio VIII aplicáveis.

| Fase | Entregas | Critério de saída |
|---|---|---|
| **1. Configuração e qualidade** | Repositório Git e GitHub; Next 16 + TS strict + Tailwind 4; ESLint, Prettier, Vitest, Playwright e axe; `env.ts`; CI; **prova técnica Cloudflare/OpenNext** (tamanho do Worker, Server Action de teste) | `npm run build` + `preview:cf` funcionando; decisão confirmada entre ADR-6 e o plano B |
| **2. Design system** | `tokens.css`; fontes; componentes `ui/` e `layout/` base; rota `/especime`; lint de cores | revisão visual do espécime aprovada; contrastes conferidos |
| **3. Layout global e navegação** | `layout.tsx`, header, menu mobile, footer, SkipLink, 404, metadados base, sitemap e robots | V-06 (parcial), V-22, V-23, V-25 (menu) |
| **4. Home** | Seções marca → produto → benefícios → como funciona → demonstração (estado vazio) → compra (`PurchaseCta`, vendas não abertas) | V-01, V-02, V-03, V-07 |
| **5. Planner 2027 e demonstração** | `/planner-2027`, compatibilidade, `DemoGallery` + script de imagens | V-08, V-09; teste anti-duplicação |
| **6. FAQ, contato e legais** | `/faq`, `/contato` (sem formulário ainda), páginas legais em estado pendente, `BusinessInfo`, guarda de publicação | V-10, V-28 |
| **7. Avaliações e feedback** | `features/envios` (actions, schemas, token, Turnstile, transportes), formulários de `/contato` e `/avaliar`, `ReviewsSection` + stats, rotina documentada | V-11 a V-20 |
| **8. Checkout** | `vendas-abertas` validado por schema, interruptor, testes com fixture; URL real só quando P-01/P-02 forem decididos | V-04, V-05, V-21 nos 2 estados |
| **9. Testes finais e publicação** | Execução completa do quickstart, revisão visual, dispositivos reais, desempenho, leitor de tela, configuração de domínio, Resend, Turnstile e deploy de produção | Checklist de publicação (quickstart §5) completo |

As fases 6 e 7 podem andar em paralelo depois da 3; a 8 depende só da 4.

## Riscos e Pendências

| # | Risco / pendência | Prob. | Impacto | Mitigação |
|---|---|---|---|---|
| RK-1 | Worker do OpenNext passa de 3 MiB no plano gratuito | média | alto | Prova técnica na Fase 1; plano B Netlify; manter dependências de servidor mínimas |
| RK-2 | Termos de uso comercial do plano gratuito (G-03) | baixa | alto | Verificar antes da publicação; plano B ou C com aprovação |
| RK-3 | Materiais reais do produto atrasam (P-09) | alta | médio | Estado informativo pronto; o layout não depende das imagens |
| RK-4 | Falta de domínio verificado (G-01) impede o Resend | média | alto | Decidir o domínio cedo; plano B Web3Forms (R-08) |
| RK-5 | Limite de 100 e-mails por dia em pico ou ataque | baixa | médio | Turnstile + honeypot; erro honesto com e-mail alternativo; plano pago só com aprovação |
| RK-6 | Contraste insuficiente em combinações novas | média | médio | Tabela de contraste; axe no CI; tokens semânticos |
| RK-7 | Aparência genérica | média | alto | Assinaturas visuais ([design-system §1](./design-system.md)), espécime revisado, checklist anti-template |
| RK-8 | Conteúdo comercial pendente vazar para produção | baixa | alto | Guarda de publicação no build oficial |
| RK-9 | Mudanças de preço ou limites de terceiros | média | baixo | Itens **[VERIFICAR]** reconfirmados na Fase 9 |

Pendências da spec (P-01 a P-10) mais as lacunas novas desta etapa (G-01 a G-05, em
[research.md](./research.md#lacunas-da-especificação-identificadas-exigem-decisão-do-responsável)).
**Recomendação**: incluir G-01 (domínio) e G-03 (termos da hospedagem) na tabela de
Pendências da spec, numa próxima atualização da spec.

## Acompanhamento de Complexidade

Nenhuma violação da Constitution. Tabela não aplicável.
