# Contrato: Rotas, Navegação e Componentes Públicos

**Funcionalidade**: `001-novera-site-mvp` | Referências: FR-036e, FR-037 a FR-048, SC-004

## 1. Mapa de rotas (exaustivo para o MVP)

| Rota | Arquivo (App Router) | Renderização | Indexável / sitemap | Conteúdo |
|---|---|---|---|---|
| `/` | `src/app/(site)/page.tsx` | estática | sim | marca → produto → demonstração (`#demonstracao`) → benefícios → como funciona → avaliações (`#avaliacoes`, só com dados) → compra (`#comprar`) |
| `/planner-2027` | `src/app/(site)/planner-2027/page.tsx` | estática | sim | detalhes, conteúdo incluído, navegação interna, orientações, compatibilidade, CTA |
| `/faq` | `src/app/(site)/faq/page.tsx` | estática | sim | 8 perguntas obrigatórias + extras aprovadas |
| `/contato` | `src/app/(site)/contato/page.tsx` | estática + Server Action | sim | canais de contato + formulário de feedback privado |
| `/avaliar` | `src/app/(site)/avaliar/page.tsx` | estática + Server Action | **não** (`robots: noindex, nofollow`; fora do sitemap; nenhum link interno) | formulário de avaliação |
| `/privacidade` | `src/app/(site)/privacidade/page.tsx` | estática | sim | política de privacidade |
| `/termos` | `src/app/(site)/termos/page.tsx` | estática | sim | termos e condições |
| `/informacoes-comerciais` | `src/app/(site)/informacoes-comerciais/page.tsx` | estática | sim | empresa, entrega, reembolso/arrependimento (P-04, P-07) |
| (404) | `src/app/not-found.tsx` | estática | não | página "não encontrada" com link para `/` (FR-043) |
| `/sitemap.xml` | `src/app/sitemap.ts` | estática | — | todas as indexáveis acima, exceto `/avaliar` |
| `/robots.txt` | `src/app/robots.ts` | estática | — | permite tudo, exceto `/avaliar` e `/especime`; aponta para o sitemap |
| `/especime` | `src/app/especime/page.tsx` | só em desenvolvimento | não | ferramenta de revisão do design system; `notFound()` em produção |

Nenhuma outra rota pública. Os IDs de âncora são estáveis e fazem parte do contrato:
`#demonstracao`, `#avaliacoes` e `#comprar`.

## 2. Navegação

- **Cabeçalho (desktop ≥ 1024 px)**: logotipo (→ `/`) · Planner 2027 (`/planner-2027`) ·
  Demonstração (`/#demonstracao`) · Dúvidas (`/faq`) · Contato (`/contato`) · botão
  **Comprar** (`PurchaseCta` compacto, → `/#comprar`).
- **Cabeçalho (< 1024 px)**: logotipo + botão "Menu" (`aria-expanded`, `aria-controls`),
  que abre o `MobileNav` (Sheet lateral) com os mesmos itens. Foco retido dentro do menu;
  Esc e o botão "Fechar" devolvem o foco ao botão "Menu".
- **Rodapé (todas as páginas)**: Contato, Dúvidas, Política de privacidade, Termos,
  Informações comerciais, e-mail de suporte (quando aprovado), razão social e CNPJ (quando
  aprovados).
- **Garantia de 2 interações (SC-004)**: de qualquer página, compra = 1 clique (botão no
  cabeçalho); FAQ, contato e legais = no máximo 2 (abrir menu + item, ou rodapé).
- `SkipLink` "Pular para o conteúdo" → `#conteudo` como primeiro elemento focável.

## 3. `PurchaseCta`, comportamento obrigatório

Entrada: `product.sales` + `NEXT_PUBLIC_SALES_OVERRIDE`. Variantes de apresentação:
`hero`, `section`, `header`.

| Estado efetivo | Renderiza | Não renderiza |
|---|---|---|
| `vendas-nao-abertas` | texto "As vendas do Planner 2027 ainda não estão abertas." + link secundário para `/faq` ou `/contato`; no cabeçalho, o botão "Comprar" leva a `/#comprar`, onde a mensagem aparece | `href` externo, preço, desconto, contador ou escassez |
| `vendas-abertas` | `<a href={checkoutUrl}>` com rótulo "Comprar o Planner 2027" + nota visível "Pagamento seguro na <Kiwify/Hotmart> (site externo)"; ícone de link externo; preço só se `price.status = 'aprovado'` | — |

**Links externos (contrato geral)**: `target="_blank"` **só** no checkout, sempre com
`rel="noopener noreferrer"` e aviso textual (visível ou em `sr-only`) "abre em nova aba".
Os demais links externos abrem na mesma aba. O checkout não recebe dados pessoais pela URL.
Parâmetros UTM fixos são permitidos se aprovados.

## 4. Metadados por página (FR-048)

Cada `page.tsx` exporta `metadata` com `title` (modelo `%s · Novera`), `description` (até
160 caracteres), `alternates.canonical`, e `openGraph` (título, descrição, imagem 1200 × 630
gerada a partir de material real ou tipográfica, `locale: 'pt_BR'`, `type: 'website'`).
`<html lang="pt-BR">`. Um único `h1` por página; headings sem pular níveis.

## 5. Seção de avaliações

- `reviews.length === 0`: a seção, a âncora `#avaliacoes`, a média, a contagem e as estrelas
  **não existem no HTML** (não basta ocultar com CSS).
- `reviews.length ≥ 1`: cabeçalho com "Média X,X de 5 · N avaliação(ões) de compradores
  verificados"; cada item mostra nota (estrelas + texto "Nota 4 de 5"), comentário, nome
  público, data (`dd 'de' mês 'de' aaaa`) e o selo "Compra verificada".
