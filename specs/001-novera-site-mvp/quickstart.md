# Quickstart de Validação: MVP do Site Oficial Novera

**Funcionalidade**: `001-novera-site-mvp` | **Plano**: [plan.md](./plan.md)

Guia para rodar o projeto e **comprovar** que o MVP atende à spec. Os comandos abaixo passam a
existir depois da Fase 1 (configuração). Nenhuma verificação pode ser declarada como feita sem
execução real (Constitution VIII).

## 1. Pré-requisitos

- Node.js 24 LTS e npm 11 (`node -v`, `npm -v`).
- Navegadores do Playwright: `npx playwright install --with-deps chromium webkit`.
- Arquivo `.env.local` criado a partir de `.env.example`, com `MAIL_TRANSPORT=fake` e as
  chaves de teste do Turnstile ([contracts/ambiente.md](./contracts/ambiente.md)).

## 2. Comandos

| Comando | O que comprova |
|---|---|
| `npm ci` | instalação reproduzível pelo lockfile |
| `npm run dev` | servidor local em `http://localhost:3000` |
| `npm run typecheck` | `tsc --noEmit` sem erros (strict) |
| `npm run lint` | ESLint (incluindo jsx-a11y e a proibição de cores soltas) sem erros |
| `npm run format:check` | Prettier |
| `npm test` | Vitest: schemas, média e contagem, estados do CTA, guarda de publicação, montagem do e-mail |
| `npm run build` | build de produção do Next |
| `npm run e2e` | Playwright + axe em 320, 768 e 1440 px, contra o build de produção (`next start`) |
| `npm run check:publicacao` | lista as pendências que bloqueiam a publicação oficial |
| `npm run preview:cf` | build OpenNext + `wrangler dev` (simula a hospedagem real; verifica o tamanho do Worker) |

## 3. Cenários de validação (mapeados para a spec)

Execute com `npm run e2e`, salvo quando marcado como **manual**.

| # | Cenário | Como verificar | Resultado esperado | Spec |
|---|---|---|---|---|
| V-01 | Primeira dobra da home | e2e | marca, proposta e CTA "Conhecer o Planner 2027" visíveis sem rolar em 320 e 1440 px | US1-1, FR-001 |
| V-02 | Produto não é app | e2e (texto) | frase "arquivo PDF… não é um aplicativo" presente na home e em `/planner-2027` | US1-3, FR-005 |
| V-03 | Vendas não abertas | e2e com `sales.state = vendas-nao-abertas` (padrão) | nenhum `href` externo de checkout; mensagem "ainda não estão abertas"; nenhum "R$" na página | US2-2/3, FR-017/018 |
| V-04 | Vendas abertas | e2e com conteúdo de teste `vendas-abertas` + URL fictícia **só no teste** | CTA aponta para a URL configurada, `rel="noopener noreferrer"`, aviso de site externo | US2-1, FR-015 |
| V-05 | Interruptor de emergência | e2e com `NEXT_PUBLIC_SALES_OVERRIDE=nao-abertas` + vendas abertas | estado "não abertas" | FR-017 |
| V-06 | Compra em ≤ 2 interações | e2e em cada rota | `/#comprar` alcançado em ≤ 2 cliques | US2-4, SC-004 |
| V-07 | Demonstração vazia | e2e sem materiais aprovados | estado informativo; nenhum `<img>` na seção | US3-3, FR-010 |
| V-08 | Alt em imagens | e2e + axe | toda `<img>` informativa com `alt` não vazio | US3-4 |
| V-09 | Compatibilidade sem testes | e2e | só os requisitos gerais; nenhuma marca citada como compatível | US4-2, FR-013 |
| V-10 | FAQ completo | unit (ids obrigatórios) + e2e | 8 perguntas obrigatórias presentes; resposta "automático" nega automações | US5-1/2, FR-019 |
| V-11 | Feedback: sucesso | e2e com `FakeTransport` | confirmação exibida; transporte recebeu 1 e-mail com `Reply-To` correto; nada da mensagem aparece em página pública | US5-4/5, FR-036a/b |
| V-12 | Feedback: falha de envio | e2e com `FakeTransport` em modo erro | mensagem de erro clara; o texto digitado continua nos campos | FR-036b, borda |
| V-13 | Avaliação: validação | e2e | campos vazios → resumo de erros com links; foco no resumo; texto mantido | US7-2/7 |
| V-14 | Avaliação sem autorização | e2e | não aceita; mensagem orienta para `/contato` | US7-6 |
| V-15 | Avaliação: sucesso | e2e | mensagem "publicada somente depois de… moderação"; nada aparece no site | US7-3/4 |
| V-16 | Honeypot | e2e preenchendo `website` | sucesso aparente; transporte **não** recebe e-mail | FR-036 |
| V-17 | Turnstile reprovado | e2e com chave de teste "sempre reprova" | erro de verificação; texto mantido | FR-036 |
| V-18 | Zero avaliações | e2e com `avaliacoes.ts` vazio | nenhum `#avaliacoes`, "estrela", "média" ou "avaliações" no HTML da home | US6-1, FR-033, SC-010 |
| V-19 | Avaliações com nota baixa | e2e com conteúdo de teste (3 avaliações: 5, 4, 1) | 3 exibidas, média "3,3", contagem 3, selo em todas, ordem por data | US6-2/4/5, FR-031/032 |
| V-20 | `/avaliar` oculta | e2e | ausente de `sitemap.xml`; `noindex` no `<head>`; nenhum `<a href="/avaliar">` em nenhuma página | FR-030a |
| V-21 | Links | e2e (rastreador interno) | 0 links internos quebrados, 0 `href="#"` ou vazio, nos dois estados de venda | SC-005, FR-044 |
| V-22 | 404 | e2e | `/rota-inexistente` → página Novera com link para `/`, status 404 | FR-043 |
| V-23 | Sem rolagem horizontal | e2e | `scrollWidth ≤ clientWidth` em todas as rotas em 320, 768 e 1440 px | SC-006, FR-039 |
| V-24 | Acessibilidade automatizada | e2e axe | 0 violações `serious`/`critical` em todas as rotas | SC-007 |
| V-25 | Teclado | **manual** + e2e parcial (Tab no menu mobile) | todas as funções operáveis, foco visível, menu retém e devolve o foco | SC-007, FR-038 |
| V-26 | Movimento reduzido | e2e com `reducedMotion: 'reduce'` | sem transições; todo o conteúdo presente | SC-008, FR-041 |
| V-27 | Metadados | e2e | `title` e `description` únicos por rota; `lang="pt-BR"`; um `h1` | FR-048 |
| V-28 | Guarda de publicação | unit + `NOVERA_PUBLICACAO_OFICIAL=true npm run build` com pendência | o build falha listando as pendências | FR-022, FR-046 |
| V-29 | Desempenho | **manual**: PageSpeed Insights (mobile) na prévia de produção | LCP ≤ 2,5 s (meta), CLS ≤ 0,1, INP ≤ 200 ms nas métricas de laboratório; registrar os valores no PR de publicação | SC-011 |
| V-30 | Leitor de tela | **manual**: NVDA (Windows) e TalkBack/VoiceOver (celular) em home, `/avaliar` e `/contato` | formulários e erros anunciados corretamente | SC-007 |
| V-31 | Revisão visual | **manual**: capturas do CI nas 6 larguras + dispositivos reais | checklist do [design-system.md §6](./design-system.md) aprovado | Constitution VIII |
| V-32 | Hospedagem | `npm run preview:cf` + deploy de prévia | Worker ≤ 3 MiB; envio real de teste (SMTP ou Resend) chega à caixa | R-03a |

## 4. Teste de compreensão (SC-001, SC-002), manual

Com pelo menos 5 pessoas do público-alvo, depois do conteúdo aprovado: 30 segundos na home
e, em seguida, as perguntas "O que é a Novera?" e "O Planner 2027 é um aplicativo?".
Registrar os resultados no PR de publicação. Meta: ≥ 4/5 descrevem a marca e ≥ 90%
respondem "não é um aplicativo".

## 5. Checklist de publicação oficial

- [ ] `npm run check:publicacao` sem pendências (P-04 a P-07, P-10, G-01 e G-02 resolvidos).
- [ ] Termos de uso comercial da hospedagem confirmados (G-03).
- [ ] Credenciais de e-mail (SMTP ou Resend) válidas; hostname configurado no Turnstile.
- [ ] V-01 a V-32 executados, com evidência no PR.
- [ ] Link de `/avaliar` incluído na versão do PDF entregue ao comprador (G-05, quando aplicável).
