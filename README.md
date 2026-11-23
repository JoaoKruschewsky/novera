# Site oficial Novera

Site institucional e comercial da Novera, com o **Novera Planner Digital 2027** (PDF interativo).
Next.js 16 (App Router) + TypeScript strict + Tailwind 4, páginas estáticas, hospedagem na
Cloudflare Workers (OpenNext). Sem banco de dados: avaliações e feedback chegam **por e-mail**.

Especificação, plano e decisões: [`specs/001-novera-site-mvp/`](specs/001-novera-site-mvp/).
Princípios do projeto: [`.specify/memory/constitution.md`](.specify/memory/constitution.md).

---

## 1. Pré-requisitos e instalação

- Node.js 24 LTS e npm 11 (`node -v`, `npm -v`).
- `npm ci`
- `npx playwright install --with-deps chromium webkit` (para os testes e2e).
- Copie `.env.example` para `.env.local`. Em desenvolvimento, os valores de teste já funcionam
  (`MAIL_TRANSPORT=fake` grava os e-mails em `.tmp/fake-mail/`; chaves de teste do Turnstile).

## 2. Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor local em http://localhost:3000 (`/especime` mostra o design system) |
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm run lint` | ESLint (inclui acessibilidade e a proibição de cores soltas e de `target="_blank"`) |
| `npm run format` / `format:check` | Prettier |
| `npm test` | testes unitários (Vitest) |
| `npm run build` | build de produção; com `NOVERA_PUBLICACAO_OFICIAL=true`, falha se houver pendências |
| `npm run e2e` | build + Playwright + axe na configuração padrão |
| `npm run e2e:matrix` | todas as configurações (vendas abertas, interruptor, avaliações, Turnstile reprovado) |
| `npm run check:publicacao` | lista as pendências que bloqueiam a publicação oficial |
| `npm run images:otimizar` | gera AVIF/WebP das capturas reais do planner |
| `npm run og:gerar` | gera a imagem Open Graph tipográfica |
| `npm run preview:cf` | build OpenNext + `wrangler dev` (simula a hospedagem real) |
| `npm run deploy:cf` | build OpenNext + deploy na Cloudflare (o CI faz isso na `main`) |

## 3. Variáveis de ambiente

Lista completa e regras em [`contracts/ambiente.md`](specs/001-novera-site-mvp/contracts/ambiente.md)
e em `.env.example`. Resumo:

- `NEXT_PUBLIC_*` são públicas e fixadas no build.
- Segredos (`TURNSTILE_SECRET_KEY`, `FORM_SIGNING_SECRET`, `NOVERA_INBOX_EMAIL`, `MAIL_FROM` e
  as credenciais de e-mail) ficam **só** nos secrets do Worker
  (`npx wrangler secret put NOME`). Nunca no repositório.
- **E-mail agnóstico de provedor**: `MAIL_TRANSPORT=smtp` envia por qualquer caixa (Gmail,
  Outlook, Zoho, domínio próprio) com `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER` e `SMTP_PASSWORD`;
  `MAIL_FROM` aceita qualquer endereço. No Gmail, use `smtp.gmail.com`, porta 465 e uma
  "senha de app" (exige verificação em duas etapas). `MAIL_TRANSPORT=resend` continua disponível
  (`RESEND_API_KEY`, domínio verificado no Resend).
- `.env*.local` e `.dev.vars` estão no `.gitignore`.

## 4. Conteúdo: como editar

Todo o conteúdo fica em `src/content/` e é validado no build (conteúdo inválido falha o build).

- **Status `pendente` / `aprovado`**: todo texto comercial é `{ text, status }`. Textos `pendente`
  aparecem nas prévias, mas **bloqueiam a publicação oficial**. Troque para `aprovado` só depois
  da aprovação da redação (P-10).
- **Funcionalidades do produto** (`produtos/planner-2027/index.ts`): só aparecem com
  `verifiedInFile: true`, depois de conferidas no PDF final.
- **Dados da empresa** (`empresa.ts`) e **páginas legais** (`legal/*.ts`): nunca preencha com
  valores inventados. Enquanto pendentes, o site mostra "Documento em preparação".
- **Compatibilidade** (`produtos/planner-2027/compatibilidade.ts`): só registros com teste real.
- Nada de preço, desconto, promoção, escassez ou contador sem aprovação comercial registrada.

### Abrir as vendas

1. Em `src/content/produtos/planner-2027/index.ts`, preencha `sales` com `state: "vendas-abertas"`,
   `platform` (`kiwify` ou `hotmart`) e a `checkoutUrl` oficial (https, host da plataforma).
   O build rejeita dados incompletos ou hosts que não sejam da plataforma.
2. Preço só com `price.status: "aprovado"`.
3. Abra um PR; depois do CI verde e do merge, o deploy publica.

**Interruptor de emergência**: defina a variável `NEXT_PUBLIC_SALES_OVERRIDE=nao-abertas` (Actions →
Variables) e rode o deploy de novo. Todas as áreas de compra voltam para "vendas ainda não abertas".

### Adicionar material de demonstração (somente real)

1. Exporte as páginas do **PDF aprovado, sem alterá-lo**, para `media-originais/planner-2027/`.
2. `npm run images:otimizar` (gera os arquivos em `public/media/planner-2027/` e imprime as medidas).
3. Registre cada imagem em `src/content/produtos/planner-2027/demonstracao.ts` com `alt` que
   descreva o conteúdo real e `status: "aprovado"`. O build falha se o arquivo não existir.

## 5. Moderação de avaliações (rotina da equipe)

As avaliações chegam à caixa `NOVERA_INBOX_EMAIL` com o assunto
`[Novera][Avaliação] Nota N — Nome`. Nada é publicado automaticamente.

1. **Marcadores sugeridos na caixa**: `Novera/Avaliação/Pendente`, `Novera/Avaliação/Publicada`,
   `Novera/Avaliação/Rejeitada` e `Novera/Feedback`.
2. **Verificar a compra**: procure o e-mail informado no painel da plataforma de checkout.
   Sem compra confirmada → não publicar; responda ao autor ("Responder") orientando a usar
   o contato caso tenha comprado (FR-030).
3. **Moderar**. Motivos de rejeição **permitidos** (FR-029): spam, conteúdo abusivo, dados
   pessoais que não possam ser removidos, conteúdo sem relação com o produto, falta de
   autorização ou compra não confirmada. **Nota baixa NÃO é motivo de rejeição.**
   Dados pessoais de terceiros podem ser removidos do texto, **com ciência do autor**.
   No máximo uma avaliação publicada por compra.
4. **Publicar**: adicione a entrada em `src/content/avaliacoes.ts` por Pull Request, **sem o
   e-mail** (só id, nota, comentário moderado, nome público, data de envio, data de publicação
   e `verifiedPurchase: true`). A média e a contagem são calculadas automaticamente.
5. **Remoção a pedido do autor** (FR-035): confirme a autoria (resposta a partir do mesmo
   e-mail) e remova a entrada por PR.
6. **Link de avaliação perdido**: o endereço `/avaliar` não aparece no site. Envie-o ao
   comprador que pedir pelo contato (o link também deve constar no PDF entregue, G-05).

### Feedback privado

Chega com o assunto `[Novera][Feedback][Tipo] ...`. Responda com "Responder" (vai para o e-mail
da pessoa). **Nunca** publique feedback, nem como avaliação, sem consentimento explícito do autor.

### Retenção de dados (FR-036c)

Uma vez por mês, **exclua** da caixa os e-mails de avaliação e de feedback cuja decisão ou
atendimento foi concluído há mais de **6 meses**. Pedidos de exclusão antecipada recebidos
pelo contato devem ser atendidos (apague os e-mails da pessoa e, se ela pedir, a avaliação
publicada).

## 6. Testes e qualidade

- Unitários: `npm test`. E2E: `npm run e2e:matrix` (Playwright em 320, 768, 1440 px e WebKit
  mobile, com auditoria axe). As capturas de revisão visual ficam em `test-results/capturas/`.
- Verificações manuais (teclado, leitor de tela, dispositivos reais, desempenho) são registradas
  em [`checklists/verificacao-manual.md`](specs/001-novera-site-mvp/checklists/verificacao-manual.md).
- Nada é declarado como verificado sem execução real (Constitution VIII).

## 7. Git, CI e deploy

- Branches: `main` (protegida), `feature/…`, `fix/…`, `chore/…`. Conventional Commits.
- **CI** (`.github/workflows/ci.yml`): typecheck, lint, formatação, unitários, `npm audit`,
  build e e2e, em todo push nas branches de trabalho e em PRs para a `main`.
- **PR automático** (`auto-pr.yml`): ao publicar uma branch `feature/`, `fix/` ou `chore/`, um PR
  para a `main` é aberto se ainda não existir. O merge é sempre manual, com os checks verdes.
  Requer: Settings → Actions → General → "Allow GitHub Actions to create and approve pull requests".
- **Proteção da `main`** (ruleset): PR obrigatório; checks `qualidade`, `unitarios`, `seguranca`,
  `build` e `e2e` obrigatórios; sem force push nem exclusão. Se o plano do GitHub não permitir
  regras em repositório privado, vale como processo: **nunca** fazer push direto na `main`.
- **Deploy** (`deploy.yml`): só na `main`, depois do CI verde. Requer os secrets
  `CLOUDFLARE_API_TOKEN` (escopo mínimo: Workers Scripts:Edit) e `CLOUDFLARE_ACCOUNT_ID`, e as
  variables `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` e `NOVERA_PUBLICACAO_OFICIAL`.
- **Plano B de hospedagem**: Netlify Free (ver research R-03), sem mudanças de código além da
  configuração de deploy.

## 8. Publicação oficial

Siga o checklist de [`quickstart.md` §5](specs/001-novera-site-mvp/quickstart.md). Em resumo:
`npm run check:publicacao` sem pendências; termos comerciais da hospedagem confirmados (G-03);
domínio configurado no Turnstile; credenciais SMTP (ou Resend) válidas; `npx wrangler secret list` com todos os
segredos; um envio real de teste chegando à caixa; evidências no PR de publicação.
