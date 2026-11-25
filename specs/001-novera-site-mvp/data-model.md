# Modelo de Dados: MVP do Site Oficial Novera

**Funcionalidade**: `001-novera-site-mvp` | **Data**: 2026-11-18 | **Plano**: [plan.md](./plan.md)

O MVP **não tem banco de dados**. Os dados existem em dois lugares:

1. **Conteúdo versionado**: módulos TypeScript em `src/content/`, validados por schemas Zod
   no build (R-07, R-09). Mudam só por Pull Request.
2. **Envios transitórios**: avaliações e feedback chegam por formulário, são validados no
   servidor e **encaminhados por e-mail**. Não são persistidos pelo site (FR-036a). A caixa de
   e-mail da Novera é o registro operacional.

Convenção: os nomes de campos no código ficam em inglês `camelCase`, e os valores
enumerados em português, porque aparecem no conteúdo. A tabela mostra os dois.

---

## 1. Entidades de conteúdo (versionadas)

### 1.1 `ContentStatus` (tipo compartilhado)

`'pendente' | 'aprovado'`. Todo item comercial ou jurídico tem esse status. Itens `pendente`:
- **não** são renderizados como fato no site (são substituídos pelo estado informativo
  correspondente, ou omitidos);
- fazem a **guarda de publicação** falhar (§3) quando `NOVERA_PUBLICACAO_OFICIAL=true`.

Textos provisórios (FR-046) usam o tipo `Copy = { text: string; status: ContentStatus }`.

### 1.2 `Product` (`src/content/produtos/planner-2027/index.ts`)

| Campo | Tipo | Regra |
|---|---|---|
| `slug` | `string` | `planner-2027`; define a rota `/planner-2027` |
| `name` | `string` | "Novera Planner Digital 2027" |
| `tagline` | `Copy` | frase curta |
| `description` | `Copy` | |
| `period` | `{ start: '2027-01'; end: '2027-12' }` | FR-004 |
| `format` | `'pdf-interativo'` | FR-005: o rótulo exibido sempre inclui "arquivo PDF, não é um aplicativo" |
| `features` | `Feature[]` | §1.3 |
| `includedContent` | `Copy[]` | FR-012 |
| `usageGuidance` | `Copy[]` | |
| `limitations` | `Copy[]` | fixo: sem sincronização, lembretes ou automações (FR-005) |
| `sales` | `SalesConfig` | §1.4 |
| `demo` | `DemoMaterial[]` | §1.5 |
| `compatibility` | `CompatibilityRecord[]` | §1.6 |
| `seo` | `{ title: string; description: string }` | FR-048 |

**Relações**: um `Product` tem muitos `Feature`, `DemoMaterial` e `CompatibilityRecord`, e
uma `SalesConfig`. Expansão futura: um novo produto é um novo diretório em
`src/content/produtos/` com o mesmo tipo (FR-014, SC-012). **Não há** índice ou listagem de
produtos no MVP.

### 1.3 `Feature`

| Campo | Tipo | Regra |
|---|---|---|
| `id` | `string` (kebab-case, único no produto) | |
| `title` | `string` | |
| `description` | `string` | |
| `verifiedInFile` | `boolean` | **MUST** ser `true` para renderizar (FR-006, SC-003); conferido contra o PDF real |
| `status` | `ContentStatus` | |

### 1.4 `SalesConfig`

| Campo | Tipo | Regra |
|---|---|---|
| `state` | `'vendas-nao-abertas' \| 'vendas-abertas'` | padrão `vendas-nao-abertas` |
| `platform` | `'kiwify' \| 'hotmart' \| null` | obrigatório quando `vendas-abertas` (P-01) |
| `checkoutUrl` | `string \| null` | obrigatório quando `vendas-abertas`; `https:`; host na lista permitida da plataforma (`pay.kiwify.com.br`, `pay.hotmart.com`, e equivalentes **[VERIFICAR na plataforma escolhida]**) |
| `price` | `{ amountCents: number; currency: 'BRL'; status: ContentStatus } \| null` | exibido **só** se `status = 'aprovado'` (FR-018) |

**Transições**: `vendas-nao-abertas → vendas-abertas` só por PR que preenche `platform` e
`checkoutUrl` válidos. O schema rejeita o build se o estado for `vendas-abertas` sem esses
campos.

**Valor efetivo**: a variável opcional `NEXT_PUBLIC_SALES_OVERRIDE=nao-abertas` força o
estado "não abertas" (interruptor de emergência, sem PR de conteúdo). O inverso **não** existe:
abrir vendas exige dados válidos no conteúdo.

### 1.5 `DemoMaterial`

| Campo | Tipo | Regra |
|---|---|---|
| `id` | `string` | |
| `kind` | `'imagem' \| 'video'` | |
| `src` | `string` | caminho em `public/media/...`; o build verifica que o arquivo existe |
| `poster` | `string?` | obrigatório para vídeo |
| `alt` | `string` | obrigatório, descreve o conteúdo real (FR-009, cenário 3.4) |
| `caption` | `string` | |
| `section` | `'navegacao' \| 'diario' \| 'semanal' \| 'mensal' \| 'calendario' \| 'metas' \| 'financas' \| 'anotacoes' \| 'escrita'` | |
| `textEquivalent` | `string?` | obrigatório para vídeo (FR-011) |
| `status` | `ContentStatus` | só os `aprovado` são renderizados |

**Estado vazio**: nenhum material `aprovado` → estado informativo (FR-010).

### 1.6 `CompatibilityRecord`

| Campo | Tipo | Regra |
|---|---|---|
| `app` | `string` | |
| `platform` | `string` | sistema e dispositivo |
| `checks` | `{ internalLinks: boolean; handwriting: boolean }` | |
| `result` | `'compativel' \| 'parcial' \| 'incompativel'` | |
| `testedOn` | `string` (ISO date) | |
| `notes` | `string?` | |

**Regra**: a lista vazia exibe só os requisitos gerais (FR-013). Só `compativel` aparece como
compatível; `parcial` aparece com a limitação descrita.

### 1.7 `FaqItem` (`src/content/faq.ts`)

`{ id, question, answer: Copy, order }`. As oito perguntas obrigatórias do FR-019 têm
`id` fixo. Um teste verifica que todas existem.

### 1.8 `LegalPage` (`src/content/legal/*.ts`)

| Campo | Tipo | Regra |
|---|---|---|
| `kind` | `'privacidade' \| 'termos' \| 'informacoes-comerciais'` | rota correspondente |
| `title` | `string` | |
| `body` | blocos estruturados (título, parágrafo, lista) | |
| `status` | `ContentStatus` | `pendente` → a página mostra "Documento em preparação" e bloqueia a publicação |
| `effectiveDate` | `string?` | obrigatório quando `aprovado` |

A política de privacidade **MUST** cobrir: finalidade de cada formulário, operadores
(Cloudflare, Resend), transferência internacional, prazo de 6 meses (FR-036c) e o canal de
exclusão.

### 1.9 `BusinessInfo` (`src/content/empresa.ts`)

`{ legalName, taxId, contactEmail, supportHours?, responseTime?, status }`, com
status por campo (P-04, P-05). Campos pendentes nunca são renderizados com valor inventado.

### 1.10 `PublishedReview` (`src/content/avaliacoes.ts`)

| Campo | Tipo | Regra |
|---|---|---|
| `id` | `string` | único, formato `aaaa-mm-dd-nn` |
| `productSlug` | `'planner-2027'` | |
| `rating` | `1 \| 2 \| 3 \| 4 \| 5` | inteiro |
| `comment` | `string` | 20–1.500 caracteres, já moderado (sem dados pessoais) |
| `publicName` | `string` | 2–60 caracteres |
| `submittedOn` | `string` (ISO date) | a data exibida é a data de envio |
| `publishedOn` | `string` (ISO date) | ≥ `submittedOn` |
| `verifiedPurchase` | `true` (literal) | FR-030: só verificadas existem neste arquivo |

**Proibido no arquivo**: e-mail, telefone ou qualquer contato do autor.

**Derivados (calculados, nunca escritos à mão)**:
- `count = reviews.length`
- `average = round1(sum(rating)/count)`, exibida só se `count ≥ 1` (FR-032)
- ordenação: `submittedOn` decrescente (nunca por nota)

**Ciclo de vida da avaliação** (o site só conhece o último estado):

```text
[enviada] → (e-mail na caixa) → [em verificação de compra] ─ não confirmada → [rejeitada] (autor informado; FR-030)
                                         │
                                         └─ confirmada → [em moderação] ─ spam/abuso/dados não removíveis/sem relação → [rejeitada]
                                                                   │
                                                                   └─ aprovada (com ou sem remoção de dados pessoais, com ciência do autor)
                                                                           → PR em avaliacoes.ts → [publicada]
[publicada] ─ pedido de remoção com autoria confirmada → PR remove a entrada → [removida]
```

Os estados intermediários vivem só na caixa de e-mail (marcadores sugeridos:
`Novera/Avaliação/Pendente`, `/Publicada`, `/Rejeitada`). Duplicidade (FR, casos de borda):
no máximo uma avaliação publicada por e-mail de compra, conferida na moderação.

---

## 2. Envios transitórios (formulários)

### 2.1 `ReviewSubmission` (página `/avaliar`)

| Campo | Tipo | Obrig. | Validação | Mensagem de erro (exemplo) |
|---|---|---|---|---|
| `rating` | inteiro 1–5 | sim | | "Escolha uma nota de 1 a 5 estrelas." |
| `comment` | texto | sim | 20–1.500 após `trim` | "Escreva pelo menos 20 caracteres sobre sua experiência." |
| `publicName` | texto | sim | 2–60; sem `@` nem sequência de 8 ou mais dígitos | "Informe como seu nome deve aparecer (2 a 60 caracteres, sem e-mail ou telefone)." |
| `purchaseEmail` | e-mail | sim | formato válido, ≤ 254 | "Informe o e-mail usado na compra, no formato nome@exemplo.com." |
| `publicationConsent` | booleano | sim | `true` | "Para publicar, autorize a publicação. Se quiser só falar com a equipe, use a página de contato." (com link) |
| `privacyAck` | booleano | sim | `true` | "Confirme que leu o aviso de privacidade." |
| `website` | texto | — | honeypot: **MUST** ser vazio | (silencioso: responde com sucesso aparente e descarta) |
| `formToken` | string | sim | HMAC válido e ≥ 3 s | "Não foi possível validar o envio. Recarregue a página e tente de novo." |
| `cf-turnstile-response` | string | sim | `siteverify` ok | "Não conseguimos confirmar que o envio é de uma pessoa. Tente novamente." |

### 2.2 `FeedbackSubmission` (página `/contato`)

| Campo | Tipo | Obrig. | Validação |
|---|---|---|---|
| `type` | `'sugestao' \| 'problema' \| 'duvida' \| 'suporte'` | sim | FR-024 |
| `message` | texto | sim | 10–3.000 |
| `replyEmail` | e-mail | sim | o meio de resposta é e-mail (G-04) |
| `name` | texto | não | ≤ 60 |
| `privacyAck` | booleano | sim | `true` |
| `website`, `formToken`, `cf-turnstile-response` | | | iguais aos de §2.1 |

### 2.3 `SubmissionResult` (retorno da Server Action)

```text
{ status: 'idle' }
{ status: 'success' }                                   // só após o provedor aceitar o e-mail (FR-036b)
{ status: 'invalid', fieldErrors: Record<campo, msg>, values: <valores enviados> }  // preserva o texto
{ status: 'error', reason: 'verificacao' | 'envio' | 'limite', message, values }   // erro geral, preserva o texto
```

Os `values` devolvidos permitem preencher o formulário de novo sem perder o texto
(cenário 7.7). Com JavaScript desligado, a Server Action responde por recarga com os mesmos
dados.

---

## 3. Guarda de publicação (FR-022, FR-046)

A função pura `collectPublicationBlockers(content) → Blocker[]` lista:
- qualquer `Copy`, `LegalPage`, `BusinessInfo` ou `FaqItem` com `status: 'pendente'`;
- variáveis de ambiente obrigatórias ausentes (ver
  [contracts/ambiente.md](./contracts/ambiente.md));
- `Feature` com `verifiedInFile: false` marcada como `aprovado`.

O script `npm run check:publicacao` imprime a lista. No build de produção com
`NOVERA_PUBLICACAO_OFICIAL=true`, qualquer bloqueio **falha o build**. Sem essa variável
(prévias, homologação), o site funciona e mostra os estados pendentes.

Abrir as vendas (`vendas-abertas`) **não** exige que todos os bloqueios estejam resolvidos, e
vice-versa. Mas a pendência P-03 (preço) só é exigida se o preço for exibido.
