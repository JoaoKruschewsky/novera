# Pesquisa Técnica (Fase 0): MVP do Site Oficial Novera

**Funcionalidade**: `001-novera-site-mvp` | **Data**: 2026-11-18 | **Plano**: [plan.md](./plan.md)

Este documento resolve as incógnitas do Contexto Técnico. Cada decisão segue o formato
**Decisão / Justificativa / Alternativas consideradas**. Informações de terceiros (preços,
limites, termos) foram consultadas em 2026-11-18. Elas mudam com frequência e **MUST** ser
reconfirmadas na fonte oficial antes da contratação ou publicação. Esses itens estão
marcados como **[VERIFICAR]**.

---

## R-01 — Versões do stack

**Decisão**: usar as linhas estáveis atuais, fixando as versões exatas no momento da
instalação (Fase 1) com `npm view <pacote> version`. As versões são registradas no
`package.json` e mantidas sem `^` nas dependências críticas (`next`, `react`, `react-dom`).

| Pacote | Linha alvo | Observação |
|---|---|---|
| Node.js | 24 LTS (instalado: 24.14.0) | Next 16 não suporta Node 18 |
| npm | 11.x (instalado: 11.11.0) | pnpm não está instalado; npm evita uma ferramenta extra |
| Next.js | 16.x (Active LTS; última estável observada: 16.2.10) | App Router; a 15.x terminou o suporte em 2026-10-21 |
| React / React DOM | 19.2.x (a linha exigida pelo Next 16) | — |
| TypeScript | estável mais recente aceita pelo Next 16 | `strict: true` |
| Tailwind CSS | 4.x (última observada: 4.3.x) | tokens via `@theme` em CSS |
| shadcn/ui (CLI) | `shadcn@latest` | só os componentes listados em R-06 |
| lucide-react | estável atual | importação individual dos ícones |
| Playwright | estável atual | e2e e acessibilidade |

**Justificativa**: o Next 16 é a linha com suporte ativo e o Tailwind 4 é a linha compatível
com a CLI atual do shadcn/ui. Fixar as versões na instalação evita depender de um número que
pode estar desatualizado no momento do plano.

**Alternativas consideradas**: Next 15 (suporte já encerrado, rejeitado); pnpm (exigiria
instalar uma ferramenta a mais sem ganho relevante para um único pacote, rejeitado).

Fontes: [Next.js Support Policy](https://nextjs.org/support-policy),
[versionlog Next 16](https://versionlog.com/nextjs/16/),
[Tailwind releases](https://releases.sh/tailwind-css/overview),
[shadcn Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4).

---

## R-02 — Modo de renderização

**Decisão**: todas as páginas são **geradas estaticamente no build** (Server Components, sem
`fetch` dinâmico). A única execução em servidor no MVP são as **Server Actions** de envio de
avaliação e de feedback (R-08). Não há middleware, ISR nem rotas dinâmicas por parâmetro.

**Justificativa**: o conteúdo muda só por commit (textos, avaliações aprovadas, status de
venda), então o HTML estático entrega o melhor desempenho (SC-011) e o menor custo de
hospedagem (Princípio VII). Os formulários precisam de servidor para validar, verificar o
antispam e esconder credenciais (Princípio VI).

**Alternativas consideradas**:
- *Exportação 100% estática (`output: 'export'`) com um serviço de formulário chamado direto
  do navegador*: não exige servidor, mas a chave do serviço fica pública, a validação
  definitiva fica com terceiros e a verificação do antispam não acontece no nosso servidor.
  Fica como **plano B** (R-08).
- *Renderização dinâmica por requisição*: sem benefício para conteúdo que muda por commit.
  Rejeitada.

---

## R-03 — Hospedagem

Requisitos: Next 16 com páginas estáticas e Server Actions; deploy a partir do GitHub; HTTPS;
domínio próprio; variáveis de ambiente; **uso comercial permitido**; custo inicial zero.

| Opção | Uso comercial no plano gratuito | Limites relevantes | Suporte a Next | Avaliação |
|---|---|---|---|---|
| Vercel Hobby | **Não**: o Hobby é só para uso pessoal não comercial; uso comercial exige o Pro (US$ 20/usuário/mês) | — | Nativo | Rejeitado para o gratuito; é a opção paga mais simples |
| Netlify Free | Permitido, segundo análises de terceiros **[VERIFICAR nos Termos]** | 300 créditos/mês somando deploys (~15 por deploy), banda (~20 por GB) e funções; o site é **pausado** se o limite for atingido | Adaptador próprio, sem configuração | Viável, mas o consumo por deploy limita o fluxo com PRs frequentes |
| Cloudflare Workers Free (com `@opennextjs/cloudflare`) | Os termos não mencionam restrição nas páginas de preço **[VERIFICAR no Self-Serve Agreement]** | Arquivos estáticos ilimitados e gratuitos; 100 mil requisições dinâmicas por dia; Worker de até 3 MiB no plano gratuito; 10 ms de CPU por invocação | Por adaptador (OpenNext) | **Escolhida**, com verificação técnica obrigatória (R-03a) |

**Decisão**: **Cloudflare Workers (plano gratuito) com o adaptador OpenNext**, deploy por
GitHub Actions a partir da `main`. **Plano B**: Netlify Free, sem mudanças de código além da
configuração de deploy. **Plano C (pago)**: Vercel Pro, só com aprovação explícita de custo.

**Justificativa**: o site é quase todo estático, e na Cloudflare os arquivos estáticos não
consomem cota. Só os envios de formulário contam nas 100 mil requisições por dia, o que é
folga muito grande para o MVP. Os deploys não consomem créditos, o que é diferente da Netlify.

**R-03a — Verificações obrigatórias antes de adotar (tarefas da Fase 1)**:
1. Fazer o build com OpenNext e conferir que o Worker comprimido cabe em **3 MiB**. Se não
   couber, mudar para o plano B.
2. Confirmar que a Server Action de envio (validação + Turnstile + Resend) cabe em 10 ms de
   CPU. A espera por rede não conta como CPU; medir mesmo assim.
3. Confirmar nos termos atuais da Cloudflare que o uso comercial é permitido no plano
   gratuito. **Sem essa confirmação, a publicação oficial não acontece** (pendência G-03).

**Resultado da prova (T016, 2026-11-21)** — Next.js 16.4.6, `@opennextjs/cloudflare` 1.20.18,
wrangler 4.166.0, `cacheComponents` desligado (SSG clássico):
- Build OpenNext concluído; as páginas saem como estáticas (`○`).
- Tamanho do Worker (`wrangler deploy --dry-run`): **4.799 KiB sem compressão / 1.021 KiB
  gzip**, abaixo do limite de 3 MiB do plano gratuito (folga de ~2 MiB para Zod, Resend etc.).
- Server Action de teste (validação Zod + `fetch` externo) executada no `opennextjs-cloudflare
  preview` (workerd local): respostas `POST 200` em 133 ms (com rede) e 10 ms (só validação),
  em tempo de relógio. O tempo de **CPU** só pode ser medido no Worker publicado
  (observabilidade da Cloudflare); remedir na T135 com o app completo.
- **Decisão**: manter a Cloudflare Workers (ADR-6). Plano B (Netlify) não acionado.
- A confirmação dos termos comerciais (item 3, G-03) continua pendente.

Fontes: [Vercel Fair Use](https://vercel.com/docs/limits/fair-use-guidelines),
[Vercel Hobby](https://vercel.com/docs/plans/hobby),
[Netlify pricing (análise)](https://netli.fyi/blog/netlify-pricing-and-limits),
[Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/),
[Workers limits](https://developers.cloudflare.com/workers/platform/limits),
[OpenNext Cloudflare](https://opennext.js.org/cloudflare).

---

## R-04 — Tipografia

**Decisão**:
- **Títulos e momentos editoriais**: **Newsreader** (Production Type, licença SIL OFL, variável,
  com eixo de tamanho óptico). Uma serifa editorial de contraste moderado que continua legível
  em fundo escuro.
- **Texto corrido e interface**: **Hanken Grotesk** (licença SIL OFL, variável). Uma grotesca
  humanista, neutra sem ser a escolha padrão.
- As duas são carregadas com `next/font/google`, que hospeda os arquivos no próprio domínio
  (sem requisição ao Google em tempo de execução, o que também é bom para a LGPD). Usam
  `display: swap`, apenas o subconjunto `latin` (que cobre a acentuação do português) e só os
  eixos e pesos usados.

**Justificativa**: o par serifa editorial + grotesca sustenta a "composição editorial"
pedida e lembra um planner impresso, que é a natureza do produto. A licença OFL permite uso
comercial e hospedagem própria.

**Alternativas consideradas**: Inter, Geist e Manrope (muito associadas a interfaces genéricas,
rejeitadas); Cormorant Garamond (hastes finas demais em fundo escuro nos tamanhos pequenos,
rejeitada); Fraunces (personalidade "macia" demais para o tom contido); Instrument Serif (um
único peso, o que limita a hierarquia). **Validação**: a escolha é confirmada na revisão
visual da Fase 2 com um espécime real (títulos, parágrafo e botão nas três larguras). Se for
reprovada, troca-se só o token de família, sem mexer nos componentes.

---

## R-05 — Estratégia de design tokens

**Decisão**: há duas camadas de tokens no `@theme` do Tailwind 4, em `src/styles/tokens.css`:
1. **Primitivos**: os seis tons da paleta e as escalas de espaço, tipografia, raio e sombra.
2. **Semânticos**: `surface`, `text`, `border`, `accent`, `focus`, `state`, que referenciam os
   primitivos.

Os componentes usam **apenas tokens semânticos**. Uma regra de lint (R-12) bloqueia hex, rgb
e hsl fora de `tokens.css`. O detalhamento está em [design-system.md](./design-system.md).

**Justificativa**: o Princípio II exige tokens, e a camada semântica permite ajustar o
contraste sem tocar nos componentes.

**Alternativas**: arquivo de configuração JS do Tailwind (o padrão da v4 é configurar em CSS,
rejeitado); CSS Modules sem Tailwind (contraria o stack aprovado).

---

## R-06 — Uso do shadcn/ui e de Motion

**Decisão**:
- **shadcn/ui**: só o **Sheet** (Radix Dialog), para o menu mobile, porque cuida da retenção
  de foco, do Esc, da devolução de foco e do `aria-modal`. Os estilos são reescritos com os
  tokens Novera. Os demais componentes (botão, link, campos, FAQ) são próprios e simples.
- **FAQ**: `<details>`/`<summary>` nativos. Funcionam sem JavaScript e são acessíveis por
  padrão.
- **Motion**: **não entra no MVP**. As poucas transições necessárias (hover, abertura do menu)
  são feitas com CSS `transition` e desligadas com `prefers-reduced-motion`. Se um caso futuro
  precisar de animação orquestrada, a dependência é justificada no plano dessa funcionalidade.

**Justificativa**: Princípio I (sem dependências desnecessárias) e Princípio VII (o mínimo de
JavaScript no cliente). Também evita a aparência de "demo do shadcn".

**Alternativas**: Accordion do shadcn para o FAQ (traria JavaScript sem necessidade); Motion
para entradas de seção (a spec proíbe animações genéricas de entrada).

---

## R-07 — Conteúdo e configuração de produto

**Decisão**: o conteúdo fica em **módulos TypeScript tipados** em `src/content/`, validados
no build por schemas (R-09). O estado de cada item comercial (`pendente`/`aprovado`) faz
parte do dado. Não há CMS.

**Justificativa**: um único autor, mudanças por PR com histórico no Git, tipagem forte e custo
zero. Atende ao FR-046 (textos provisórios identificáveis) e ao FR-022 (bloqueio de
publicação).

**Alternativas**: CMS headless (custo, dependência e login, rejeitado); MDX (útil para textos
longos, mas não necessário; pode ser revisto para as páginas legais se o texto jurídico ficar
extenso).

---

## R-08 — Envio de avaliações e de feedback privado (sem banco de dados)

Requisitos da spec: só por e-mail para a caixa da Novera (FR-036a); confirmação só depois que
o e-mail for aceito (FR-036b); proteção contra envios automatizados acessível (FR-036);
validação (Princípio VI); custo zero.

| Opção | Custo | Segurança | Manutenção | Limitações |
|---|---|---|---|---|
| **A. Server Action + Cloudflare Turnstile + Resend** | Gratuito: Resend 100 e-mails/dia e 3.000/mês com 1 domínio verificado; Turnstile gratuito (até 20 widgets) **[VERIFICAR]** | Validação e verificação do Turnstile no servidor; chaves só no servidor | Baixa: duas contas e um domínio | Exige domínio próprio verificado no Resend (G-01) |
| B. Formulário enviado direto do navegador ao Web3Forms | Gratuito: 250 envios/mês **[VERIFICAR termos comerciais]** | Chave pública por design; validação definitiva com terceiros | Muito baixa | Envio servidor a servidor só no plano pago; menos controle |
| C. Formspree ou similar | Gratuito com limite menor | Parecido com B | Baixa | Limites mensais baixos |
| D. Banco gerenciado (Supabase etc.) | Gratuito com limites | Bom | Média | **Contraria a decisão da spec** (sem armazenamento próprio) |

**Decisão**: **Opção A**. Os dados pessoais passam por dois operadores (Cloudflare e Resend),
que **MUST** constar na política de privacidade, inclusive a transferência internacional
(pendência P-06). **Plano B**: opção B, caso a hospedagem final seja estática ou não haja
domínio verificado a tempo.

**Detalhes**:
- O remetente técnico (`no-reply@<domínio>`) envia para `NOVERA_INBOX_EMAIL`. O `Reply-To` é
  o e-mail informado pela pessoa, para que a equipe responda direto da caixa.
- Assunto padronizado e filtrável, por exemplo `[Novera][Avaliação] Nota 4 — Nome Público`
  (ver [contracts/encaminhamento-email.md](./contracts/encaminhamento-email.md)). Isso
  facilita criar marcadores e fazer a limpeza manual de 6 meses (FR-036c).
- Com 100 e-mails/dia de teto, o volume do MVP fica muito abaixo do limite. Se o limite for
  atingido, o envio falha e a pessoa vê um erro com instruções (FR-036b), sem perda silenciosa.
- **Sem e-mail de confirmação para quem envia** (só a confirmação na tela). Isso mantém o
  consumo mínimo e respeita "sem automações de e-mail".

Fontes: [Resend free tier (análise)](https://www.activepieces.com/blog/resend-pricing-2026-free-tier-plans-and-limits),
[Turnstile plans](https://developers.cloudflare.com/turnstile/plans),
[Web3Forms (análise)](https://agentdeals.dev/vendor/web3forms).

---

## R-09 — Validação

**Decisão**: usar **Zod** como fonte única dos schemas, em três frentes: (1) validação dos
envios no servidor; (2) mensagens de erro no cliente com os mesmos limites; (3) validação do
conteúdo e da configuração no build (por exemplo, URL de checkout `https` em domínio
permitido; avaliação publicada com todos os campos).

**Justificativa**: evita duplicar regras entre cliente, servidor e build; a tipagem é inferida.
É uma dependência madura, mantida ativamente e sem dependências próprias.

**Alternativas**: validação escrita à mão (duplicação e erros sutis); Valibot (equivalente e
menor, mas menos difundido; não há ganho que compense).

**Limites definidos (a spec delegou ao plano)**: comentário da avaliação com 20 a 1.500
caracteres; nome público com 2 a 60; mensagem de feedback com 10 a 3.000; e-mail com até 254
e formato válido. Os detalhes estão em [data-model.md](./data-model.md).

---

## R-10 — Proteção contra envios automatizados (FR-036)

**Decisão**: três camadas, sem conta e sem armazenamento:
1. **Cloudflare Turnstile** no modo *managed*. Em geral é invisível ou pede um clique, não
   exige resolver quebra-cabeça e é compatível com teclado e leitor de tela. O token é
   verificado no servidor (`siteverify`).
2. **Campo-armadilha (honeypot)**, oculto visual e semanticamente (`aria-hidden`,
   `tabindex="-1"`, `autocomplete="off"`).
3. **Tempo mínimo de preenchimento** (3 segundos) entre a renderização e o envio, com
   carimbo de tempo assinado com HMAC (`FORM_SIGNING_SECRET`).

Sem limite de taxa por IP no MVP, porque exigiria armazenamento. O teto diário do Resend
funciona como limite natural, e a regra de firewall gratuita da Cloudflare pode ser ativada
se houver abuso.

**Alternativas**: reCAPTCHA (mais intrusivo e envia mais dados ao Google, rejeitado); hCaptcha
(viável, mas o Turnstile já fica no mesmo provedor da hospedagem).

---

## R-11 — Publicação de avaliações aprovadas

**Decisão**: as avaliações aprovadas na moderação são adicionadas pela equipe em
`src/content/avaliacoes.ts`, por Pull Request (FR-036d). O build:
- valida cada avaliação (nota inteira de 1 a 5, comentário, nome público, data e
  `compraVerificada: true` obrigatório; o FR-030 diz que só verificadas são publicadas);
- calcula a média (1 casa decimal) e a contagem **só** a partir desse arquivo (FR-032);
- não renderiza a seção nem as âncoras quando a lista está vazia (FR-033).

A ordenação é **cronológica decrescente**, nunca por nota, para não favorecer avaliações
positivas (Princípio IV). O e-mail do autor **nunca** entra no repositório. A remoção é feita
por PR que apaga a entrada (FR-035).

**Alternativas**: planilha ou serviço externo lido em tempo de execução (custo, latência e
mais um operador de dados, rejeitado no MVP).

---

## R-12 — Qualidade de código

**Decisão**:
- **ESLint** com a configuração do Next (flat config), `typescript-eslint` em modo strict,
  `eslint-plugin-jsx-a11y` e uma regra `no-restricted-syntax` para cores literais em
  `className`/`style`.
- **Prettier** com `prettier-plugin-tailwindcss`, para ordenar as classes.
- `tsc --noEmit` no CI.
- Sem Husky no MVP: o CI é o portão. Pode ser revisto se o time crescer.

**Alternativas**: Biome (mais rápido, mas a cobertura de regras de acessibilidade e do Next
ainda é menor que a do ESLint, rejeitado).

---

## R-13 — Testes

**Decisão** (proporcional ao tamanho):
- **Vitest** para testes unitários de lógica pura: schemas, cálculo de média e contagem,
  resolução do estado do CTA de compra, guarda de publicação e montagem do e-mail.
- **Playwright** para os fluxos críticos e2e: navegação, CTA de compra nos dois estados,
  formulários (sucesso, erro de validação, falha de envio simulada), ausência de avaliações,
  página 404, rastreamento de links e responsividade sem rolagem horizontal em 320, 768 e
  1440 px.
- **@axe-core/playwright** para a auditoria automatizada de WCAG em todas as páginas.
  Complementada por revisão manual de teclado e de leitor de tela (NVDA no Windows e
  TalkBack ou VoiceOver no celular), porque o axe não cobre tudo.
- Os serviços externos (Turnstile, Resend) são **substituídos por dublês** nos testes. O
  Turnstile tem chaves de teste oficiais que sempre aprovam ou sempre reprovam; o Resend é
  trocado por um transportador falso via variável de ambiente.

**Alternativas**: Testing Library para componentes (pouco valor sobre o Playwright neste
porte; pode ser adicionado se surgir lógica de UI complexa); Lighthouse CI (útil, mas
instável no CI; as medições de desempenho são manuais e registradas no checklist de
publicação).

---

## R-14 — Git, GitHub e Spec Kit

**Constatações**:
- O diretório **ainda não é um repositório Git**.
- O Spec Kit instalado é a **v0.15.1**, sem a extensão de Git. Ele **não cria branches**: a
  funcionalidade ativa é resolvida por `.specify/feature.json` (`feature_directory`), e o
  valor "BRANCH" exibido pelos scripts é só o nome do diretório (`001-novera-site-mvp`).

**Decisão**:
- O diretório da especificação continua `specs/001-novera-site-mvp/`. **Não renomear**, porque
  o `feature.json` aponta para ele.
- A branch Git da funcionalidade será `feature/001-novera-site-mvp`, que segue o padrão da
  Constitution e mantém o vínculo visual com o número da spec.
- Como o Spec Kit resolve a funcionalidade pelo `feature.json` e não pelo nome da branch,
  **não há conflito**. Se a extensão Git do Spec Kit for instalada no futuro, a convenção de
  branch dela **MUST** ser revisada antes do uso.
- O repositório é criado na Fase 1, com a `main` contendo só a estrutura inicial e os
  artefatos do Spec Kit, seguida da branch da funcionalidade. Nenhuma operação destrutiva.
- **Proteção da `main`**: exigir PR, exigir os checks do CI aprovados e bloquear force push e
  exclusão. Em repositório privado no plano GitHub Free, as regras de proteção podem não estar
  disponíveis **[VERIFICAR]**. Nesse caso, a regra vale como processo documentado e o deploy
  só acontece a partir do CI da `main`.
- **Conventional Commits** (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`), um
  assunto por commit.
- O `gh` CLI não está instalado. Ele é opcional; as operações podem ser feitas pela interface
  web.

---

## R-15 — Imagens e mídia de demonstração

**Decisão**:
- Capturas reais do PDF são exportadas em alta resolução **a partir do arquivo aprovado, sem
  modificá-lo**, e ficam em `public/media/planner-2027/`. Cada imagem é registrada em
  `src/content/produtos/planner-2027/demonstracao.ts` com texto alternativo, seção mostrada e
  estado de aprovação.
- Com `next/image` em hospedagem Cloudflare, a otimização em tempo real exige configurar um
  *loader* (Cloudflare Images é pago). **Decisão**: gerar as variantes AVIF/WebP nos tamanhos
  640, 1080 e 1600 com um script de build único (`scripts/otimizar-imagens.mjs`, usando
  `sharp` como dependência de desenvolvimento) e usar `next/image` com `unoptimized` e
  `srcset` explícito, ou `<picture>`. Isso tem custo zero e não depende de serviço.
- **Vídeo** (quando houver): arquivo MP4/H.264 comprimido e hospedado como estático, com
  `controls`, `muted` e `preload="none"`, um *poster* real, e legenda ou descrição textual
  equivalente. Sem plataforma de terceiros no MVP, porque YouTube e similares trariam cookies
  e rastreamento.
- **Estado sem materiais** (FR-010): bloco informativo tipográfico, sem simulação. O build
  falha se uma imagem marcada como aprovada não existir no disco.

**Dependência externa**: P-09 (imagens e vídeo reais). A seção funciona sem eles.

---

## Lacunas da especificação identificadas (exigem decisão do responsável)

| ID | Lacuna | Impacto | Proposta |
|---|---|---|---|
| G-01 | **Domínio do site e do e-mail** não constam das Pendências (P-01 a P-10) | O Resend exige domínio verificado; o Turnstile é configurado por hostname; vale também para SEO e metadados | Incluir como pendência que bloqueia a publicação |
| G-02 | Caixa de e-mail que recebe os envios (`NOVERA_INBOX_EMAIL`) | Destino dos formulários | Faz parte de P-05; confirmar se é a mesma caixa de suporte |
| G-03 | Confirmação dos termos de uso comercial no plano gratuito da hospedagem | Legalidade da hospedagem | Verificar antes da publicação (R-03a) |
| G-04 | O "meio de resposta" do feedback privado (FR-025) não tem tipo definido | Campos do formulário | O plano adota **e-mail**, pelo mínimo de dados; o telefone fica fora |
| G-05 | Inserir o link de `/avaliar` no PDF | O fluxo de avaliação depende disso para ser descoberto | Tarefa de produto **posterior**; não altera o PDF nesta etapa |

Nenhuma dessas lacunas impede a implementação: o código trata todas como configuração
pendente. G-01 e G-03 **bloqueiam a publicação oficial**.
