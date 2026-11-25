# Registro de Verificações: MVP do Site Oficial Novera

**Funcionalidade**: `001-novera-site-mvp` | Referências: [quickstart.md](../quickstart.md), Constitution VIII

Cada verificação traz data, quem executou, ambiente, resultado e evidência. **Só registre o que
foi executado de verdade.** Itens marcados como pendentes ainda não foram executados.

---

## Verificações automatizadas executadas na implementação (2026-11-21, agente Claude)

Ambiente: Windows 11, Node 24.14.0, Next 16.4.6, Playwright 1.65.1 (Chromium e WebKit locais).

| Verificação | Comando | Resultado |
|---|---|---|
| Typecheck | `npm run typecheck` | sem erros |
| Lint (inclui jsx-a11y, cores literais, `target="_blank"`) | `npm run lint` | 0 problemas; regras customizadas conferidas com arquivo de prova |
| Formatação | `npm run format:check` | ok |
| Unitários | `npm test` | 116 testes passando (17 arquivos) |
| Build | `npm run build` | 14 rotas, todas estáticas (○) |
| E2E padrão (4 projetos) | `npm run e2e` | 255 passando, 57 pulados por regra de projeto, 0 falhas |
| E2E vendas abertas / interruptor / avaliações / Turnstile reprovado | `npm run e2e:matrix` | 9 + 4 + 4 + 4 passando, 0 falhas |
| V-28 guarda de publicação | `NOVERA_PUBLICACAO_OFICIAL=true npm run build` | **falhou como esperado** (código 1), listando 70 pendências |

Achados corrigidos durante a execução (registrados para o histórico):
- Contraste: numeração editorial (champagne) e legendas (sage) sobre a faixa de papel (sand)
  ficavam abaixo de 4,5:1 (axe). Passaram a usar graphite sobre papel.
- CSP `upgrade-insecure-requests` bloqueava CSS e JS no WebKit em `http://localhost`;
  agora só é aplicada quando `NEXT_PUBLIC_SITE_URL` usa https.
- Exceção do transporte de e-mail gerava erro 500 no Worker; agora vira "falha de envio" com o
  texto preservado (FR-036b), com teste unitário.

---

## V-32 — Hospedagem (prova técnica R-03a)

| Data | Quem | Ambiente | Resultado |
|---|---|---|---|
| 2026-11-21 | agente Claude | OpenNext 1.20.18 + wrangler 4.166.0, `wrangler deploy --dry-run` | Worker do app completo: **5.999 KiB / 1.274 KiB gzip** (limite de 3 MiB no plano gratuito) ✔ |
| 2026-11-21 | agente Claude | `opennextjs-cloudflare preview` (workerd local) | Envio do formulário de contato executou no Worker: token HMAC ✔, Turnstile (chave de teste) ✔, validação ✔; o transporte falso não grava em disco no Worker e o envio terminou em "falha de envio" tratada (esperado). Log estruturado sem dados pessoais ✔ |
| 2026-11-22 | agente Claude | `opennextjs-cloudflare preview` (workerd local) + servidor SMTP de teste local (porta 2525, sem TLS) | `MAIL_TRANSPORT=smtp` (nodemailer sobre `node:net`): formulário de contato enviado pelo Worker → AUTH PLAIN, `From: Site Novera <novera.brazil@gmail.com>`, `Reply-To` da pessoa, assunto e corpo corretos; resultado "Mensagem enviada" em 275 ms ✔ |
| 2026-11-22 | agente Claude | `wrangler deploy --dry-run` com SMTP | Worker com nodemailer: ~1,3 MiB gzip (limite 3 MiB) ✔ |
| pendente | responsável | Worker publicado | Tempo de **CPU** das Server Actions e envio **real** pelo Gmail (`smtp.gmail.com`, porta 465, TLS, senha de app) chegando à caixa |

## Orçamento de JavaScript (plano: ≤ 90 KB gzip nas páginas sem formulário)

| Data | Quem | Medição (build de produção, gzip, sem os polyfills `noModule`) |
|---|---|---|
| 2026-11-21 | agente Claude | Home e páginas de conteúdo: **~150 KB**. `/contato` e `/avaliar`: **~187 KB** |

**Resultado: meta NÃO atendida.** Só o núcleo do Next 16 + React 19 soma ~128 KB gzip; o código
próprio do site acrescenta ~22 KB (menu mobile com Radix Dialog ~13 KB, ícones ~8 KB). A meta de
90 KB do plano não é alcançável com esta stack. **Decisão pendente do responsável**: revisar a meta
(sugestão: ≤ 160 KB nas páginas sem formulário) ou trocar o menu por `<dialog>` nativo (economia
de ~13 KB, ainda acima de 90 KB). O desempenho real deve ser medido em V-29.

## V-31 — Revisão visual

| Data | Quem | Resultado |
|---|---|---|
| 2026-11-21 | agente Claude (revisão preliminar das capturas do e2e, home em 1440 e 320 px; contato em 320 px) | Hierarquia clara, um CTA primário por seção, sem cards repetidos nem ícones decorativos, régua editorial e faixa de papel presentes, sem rolagem horizontal. **Não substitui** a revisão humana abaixo |
| pendente | responsável | Revisão do `/especime` (`npm run dev` → http://localhost:3000/especime) e das capturas do artefato `capturas` do CI nas 6 larguras; aprovação da tipografia (R-04) |
| pendente | responsável | Dispositivos reais: um Android, um iPhone (se disponível) e um tablet |
| pendente | responsável | Teste de reconhecimento sem logotipo (design-system §6.5) |

## V-25 — Teclado (manual)

| Data | Quem | Resultado |
|---|---|---|
| 2026-11-21 | e2e automatizado (parcial) | Menu mobile abre por teclado, retém o foco, fecha com Esc e devolve o foco; SkipLink é o primeiro foco (Chromium); FAQ expande com Enter; nota da avaliação muda com as setas |
| pendente | responsável | Percorrer todas as rotas só com teclado (Chromium e Safari com "Pressionar Tab para destacar cada item") |

## V-30 — Leitor de tela (manual)

| Data | Quem | Resultado |
|---|---|---|
| pendente | responsável | NVDA (Windows) e TalkBack/VoiceOver (celular) em home, `/avaliar` e `/contato`: formulários, erros e confirmações anunciados |

## V-29 — Desempenho (manual)

| Data | Quem | Resultado |
|---|---|---|
| pendente | responsável | PageSpeed Insights (mobile) na prévia de produção: LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms |

## SC-012 — Expansão para outros produtos

| Data | Quem | Resultado |
|---|---|---|
| 2026-11-21 | agente Claude | Um segundo produto fictício (`tests/fixtures/content/produto-teste.ts`) é renderizado no `/especime` com os mesmos componentes (`ProductIntroSection`, `FeatureList`, `CompatibilityTable`), só com conteúdo novo, sem novos padrões visuais. Typecheck e build ok |
| pendente | responsável | Revisão visual do bloco no `/especime` |

## SC-003 — Conteúdo conferido contra o PDF real

| Data | Quem | Resultado |
|---|---|---|
| pendente | responsável | Conferir cada `Feature` e texto do produto contra o PDF final e marcar `verifiedInFile: true` só no que existir |

## SC-001 / SC-002 — Teste de compreensão

| Data | Quem | Resultado |
|---|---|---|
| pendente | responsável | Depois da redação aprovada: 5+ pessoas do público-alvo, 30 s na home; meta ≥ 4/5 descrevem a marca e ≥ 90% dizem que não é um aplicativo |

## SC-009 — Tempo de envio dos formulários

| Data | Quem | Resultado |
|---|---|---|
| pendente | responsável | Cronometrar um envio real de avaliação (meta ≤ 3 min) e de feedback (≤ 2 min) |
