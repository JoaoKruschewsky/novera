# Design System Novera — Dark Minimal Premium (planejamento)

**Funcionalidade**: `001-novera-site-mvp` | **Data**: 2026-11-18 | **Plano**: [plan.md](./plan.md)

Este documento define o design system que **MUST** existir antes da implementação das páginas
(Fase 2). Ele é a referência dos tokens, componentes e regras visuais. Os valores aqui são o
ponto de partida e são validados na revisão visual da Fase 2. Qualquer alteração de token é
feita só em `src/styles/tokens.css`.

## 1. Conceito

**"Papel sobre grafite."** O site é escuro e silencioso (grafite e ardósia), e o produto
aparece como o que ele é: páginas de papel (areia e off-white) iluminadas sobre a mesa escura.
O champagne é o único acento, usado com parcimônia, como uma linha de caneta: ação primária,
foco e pequenos marcadores editoriais.

Elementos de assinatura que tornam o site reconhecível sem o logotipo:
1. **Faixas de papel**: seções de demonstração com fundo `sand`/`offwhite` e as páginas reais
   do planner, como folhas sobre a mesa. É uma inversão de contraste com função: destacar o
   produto.
2. **Régua editorial**: fio fino champagne (1 px) com numeração de seção em versalete
   (`01 — Como funciona`), que lembra as abas e índices do planner.
3. **Tipografia como imagem**: títulos grandes em serifa (Newsreader) alinhados a uma grade
   assimétrica (texto em 7 de 12 colunas), sem hero com foto genérica.
4. **Grade de pauta**: textura opcional de linhas finas de baixa opacidade, só em áreas
   pontuais, como referência ao espaço de escrita.

Proibido: gradientes chamativos, neon, glassmorphism, sombras pesadas, sequências de cards
idênticos, ícones decorativos em toda seção e animações de entrada genéricas.

## 2. Tokens primitivos

### 2.1 Cor (paleta aprovada, Constitution II)

| Token | Hex |
|---|---|
| `--color-graphite` | `#252B32` |
| `--color-slate` | `#343D47` |
| `--color-sage` | `#596B69` |
| `--color-champagne` | `#B49A70` |
| `--color-sand` | `#D8D0C3` |
| `--color-offwhite` | `#F2F0EA` |

Derivados permitidos, definidos **só** em `tokens.css` por `color-mix()` a partir da paleta:
`graphite-deep` (graphite com 15% de preto, para o rodapé), `champagne-strong` (champagne com
12% de offwhite, para hover), `line` (offwhite com 12% de opacidade sobre graphite, para fios e
bordas decorativas).

### 2.2 Contraste medido (WCAG 2.x, luminância relativa)

| Primeiro plano / fundo | Razão | Uso permitido |
|---|---|---|
| offwhite / graphite | ≈ 12,5:1 | todo texto |
| sand / graphite | ≈ 9,3:1 | texto secundário |
| champagne / graphite | ≈ 5,3:1 | texto, links, foco (≥ 4,5 ✔) |
| offwhite / slate | ≈ 9,7:1 | todo texto |
| sand / slate | ≈ 7,2:1 | texto secundário |
| champagne / slate | ≈ 4,1:1 | **só texto grande (≥ 24 px, ou 18,66 px em negrito) e ícones/foco (≥ 3 ✔)**; nunca texto normal |
| graphite / champagne | ≈ 5,3:1 | rótulo do botão primário |
| graphite / sand | ≈ 9,3:1 | texto nas faixas de papel |
| sage / offwhite | ≈ 4,9:1 | texto auxiliar nas faixas de papel |
| sage / graphite | ≈ 2,5:1 | **só decorativo**; nunca texto, borda de campo ou indicador de estado |

Os valores devem ser reconferidos com ferramenta (axe ou um verificador de contraste) na
Fase 2. Qualquer par novo **MUST** ser medido antes do uso.

### 2.3 Tipografia

- `--font-display`: Newsreader (variável, `opsz` e `wght` 400–600, itálico 400).
- `--font-sans`: Hanken Grotesk (variável, `wght` 400–600).
- Escala fluida com `clamp()`, base de 16 px no mobile e 17 px no desktop:

| Token | Mobile (320 px) → Desktop (1440 px) | Família / peso | Uso |
|---|---|---|---|
| `text-display` | 40 → 76 px, entrelinha 1,05 | display 500, `opsz` alto | título do hero |
| `text-h1` | 34 → 56 px, 1,1 | display 500 | título de página |
| `text-h2` | 28 → 40 px, 1,15 | display 500 | título de seção |
| `text-h3` | 21 → 26 px, 1,25 | sans 600 | subtítulos |
| `text-lead` | 18 → 21 px, 1,55 | sans 400 | parágrafo de abertura |
| `text-body` | 16 → 17 px, 1,65 | sans 400 | texto corrido |
| `text-small` | 14 → 15 px, 1,5 | sans 400 | notas, legendas |
| `text-eyebrow` | 12 → 13 px, espaçamento +0,12 em, versalete | sans 600 | numeração de seção |

Medida de leitura: no máximo **68 caracteres** por linha (`max-w-prose` personalizado).
Texto corrido nunca em serifa abaixo de 18 px.

### 2.4 Espaço, grade e larguras

- Escala de espaço com base de 4 px: `1=4`, `2=8`, `3=12`, `4=16`, `6=24`, `8=32`, `12=48`,
  `16=64`, `24=96`, `32=128`.
- Ritmo vertical entre seções: `16` no mobile, `24` no tablet e `32` no desktop.
- Grade: 4 colunas no mobile (margem de 20 px), 8 no tablet (margem de 32 px) e 12 no desktop
  (margem fluida, *gutter* de 24 px).
- Larguras máximas: `--w-content` 1200 px (grade), `--w-prose` 68ch (textos e páginas
  legais), `--w-wide` 1360 px (faixas de demonstração).
- Pontos de quebra: `sm` 640, `md` 768, `lg` 1024, `xl` 1280. O desenvolvimento é
  mobile-first.

### 2.5 Raio, borda e sombra

- Raio: `--radius-sm` 4 px (campos, botões), `--radius-md` 8 px (imagens do produto),
  `--radius-full` (só em indicadores circulares). Nada de cantos muito arredondados.
- Borda: 1 px `line` para divisões; 1 px `sand` com 40% em campos (contraste da borda do
  campo contra o fundo ≥ 3:1 **MUST** ser verificado; se falhar, usar `sand` sólido).
- Sombra: **uma** sombra, `--shadow-paper` (`0 1px 2px` + `0 12px 32px -16px` em preto com
  baixa opacidade), usada **só** nas páginas do planner dentro das faixas de papel. Nenhuma
  outra sombra.

### 2.6 Movimento

- `--duration-fast` 120 ms, `--duration-base` 200 ms, curva `cubic-bezier(.2,.0,.0,1)`.
- Só em: hover e foco, abertura e fechamento do menu mobile, e troca de imagem da
  demonstração.
- `@media (prefers-reduced-motion: reduce)`: as durações vão para 0 ms; nenhuma informação
  depende de movimento (FR-041).
- **Exceções aprovadas pelo responsável (2026-11-24)**, só na demonstração:
  - vídeo de apresentação que toca **sem som** e em loop enquanto está visível na tela, com
    controles nativos; com movimento reduzido, não inicia sozinho;
  - faixa de fotos em movimento contínuo e lento (marquee, 60 s por volta), com botão
    "Pausar fotos", pausa com ponteiro ou foco, bordas esmaecidas; com movimento reduzido, fica
    parada e vira rolagem horizontal comum (WCAG 2.2.2).

## 3. Tokens semânticos

| Token semântico | Valor | Nota |
|---|---|---|
| `surface-base` | graphite | fundo padrão |
| `surface-raised` | slate | blocos de destaque, menu mobile |
| `surface-paper` | sand | faixas de demonstração |
| `surface-paper-bright` | offwhite | página interna do produto e formulários na faixa clara (opcional) |
| `surface-footer` | graphite-deep | rodapé |
| `text-primary` | offwhite | |
| `text-secondary` | sand | |
| `text-on-paper` | graphite | |
| `text-on-paper-muted` | sage | só sobre offwhite |
| `text-accent` | champagne | links e destaques sobre graphite |
| `border-subtle` | line | divisões |
| `border-field` | sand/40% ou sand | campos |
| `accent` | champagne | botão primário, fio editorial |
| `accent-hover` | champagne-strong | |
| `focus-ring` | champagne (sobre fundos escuros) / graphite (sobre papel) | anel de 2 px + deslocamento de 2 px |
| `state-error` | **a definir na Fase 2**: tom derivado de champagne ou sand, sempre com ícone e texto, nunca só cor | a paleta não tem vermelho; o erro é comunicado por texto + ícone `CircleAlert` + borda |
| `state-success` | offwhite + ícone `CircleCheck` | idem, não depende de cor |

## 4. Componentes reutilizáveis (`src/components/ui/`)

Todos são Server Components, salvo onde indicado **(cliente)**.

| Componente | Variantes / estados | Regras de acessibilidade |
|---|---|---|
| `Button` | `primary` (fundo champagne, texto graphite), `secondary` (contorno sand, texto offwhite), `quiet` (texto com sublinhado); estados hover, focus-visible, active, disabled (`aria-disabled`, opacidade + cursor), loading (rótulo muda para "Enviando…", `aria-busy`) | área de toque ≥ 44 × 44 px; rótulo sempre textual |
| `TextLink` | interno e externo (externo com ícone `ArrowUpRight` e texto oculto "(abre site externo)") | sublinhado visível em texto corrido |
| `PurchaseCta` | resolve sozinho o estado de venda (ver [contracts/rotas-e-componentes.md](./contracts/rotas-e-componentes.md)) | estado "vendas não abertas" é texto, não botão desabilitado sem explicação |
| `SectionHeader` | numeração + eyebrow + título + lead | a hierarquia de headings vem por propriedade (`as="h2"`) |
| `EditorialRule` | horizontal, com numeração | decorativo (`aria-hidden`) |
| `PaperBand` | faixa clara com largura `--w-wide` | troca automática dos tokens de texto e foco |
| `ProductFigure` | imagem real + legenda; sem moldura de dispositivo falsa | `alt` obrigatório pelo tipo |
| `Field`, `TextArea`, `RatingInput` **(cliente)**, `ConsentCheckbox`, `FormStatus` | normal, foco, erro, desabilitado | `label` visível, `aria-describedby` para ajuda e erro, `aria-invalid`; `RatingInput` = grupo de rádios nativos estilizados como estrelas, com `legend` e rótulos "1 de 5"… |
| `Notice` | informativo (estado pendente, vendas não abertas, materiais em breve) | `role="status"` só quando muda dinamicamente |
| `SiteHeader`, `MobileNav` **(cliente; Sheet do shadcn)**, `SiteFooter`, `SkipLink` | — | link "Pular para o conteúdo" como primeiro foco; `aria-expanded` e `aria-controls` no botão de menu |

Ícones (Lucide): **só funcionais** (menu, fechar, link externo, alerta, sucesso, estrela da
nota, seta de avanço). Nenhuma seção com ícone decorativo em série.

## 5. Padrões de layout por seção (contra "layout previsível")

- **Hero**: título em serifa grande à esquerda (7 colunas), proposta em uma frase, CTA
  primário; à direita, um *crop* real de uma página do planner sobre fundo de papel, ou,
  sem material, a régua editorial com o índice de seções do produto (tipográfico, sem
  simular o produto).
- **Benefícios**: lista editorial numerada em duas colunas, com fios entre os itens; sem cards.
- **Como funciona**: quatro passos em linha do tempo horizontal no desktop e vertical no
  mobile, conectados pelo fio champagne.
- **Demonstração**: faixa de papel; o vídeo de apresentação em destaque (com legenda e
  descrição textual expansível), a faixa de fotos do planner em uso (marquee, ver §2.6) e o bloco
  "Experimente antes de comprar" com o download da prévia gratuita em PDF. Na página do produto,
  sem o vídeo (já está na home) e com o texto curto da prévia.
- **Avaliações** (só com dados): citações em tipografia editorial e cabeçalho com média e
  contagem reais; sem carrossel automático.
- **Compra**: bloco único e calmo, com o CTA e a nota "Pagamento processado por <plataforma>".

## 6. Estratégia de revisão visual

1. **Espécime** (Fase 2): a rota interna `/especime` responde só em desenvolvimento (em
   produção chama `notFound()`, não é indexada e fica fora do sitemap). Ela mostra tokens,
   tipografia, botões em todos os estados, campos e notices. Não é uma página do site: é uma
   ferramenta de revisão, então não contraria o FR-036e.
2. **Larguras fixas de revisão**: 320, 375, 768, 1024, 1440 e 1920 px. Capturas automáticas
   do Playwright de cada página nessas larguras, guardadas como artefato do CI (sem comparação
   de pixels no MVP) para revisão humana em cada PR com mudança visual.
3. **Dispositivos reais**: pelo menos um celular Android, um iPhone (se disponível) e um
   tablet, antes da publicação.
4. **Checklist de revisão** (em cada PR visual): hierarquia clara? Um CTA primário por seção?
   Algum valor de cor solto? Algum card repetitivo ou ícone decorativo? Contraste conferido?
   Foco visível? Algo "parece template"?
5. Teste de reconhecimento: mostrar um trecho sem o logotipo a duas pessoas e verificar se
   associam ao mesmo site (qualitativo, registrado no PR de fechamento da Fase 4).
