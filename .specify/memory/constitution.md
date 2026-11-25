<!--
Sync Impact Report
==================
Alteração de versão: 1.0.0 → 1.1.0 (MINOR)
Motivo: inclusão de avaliações públicas de compradores e de feedback privado no escopo do
MVP, por decisão do responsável pelo produto em 2026-11-16.

Princípios modificados:
- IV. Integridade Comercial e Conteúdo Verdadeiro — ampliado com regras para avaliações
  (autenticidade, moderação, verificação de compra, proibição de médias sem dados reais,
  preservação de avaliações negativas legítimas).
- VI. Segurança e Configuração — ampliado com regras de coleta de dados pessoais (LGPD).

Seções modificadas:
- Decisões Arquiteturais Iniciais e Escopo do MVP — "sistema de avaliações" saiu da lista
  "Fora do MVP"; avaliações e feedback privado entraram no escopo; permitido armazenamento
  mínimo de baixo custo (preferencialmente serviço gerenciado) exclusivamente para
  avaliações e feedback, sem conta de cliente.

Seções adicionadas/removidas: nenhuma.

Impacto: a especificação do MVP pode incluir avaliações e feedback; o plano técnico deve
justificar a solução de armazenamento, moderação, antispam e verificação de compra.

Templates dependentes: nenhum alterado (leem a Constitution em tempo de execução).

TODOs pendentes: nenhum.
-->

# Constitution da Novera

A Novera é uma marca brasileira de produtos digitais focada em planejamento, organização
pessoal, simplicidade e experiência premium. O site da Novera não é apenas uma página de
vendas: ele apresenta a marca, demonstra seus produtos, facilita a compra e oferece
orientações e suporte.

O primeiro produto é o **Novera Planner Digital 2027**, um planner em PDF interativo, com
navegação por links internos e espaços para escrita manual. A arquitetura deve acomodar a
futura inclusão de outros planners, templates, planilhas e produtos digitais.

Este documento é a referência obrigatória para todas as especificações, planos técnicos,
tarefas, implementações e revisões de código do projeto. As palavras **MUST**, **MUST NOT**,
**SHOULD** e **SHOULD NOT** têm o sentido normativo usual (RFC 2119): MUST indica
obrigatoriedade; SHOULD indica recomendação forte, cujo descumprimento exige justificativa
documentada.

## Princípios Fundamentais

### I. Simplicidade e Escopo Enxuto

- O MVP **MUST** ser simples, rápido e econômico de construir e manter.
- Funcionalidades complexas **MUST NOT** ser implementadas sem necessidade comprovada e
  documentada em uma especificação.
- Abstrações **MUST NOT** ser criadas para problemas hipotéticos; a solução mais simples
  que atende ao requisito atual **MUST** ser a preferida.
- A estrutura de conteúdo e componentes **SHOULD** permitir adicionar novos produtos sem
  reescrita, mas produtos e funcionalidades futuras **MUST NOT** ser implementados
  antecipadamente.

**Justificativa**: complexidade prematura aumenta custo, atrasa o lançamento e dificulta a
manutenção de um projeto em fase inicial.

### II. Design Autoral Dark Minimal Premium

- A identidade visual aprovada é **Dark Minimal Premium**, com a paleta de referência:

  | Token        | Nome            | Hex       |
  |--------------|-----------------|-----------|
  | `graphite`   | Grafite principal | `#252B32` |
  | `slate`      | Ardósia         | `#343D47` |
  | `sage`       | Sálvia          | `#596B69` |
  | `champagne`  | Champagne       | `#B49A70` |
  | `sand`       | Areia           | `#D8D0C3` |
  | `offwhite`   | Off-white       | `#F2F0EA` |

- Cores, tipografia, espaçamentos, raios e sombras **MUST** ser definidos como design
  tokens reutilizáveis; componentes **MUST NOT** usar valores de cor soltos (hex/rgb)
  fora da definição de tokens.
- O site **MUST NOT** utilizar: gradientes neon, glassmorphism excessivo, brilhos
  artificiais, sombras exageradas, animações sem função de UX ou sequências de cards
  repetitivos como recurso padrão de layout.
- Templates completos de terceiros **MUST NOT** ser usados sem adaptação integral à
  identidade Novera; sites de concorrentes ou referências **MUST NOT** ser copiados.
- A composição **MUST** priorizar tipografia refinada, hierarquia visual clara, alinhamentos
  consistentes e espaçamento intencional. Elementos decorativos **MUST** ter função para a
  identidade ou para a experiência.
- Originalidade, legibilidade e qualidade visual **MUST** prevalecer sobre a quantidade de
  efeitos. O resultado **MUST NOT** ter aparência genérica de site gerado por IA.

**Justificativa**: a percepção premium da marca depende de um design próprio, coerente e
contido, e não de efeitos visuais.

### III. Usabilidade e Acessibilidade

- Usabilidade **MUST** ter prioridade sobre decoração.
- A navegação **MUST** ser compreensível para usuários iniciantes.
- O desenvolvimento **MUST** ser mobile-first, e o site **MUST** funcionar em celulares,
  tablets e desktops.
- Cada seção **SHOULD** ter um único CTA primário; botões **MUST NOT** competir entre si
  pela atenção do usuário.
- Pop-ups invasivos e elementos que prejudiquem a leitura **MUST NOT** ser utilizados.
- A referência de acessibilidade é **WCAG 2.2 nível AA**. São obrigatórios: contraste
  adequado, navegação completa por teclado, estados de foco visíveis, textos alternativos
  em imagens informativas, HTML semântico e respeito a `prefers-reduced-motion`.
- Mensagens de erro **MUST** explicar o problema e como resolvê-lo.

**Justificativa**: um produto de organização pessoal precisa ser fácil de usar por qualquer
pessoa, em qualquer dispositivo.

### IV. Integridade Comercial e Conteúdo Verdadeiro (NÃO NEGOCIÁVEL)

- Toda comunicação **MUST** ser em português brasileiro claro, próximo e profissional.
- É proibido (**MUST NOT**):
  - inventar avaliações, depoimentos, números de vendas ou resultados;
  - inventar funcionalidades do Planner 2027 ou de qualquer produto;
  - apresentar o PDF interativo como aplicativo nativo;
  - prometer sincronização ou automações inexistentes;
  - declarar compatibilidade com aplicativos que não foram efetivamente testados;
  - utilizar demonstrações fictícias que induzam o consumidor ao erro.
- Mockups, capturas e demonstrações **MUST** representar fielmente o produto real.
- Conteúdo comercial ainda não confirmado **MUST** ser marcado como pendente na
  especificação, e não publicado como fato.
- Avaliações de clientes:
  - apenas avaliações autênticas, enviadas por pessoas reais e com autorização de
    publicação, **MUST** ser exibidas;
  - avaliações **MUST** passar por moderação (spam, dados pessoais, conteúdo abusivo)
    antes da publicação;
  - o selo de "compra verificada" **MUST** aparecer somente com confirmação efetiva da
    compra;
  - médias, contagens e estrelas **MUST NOT** ser exibidas sem dados reais aprovados;
  - avaliações negativas legítimas **MUST NOT** ser removidas ou ocultadas por serem
    negativas;
  - feedback privado **MUST NOT** ser publicado sem consentimento explícito do autor.

**Justificativa**: a confiança do consumidor é o principal ativo da marca, e afirmações
falsas geram risco legal (Código de Defesa do Consumidor) e reputacional.

### V. Qualidade de Código

- O código **MUST** ser legível, tipado e organizado; TypeScript em modo `strict` **MUST**
  compilar sem erros.
- Cada componente **MUST** ter responsabilidade bem definida.
- **MUST** haver separação clara entre componentes reutilizáveis, páginas, conteúdo,
  estilos e lógica de negócio.
- A nomenclatura **MUST** ser consistente em todo o projeto.
- Código morto, imports não utilizados e duplicação desnecessária **MUST NOT** ser
  mantidos no repositório.

**Justificativa**: um código simples e consistente reduz o custo de evolução e de revisão.

### VI. Segurança e Configuração

- Chaves privadas, tokens e credenciais **MUST NOT** ser expostos no frontend nem
  versionados no repositório.
- Configurações dependentes de ambiente **MUST** usar variáveis de ambiente; apenas valores
  públicos podem usar o prefixo exposto ao cliente.
- Entradas de formulários e dados processados **MUST** ser validados.
- Dados pessoais **MUST** ser coletados apenas com finalidade clara, na quantidade mínima
  necessária e com informação adequada ao titular, em conformidade com a LGPD.
- Dependências e integrações externas **MUST** ser avaliadas quanto à segurança, à
  manutenção ativa e à necessidade real antes de serem adicionadas.

**Justificativa**: mesmo um site sem backend próprio lida com dados de contato e
integrações de pagamento de terceiros.

### VII. Performance e SEO

- O site **MUST** priorizar carregamento rápido e bons Core Web Vitals.
- Server Components **SHOULD** ser o padrão; JavaScript no cliente **MUST** ser usado
  apenas quando necessário para interação.
- Imagens e fontes **MUST** ser otimizadas.
- Cada página **MUST** ter título, descrição e metadados próprios, estrutura semântica e
  URL clara.
- Sitemap e `robots.txt` **MUST** ser gerados quando houver páginas indexáveis.
- Dependências pesadas para efeitos puramente decorativos **MUST NOT** ser adicionadas.
- A usabilidade **MUST NOT** ser sacrificada em nome de pontuações artificiais.

**Justificativa**: velocidade e visibilidade em buscadores impactam diretamente a
descoberta e a conversão.

### VIII. Verificação Real

Uma funcionalidade **MUST NOT** ser considerada concluída, exceto quando:

- typecheck, lint e build de produção passarem sem erros;
- os testes relevantes passarem;
- o layout tiver sido revisado em larguras de celular, tablet e desktop, sem overflow
  horizontal inesperado;
- navegação, links e formulários funcionarem;
- acessibilidade básica e navegação por teclado tiverem sido verificadas;
- estados de carregamento, erro e sucesso, quando aplicáveis, tiverem sido verificados;
- o resultado final tiver sido revisado visualmente.

Testes automatizados **MUST** ser proporcionais à complexidade; fluxos críticos (por
exemplo, o caminho até o checkout) **SHOULD** ter testes end-to-end com Playwright.
Testes e verificações **MUST NOT** ser declarados como realizados sem execução real.

**Justificativa**: declarações de qualidade sem evidência geram regressões e falsa
segurança.

### IX. Fluxo Git e Integração Controlada

- O GitHub é a fonte oficial do código.
- A branch `main` **MUST** ser protegida e permanecer sempre funcional; funcionalidades
  **MUST NOT** ser desenvolvidas diretamente nela, e force push na `main` é proibido.
- Branches **MUST** ser criadas a partir da `main` atualizada, com os prefixos:
  `feature/<nome>` (funcionalidades), `fix/<nome>` (correções) e `chore/<nome>`
  (manutenção e configuração).
- Commits **MUST** ser descritivos e **SHOULD** seguir Conventional Commits; um commit
  **MUST NOT** misturar mudanças sem relação.
- Mudanças **MUST** ser integradas por Pull Request, com verificações automatizadas
  aprovadas e revisão sempre que possível.
- Mudanças pontuais **MUST** preservar funcionalidades já aprovadas.
- Alterações relevantes **MUST** ser documentadas.

**Justificativa**: um histórico limpo e uma `main` estável permitem evoluir e reverter com
segurança.

## Decisões Arquiteturais Iniciais e Escopo do MVP

As decisões desta seção são o ponto de partida aprovado para o MVP. Diferentemente dos
princípios, podem ser revistas por emenda quando houver necessidade documentada.

**Stack inicial**

- Next.js com App Router, React e TypeScript em modo `strict`.
- Tailwind CSS para estilos, alimentado pelos design tokens do Princípio II.
- shadcn/ui apenas para os componentes efetivamente necessários, adaptados à identidade.
- Lucide para ícones.
- Motion apenas quando houver justificativa de UX registrada no plano.
- Versões estáveis, compatíveis entre si e mantidas ativamente.
- Toda nova dependência **MUST** ter justificativa técnica registrada no plano; bibliotecas
  redundantes **MUST NOT** ser adicionadas.

**Limites do MVP**

- Banco de dados, autenticação e backend próprio **MUST NOT** ser implementados sem
  necessidade documentada e aprovada.
- Exceção aprovada: avaliações de compradores e feedback privado podem usar armazenamento
  mínimo e processamento no servidor, **SHOULD** preferir serviços gerenciados de baixo
  custo e pouca manutenção, e **MUST NOT** exigir criação de conta de cliente.
- A compra **MUST** ocorrer em checkout externo oficial (Kiwify ou Hotmart, a ser escolhido
  e validado). O site **MUST NOT** processar pagamentos diretamente na primeira versão.

**Escopo previsto do MVP**

- Página inicial institucional e comercial.
- Apresentação do Novera Planner Digital 2027.
- Demonstrações reais do produto.
- Benefícios e funcionalidades confirmadas.
- CTA para o checkout externo.
- FAQ e orientações básicas.
- Contato e suporte.
- Páginas legais aplicáveis.
- Avaliações públicas de compradores (com moderação) e canal de feedback privado.

**Fora do MVP** (cada item exige especificação própria antes de qualquer implementação):
área de clientes, catálogo ampliado, votação de novos produtos e blog.

## Fluxo de Desenvolvimento e Portões de Qualidade

- Todos os artefatos do Spec Kit (`spec.md`, `plan.md`, `tasks.md`, `research.md`,
  `data-model.md`, `quickstart.md`, contratos e checklists) **MUST** ser redigidos em
  português brasileiro. Identificadores de código, nomes de arquivos, comandos e termos
  técnicos consagrados podem permanecer em inglês.
- Toda especificação **MUST** delimitar o escopo em relação ao MVP e marcar como pendente
  qualquer informação de produto ainda não confirmada (Princípio IV).
- Todo plano **MUST** conter um Constitution Check cobrindo os princípios I–IX e registrar
  a justificativa de novas dependências e de qualquer exceção.
- Toda lista de tarefas **MUST** incluir as verificações do Princípio VIII.
- Toda revisão de Pull Request **MUST** confirmar a conformidade com esta Constitution.

## Governança

- Esta Constitution prevalece sobre decisões técnicas locais, preferências individuais e
  outros documentos do projeto.
- Toda especificação e implementação **MUST** demonstrar conformidade com seus princípios.
- Exceções **MUST** ser justificadas e documentadas no plano da funcionalidade (tabela de
  rastreamento de complexidade), indicando o princípio afetado e por que a alternativa
  conforme não atende.
- Decisões de produto não aprovadas **MUST NOT** ser introduzidas como requisitos
  definitivos.
- Emendas **MUST** ser versionadas e registrar: o princípio ou a seção alterada, a
  justificativa, o impacto sobre o projeto e os documentos dependentes que precisam ser
  atualizados (registrados no Sync Impact Report no topo deste arquivo).
- Versionamento semântico:
  - **MAJOR**: remoção ou redefinição incompatível de princípios ou da governança;
  - **MINOR**: novo princípio ou seção, ou ampliação material de orientação;
  - **PATCH**: esclarecimentos, redação e correções sem efeito semântico.

**Versão**: 1.1.0 | **Ratificada**: 2026-11-16 | **Última emenda**: 2026-11-16
