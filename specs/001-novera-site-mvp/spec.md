# Especificação da Funcionalidade: MVP do Site Oficial Novera

**Branch da funcionalidade**: `001-novera-site-mvp`

**Criada em**: 2026-11-16

**Status**: Rascunho

**Entrada**: Descrição do usuário: "Especificação funcional do MVP do site oficial da Novera —
presença da marca e principal canal de apresentação e venda do Novera Planner Digital 2027,
incluindo demonstração, detalhes do produto, FAQ, contato, informações legais, compra via
checkout externo, avaliações públicas de compradores e feedback privado."

**Referência normativa**: Constitution da Novera v1.1.0 (`.specify/memory/constitution.md`).

## Clarifications

### Session 2026-11-18

- Q: Como o comprador comprova a compra ao enviar uma avaliação, para receber o selo "compra verificada"? → A: O link para a página de avaliação é divulgado ao comprador (e-mail de entrega da plataforma de checkout ou dentro do PDF); o formulário pede o e-mail usado na compra, e a equipe Novera confere manualmente no painel da plataforma de checkout. Sem integração automática (webhook) no MVP.
- Q: Como a equipe Novera é avisada de novas avaliações e mensagens de feedback privado? → A: Cada envio é encaminhado somente por e-mail para a caixa de e-mail oficial da Novera, sem banco de dados ou armazenamento próprio (custo zero). A caixa de e-mail é o registro operacional; avaliações aprovadas são incluídas manualmente no conteúdo do site pela equipe.
- Q: Quais páginas separadas o site terá e o que fica como seção da página inicial? → A: Páginas: início (com seções de demonstração, benefícios, como funciona, avaliações quando existirem e compra), `/planner-2027` (detalhes), `/faq`, `/contato` (contato e feedback privado), `/avaliar` e páginas legais próprias.
- Q: Por quanto tempo os dados pessoais recebidos pelos formulários ficam guardados na caixa de e-mail da Novera? → A: 6 meses após a conclusão do atendimento ou da decisão de moderação; exclusão manual periódica pela equipe; o autor pode pedir exclusão antecipada pelo `/contato`.
- Q: A página `/avaliar` deve aparecer na navegação e nos buscadores, ou só ser acessada pelo link pós-compra? → A: Totalmente oculta: sem links no site, não indexada e fora do sitemap; acessível apenas pelo link divulgado após a compra. Comprador que perdeu o link solicita pelo `/contato`.

## Cenários de Usuário e Testes *(obrigatório)*

### História de Usuário 1 — Entender a marca e o Planner 2027 (Prioridade: P1)

Uma pessoa que nunca ouviu falar da Novera chega à página inicial (por busca, rede social ou
indicação). Em poucos segundos ela entende que a Novera cria produtos digitais para organizar
o dia a dia com simplicidade e elegância, e que o primeiro produto é o Novera Planner Digital
2027 — um planner em PDF interativo, datado de janeiro a dezembro de 2027, com navegação por
links internos e espaço para escrita manual, que **não** é um aplicativo independente. Ela
encontra os benefícios concretos e um resumo de como o produto é usado.

**Por que esta prioridade**: sem compreender a marca e o produto, nenhuma outra jornada
(compra, avaliação, suporte) tem valor. É o núcleo mínimo publicável.

**Teste independente**: publicar apenas a página inicial com apresentação da marca, do
produto, benefícios e "como funciona"; pedir a pessoas do público-alvo que expliquem com as
próprias palavras o que é a Novera e o que é o Planner 2027.

**Cenários de aceitação**:

1. **Dado** um visitante que não conhece a Novera, **Quando** ele abre a página inicial,
   **Então** a primeira área visível apresenta a marca Novera, sua proposta em uma frase curta
   e um CTA principal para conhecer o Planner 2027.
2. **Dado** um visitante na apresentação do Planner 2027, **Quando** ele lê as informações
   essenciais, **Então** encontra explicitamente: período (janeiro a dezembro de 2027), formato
   (PDF interativo), navegação por links internos, páginas diárias, semanais e mensais, áreas
   de prioridades, compromissos, tarefas, metas, finanças, organização e anotações, e espaço
   para escrita manual.
3. **Dado** um visitante iniciante, **Quando** ele lê a apresentação do produto, **Então**
   encontra uma frase explícita informando que o planner é um arquivo PDF usado dentro de um
   aplicativo de leitura/anotação de terceiros e não um aplicativo próprio.
4. **Dado** um visitante na seção de benefícios, **Quando** ele lê os textos, **Então** não
   encontra promessas de aumento garantido de produtividade, transformação de vida ou
   resultados mensuráveis não comprovados.
5. **Dado** um visitante na seção "Como funciona", **Quando** ele a lê, **Então** vê os quatro
   passos — comprar, receber e baixar o PDF, importar em um aplicativo compatível com PDF
   interativo e escrita manual, navegar e preencher — sem citar aplicativo ou dispositivo cuja
   compatibilidade não tenha sido testada.

---

### História de Usuário 2 — Acessar a compra com segurança (Prioridade: P1)

Um visitante convencido quer comprar. Ele encontra um CTA de compra claro e é levado ao
checkout externo oficial. Enquanto o checkout não estiver configurado, o site não o leva a
uma compra inexistente: mostra um estado honesto informando que as vendas ainda não estão
abertas.

**Por que esta prioridade**: é o objetivo comercial do site; também é onde o risco de
promessa enganosa (preço ou link fictício) é maior.

**Teste independente**: verificar o comportamento do CTA de compra em dois estados de
configuração — checkout configurado e não configurado — a partir de todas as páginas onde
ele aparece.

**Cenários de aceitação**:

1. **Dado** que o checkout externo está configurado, **Quando** o visitante aciona o CTA de
   compra, **Então** é direcionado à página oficial de checkout do Planner 2027, e o CTA
   indica claramente que a compra ocorre em plataforma externa.
2. **Dado** que o checkout não está configurado, **Quando** o visitante visualiza a área de
   compra, **Então** vê uma mensagem clara de que as vendas ainda não estão abertas, nenhum
   botão leva a destino inexistente e nenhum preço, desconto ou promoção é exibido.
3. **Dado** que o preço não foi aprovado, **Quando** qualquer página é exibida, **Então**
   nenhum valor monetário referente ao produto aparece.
4. **Dado** um visitante em qualquer página, **Quando** ele procura a compra, **Então**
   consegue chegar à área de compra (ou ao estado "vendas ainda não abertas") em no máximo
   duas interações.

---

### História de Usuário 3 — Ver o produto real antes de comprar (Prioridade: P2)

O visitante quer ver como o planner é de verdade: aparência das páginas, organização do
conteúdo, como os links levam de uma seção a outra e quanto espaço há para escrever. Ele
acessa a área de demonstração e vê imagens reais e, quando disponível, um vídeo do produto.

**Por que esta prioridade**: reduz a incerteza de compra, mas depende de materiais reais
que podem ainda não existir no lançamento.

**Teste independente**: publicar a área de demonstração com o conjunto de materiais
disponível (inclusive vazio) e conferir cada item contra o arquivo PDF real.

**Cenários de aceitação**:

1. **Dado** que existem imagens reais aprovadas, **Quando** o visitante acessa a
   demonstração, **Então** vê páginas reais do Planner 2027 que permitem identificar a
   aparência, a organização do conteúdo, a navegação entre seções e o espaço de escrita.
2. **Dado** que existe vídeo real aprovado, **Quando** o visitante o reproduz, **Então** o
   vídeo mostra o produto real, possui controles acessíveis e não inicia com som
   automaticamente.
3. **Dado** que os materiais finais ainda não estão disponíveis, **Quando** o visitante
   acessa a área de demonstração, **Então** vê um estado informando que as imagens do
   produto serão publicadas em breve, sem imagens ilustrativas que simulem o produto e sem
   afirmar que demonstrações já foram realizadas.
4. **Dado** qualquer imagem da demonstração, **Quando** ela é exibida, **Então** possui
   texto alternativo que descreve o conteúdo real mostrado.

---

### História de Usuário 4 — Conhecer os detalhes do produto (Prioridade: P2)

Um visitante mais criterioso quer detalhes: o que está incluído, formato do arquivo, como
funciona a navegação interna, orientações de uso e com quais aplicativos/dispositivos o
planner foi efetivamente testado. Ele acessa a página de detalhes do Planner 2027.

**Por que esta prioridade**: aprofunda a decisão de compra e reduz dúvidas de suporte, mas
a página inicial já cobre o essencial.

**Teste independente**: abrir a página de detalhes isoladamente e verificar que cada item
listado existe no arquivo real e que a seção de compatibilidade só lista combinações com
teste registrado.

**Cenários de aceitação**:

1. **Dado** um visitante na página de detalhes, **Quando** ele a percorre, **Então** encontra:
   descrição do produto, conteúdo incluído, exemplos visuais reais (ou o estado de materiais
   pendentes), formato do arquivo, explicação da navegação interna, orientações de uso,
   compatibilidade verificada e CTA de compra (ou estado de vendas não abertas).
2. **Dado** que nenhuma compatibilidade foi testada, **Quando** o visitante consulta a
   compatibilidade, **Então** vê os requisitos gerais (aplicativo que abra PDF com links
   internos e permita escrita/anotação) e a informação de que a lista de aplicativos testados
   será publicada após os testes — sem citar marcas como compatíveis.
3. **Dado** que um aplicativo/dispositivo foi testado, **Quando** ele aparece na lista de
   compatibilidade, **Então** a informação corresponde a um teste registrado.
4. **Dado** a página inicial e a página de detalhes, **Quando** comparadas, **Então** a página
   de detalhes aprofunda o conteúdo sem repetir blocos inteiros da página inicial.

---

### História de Usuário 5 — Tirar dúvidas, pedir suporte e enviar feedback privado (Prioridade: P2)

Um visitante ou cliente tem uma dúvida (o que é um planner em PDF, se precisa de aplicativo,
como escrever, como recebe o arquivo) ou um problema. Ele encontra o FAQ, e, se necessário,
um canal de contato/suporte. Um cliente também pode enviar, de forma privada, sugestões,
problemas encontrados, dúvidas ou solicitações de suporte, que chegam à equipe Novera sem
serem publicadas.

**Por que esta prioridade**: reduz atrito de compra e garante atendimento; é obrigação
básica de um comércio online.

**Teste independente**: navegar até o FAQ e o contato a partir de qualquer página; enviar
uma mensagem de feedback privado e verificar que ela chega à equipe e não aparece em
nenhuma área pública.

**Cenários de aceitação**:

1. **Dado** um visitante, **Quando** ele acessa o FAQ, **Então** encontra respostas para:
   o que é um planner digital em PDF; se precisa de aplicativo; como escrever no planner;
   como funcionam os links de navegação; se pode usar no celular ou tablet; como recebe o
   produto após a compra; se o planner funciona automaticamente; como solicitar suporte.
2. **Dado** a pergunta "O planner funciona automaticamente?", **Quando** o visitante lê a
   resposta, **Então** ela informa que o planner não possui automações, sincronização nem
   lembretes, e que o preenchimento é manual.
3. **Dado** a pergunta sobre celular/tablet, **Quando** o visitante lê a resposta, **Então**
   ela só afirma compatibilidade para combinações testadas e, sem testes, explica os
   requisitos gerais.
4. **Dado** um cliente que deseja enviar feedback privado, **Quando** ele escolhe o tipo
   (sugestão, problema, dúvida ou suporte), escreve a mensagem, informa um meio de resposta
   e envia, **Então** recebe confirmação de envio e a mensagem fica disponível apenas para a
   equipe Novera.
5. **Dado** uma mensagem de feedback privado, **Quando** qualquer página pública é exibida,
   **Então** a mensagem não aparece em nenhum lugar público.
6. **Dado** um visitante em qualquer página, **Quando** ele procura contato, política de
   privacidade, termos e informações comerciais, **Então** os encontra a partir do rodapé.
7. **Dado** que dados de contato, dados da empresa ou políticas ainda não foram definidos,
   **Quando** o site é preparado para publicação, **Então** esses itens aparecem como
   pendentes de configuração e o site não é publicado com dados inventados.

---

### História de Usuário 6 — Consultar avaliações reais de compradores (Prioridade: P3)

Um visitante quer saber o que outros compradores acharam. Quando existirem avaliações reais
aprovadas, ele vê uma seção com notas de 1 a 5 estrelas, comentários, nome público autorizado,
data e o selo de compra verificada — incluindo avaliações neutras e
negativas legítimas. Antes da primeira avaliação aprovada, a seção não aparece e o site
continua completo.

**Por que esta prioridade**: aumenta a confiança, mas no lançamento ainda não haverá
avaliações; o site precisa funcionar plenamente sem elas.

**Teste independente**: verificar a página com zero avaliações aprovadas (seção oculta,
sem indicadores) e com um conjunto de avaliações aprovadas que inclua nota baixa.

**Cenários de aceitação**:

1. **Dado** que não há avaliações aprovadas, **Quando** o visitante navega pelo site, **Então**
   não vê a seção pública de avaliações, estrelas vazias, nota média, contagem "0
   avaliações", comentários de exemplo ou qualquer indicador de clientes inexistentes, e
   nenhuma página apresenta lacuna visual no lugar da seção.
2. **Dado** que existem avaliações aprovadas, **Quando** o visitante acessa a seção, **Então**
   cada avaliação mostra nota (1 a 5), comentário, nome público autorizado e data.
3. **Dado** uma avaliação com compra efetivamente confirmada, **Quando** exibida, **Então**
   mostra o selo "compra verificada"; **Dado** uma avaliação cuja compra não foi
   confirmada, **Então** ela não é publicada.
4. **Dado** que existem avaliações aprovadas, **Quando** a nota média e a quantidade são
   exibidas, **Então** são calculadas exclusivamente a partir das avaliações reais
   aprovadas e publicadas.
5. **Dado** uma avaliação negativa legítima aprovada na moderação, **Quando** a seção é
   exibida, **Então** ela aparece com o mesmo tratamento das positivas.

---

### História de Usuário 7 — Enviar uma avaliação como comprador (Prioridade: P3)

Um comprador do Planner 2027 quer registrar sua opinião. Sem criar conta na Novera, ele
informa a nota, escreve o comentário, define o nome público, autoriza a publicação e envia.
A avaliação passa por verificação e moderação antes de qualquer publicação.

**Por que esta prioridade**: depende de haver compradores; pode entrar logo após o
lançamento sem bloquear a venda.

**Teste independente**: enviar avaliações de teste (positiva, negativa, com dado pessoal,
com spam) e verificar que nenhuma é publicada antes da moderação e que cada uma recebe o
destino correto.

**Cenários de aceitação**:

1. **Dado** um comprador, **Quando** ele acessa o fluxo de envio, **Então** pode avaliar sem
   criar conta na Novera.
2. **Dado** o formulário de avaliação, **Quando** o comprador o preenche, **Então** informa
   nota de 1 a 5, comentário escrito, nome público desejado, o e-mail usado na compra
   (para verificação, nunca publicado) e autorização explícita de publicação.
3. **Dado** um envio válido, **Quando** é concluído, **Então** o comprador recebe confirmação
   de que a avaliação será publicada somente após verificação e moderação.
4. **Dado** uma avaliação recém-enviada, **Quando** qualquer página pública é exibida,
   **Então** a avaliação não aparece até ser aprovada na moderação.
5. **Dado** uma avaliação com dados pessoais de terceiros, spam ou conteúdo abusivo, **Quando**
   moderada, **Então** não é publicada como enviada (é rejeitada ou publicada somente após
   remoção dos dados pessoais, com ciência do autor).
6. **Dado** uma avaliação sem autorização de publicação, **Quando** enviada, **Então** o
   envio não é aceito como avaliação pública e o comprador é orientado a usar o feedback
   privado se quiser apenas falar com a equipe.
7. **Dado** um erro de envio (campo obrigatório ausente, falha de comunicação), **Quando**
   ocorre, **Então** o comprador vê uma mensagem clara explicando o problema e como
   corrigi-lo, sem perder o texto já digitado.

---

### Casos de Borda

- **Checkout não configurado**: todos os CTAs de compra exibem o estado "vendas ainda não
  abertas"; nenhum aponta para destino vazio, fictício ou de teste.
- **Checkout configurado, mas plataforma externa fora do ar**: o site não tem controle sobre
  a plataforma; o CTA continua apontando para o endereço oficial e o FAQ/contato orienta o
  visitante caso não consiga concluir a compra.
- **Materiais de demonstração ausentes ou parciais**: a área de demonstração mostra apenas
  os materiais reais existentes e um estado informativo para o restante.
- **Vídeo indisponível ou bloqueado**: o conteúdo essencial permanece compreensível pelas
  imagens e textos; o vídeo nunca é o único meio de transmitir uma informação.
- **Preferência por movimento reduzido**: animações não essenciais são desativadas sem
  perda de informação.
- **Zero avaliações aprovadas**: seção pública oculta, sem indicadores numéricos.
- **Uma única avaliação aprovada**: exibida normalmente; nota média e contagem, se exibidas,
  refletem exatamente esse único dado.
- **Mesma pessoa envia várias avaliações**: no máximo uma avaliação pública por compra; envios
  repetidos são tratados na moderação.
- **Avaliação com dados pessoais (telefone, e-mail, endereço)**: não é publicada com esses
  dados.
- **Compra não confirmada**: a avaliação não é publicada; o autor é informado e orientado a
  entrar em contato caso tenha comprado.
- **Avaliação negativa legítima**: publicada; não pode ser removida por ser negativa.
- **Autor pede remoção da própria avaliação**: a avaliação é retirada da exibição pública
  após confirmação de autoria.
- **Envio massivo/automatizado (spam)**: o fluxo possui proteção contra envios automatizados
  que não impõe obstáculos desproporcionais a pessoas reais.
- **Comprador perdeu o link de avaliação**: solicita pelo canal de contato e a equipe
  reenvia o endereço; o site não exibe o link publicamente.
- **Falha no encaminhamento por e-mail**: o envio não é confirmado; o remetente vê mensagem
  de erro clara com a opção de tentar novamente, sem perder o texto digitado.
- **Feedback privado contendo elogio**: não é convertido em avaliação pública sem
  consentimento explícito do autor.
- **Dados de empresa, contato ou políticas não definidos**: itens marcados como pendentes;
  bloqueiam a publicação oficial até serem preenchidos (ver Pendências).
- **Texto provisório**: identificado como provisório no conteúdo de trabalho e não pode ir
  para publicação oficial.
- **Telas muito estreitas (320 px) ou muito largas**: nenhum conteúdo importante cortado,
  sem rolagem horizontal, leitura sem zoom obrigatório.
- **Link para página inexistente**: o visitante vê uma página de "não encontrado" na
  identidade Novera, com caminho de volta para a página inicial.

## Requisitos *(obrigatório)*

### Requisitos Funcionais — MVP obrigatório

**Página inicial e marca**

- **FR-001**: O site MUST ter uma página inicial que apresente, na primeira área visível, a
  marca Novera, sua proposta em uma frase curta ("produtos digitais para organizar o dia a
  dia com simplicidade e elegância", ou redação aprovada equivalente) e um CTA principal
  para conhecer o Planner 2027.
- **FR-002**: A página inicial MUST seguir a jornada: apresentação da marca → apresentação do
  Planner 2027 → demonstração → benefícios → como funciona → compra, com acesso a FAQ e
  avaliações (quando existirem).
- **FR-003**: A apresentação visual principal MUST usar o produto real ou elementos da
  identidade Novera; MUST NOT usar imagens genéricas sem relação com o produto.

**Planner Digital 2027**

- **FR-004**: O site MUST informar que o Planner 2027 é datado de janeiro a dezembro de 2027,
  em formato PDF interativo, com navegação por links internos, páginas diárias, semanais e
  mensais, áreas de prioridades, compromissos, tarefas, metas, finanças, organização e
  anotações, e espaço para escrita manual.
- **FR-005**: O site MUST declarar explicitamente que o produto é um arquivo PDF e não um
  aplicativo, e que não possui sincronização, lembretes ou automações.
- **FR-006**: Toda funcionalidade anunciada MUST corresponder ao arquivo real do produto;
  qualquer item não confirmado MUST ficar fora do conteúdo publicado.
- **FR-007**: A seção de benefícios MUST apresentar apenas benefícios concretos
  (organização em páginas específicas, facilidade de navegação, amplo espaço de escrita,
  planejamento de diferentes períodos, estética discreta e funcional) e MUST NOT prometer
  resultados garantidos.
- **FR-008**: A seção "Como funciona" MUST apresentar os quatro passos (comprar; receber e
  baixar o PDF; importar em aplicativo compatível; navegar e preencher).

**Demonstração**

- **FR-009**: O site MUST ter uma área de demonstração que exiba exclusivamente imagens e
  vídeos reais do Planner 2027.
- **FR-010**: Na ausência de materiais reais aprovados, a área de demonstração MUST exibir
  um estado informativo, sem imagens simuladas e sem alegar demonstrações realizadas.
- **FR-011**: Vídeos MUST ter controles acessíveis, MUST NOT iniciar com som automaticamente
  e MUST NOT ser o único meio de transmitir informação essencial.

**Detalhes do produto**

- **FR-012**: O site MUST ter uma página de detalhes do Planner 2027 com descrição, conteúdo
  incluído, exemplos visuais reais, formato do arquivo, explicação da navegação interna,
  orientações de uso, compatibilidade verificada e CTA de compra.
- **FR-013**: A compatibilidade MUST listar apenas aplicativos/dispositivos com teste
  registrado; sem testes, MUST apresentar somente os requisitos gerais de uso.
- **FR-014**: A estrutura de apresentação de produto MUST permitir incluir outros produtos
  futuros com a mesma identidade, sem reformulação da marca. A listagem de vários produtos
  MUST NOT ser implementada no MVP.

**Compra**

- **FR-015**: O site MUST oferecer CTA de compra com destaque e linguagem clara, levando ao
  checkout externo oficial quando configurado e indicando que a compra ocorre em plataforma
  externa.
- **FR-016**: O site MUST NOT processar pagamentos nem implementar checkout próprio.
- **FR-017**: Enquanto o checkout não estiver configurado, todo CTA de compra MUST exibir o
  estado "vendas ainda não abertas" e MUST NOT direcionar a destino inexistente.
- **FR-018**: O site MUST NOT exibir preço, desconto, promoção, escassez ou contador sem
  aprovação comercial registrada.

**FAQ, contato e informações legais**

- **FR-019**: O site MUST ter um FAQ com respostas às oito perguntas listadas na História 5,
  sem apresentar compatibilidade não testada como fato.
- **FR-020**: O site MUST disponibilizar um meio de contato e suporte acessível a partir de
  todas as páginas.
- **FR-021**: O site MUST disponibilizar política de privacidade, termos e condições e
  informações comerciais relevantes para a compra, acessíveis a partir de todas as páginas.
- **FR-022**: Dados de contato, dados da empresa e textos legais não definidos MUST ser
  sinalizados como pendentes de configuração e MUST bloquear a publicação oficial até seu
  preenchimento.
- **FR-023**: Todo formulário que colete dados pessoais MUST informar a finalidade da coleta
  e o vínculo com a política de privacidade, coletando apenas os dados necessários.

**Feedback privado**

- **FR-024**: O site MUST oferecer um canal de feedback privado, separado das avaliações, com
  os tipos: sugestão de melhoria, problema encontrado, dúvida sobre o produto e solicitação
  de suporte.
- **FR-025**: O feedback privado MUST exigir tipo, mensagem e um meio de resposta, e MUST
  confirmar o envio ao remetente.
- **FR-026**: Mensagens de feedback privado MUST ficar acessíveis somente à equipe Novera e
  MUST NOT ser publicadas, nem convertidas em avaliação pública, sem consentimento explícito
  do autor.

**Avaliações públicas**

- **FR-027**: O site MUST oferecer um fluxo de envio de avaliação que não exija criação de
  conta, com: nota de 1 a 5 (obrigatória), comentário escrito (obrigatório), nome público
  (obrigatório, escolhido pelo autor), e-mail usado na compra (obrigatório, usado para
  verificação e resposta, nunca publicado) e autorização explícita de publicação
  (obrigatória).
- **FR-028**: Nenhuma avaliação MUST ser publicada antes de passar por moderação contra spam,
  dados pessoais e conteúdo abusivo.
- **FR-029**: A moderação MUST NOT rejeitar ou ocultar uma avaliação legítima por ser neutra
  ou negativa; os motivos de rejeição permitidos são: spam, conteúdo abusivo, dados pessoais
  não removíveis, conteúdo sem relação com o produto, ausência de autorização ou compra
  não confirmada.
- **FR-030**: Somente avaliações com compra efetivamente confirmada MUST ser publicadas;
  toda avaliação publicada MUST exibir o selo "compra verificada". A confirmação MUST ser
  feita pela equipe Novera, manualmente, conferindo o e-mail informado contra os registros de
  venda no painel da plataforma de checkout; integração automática com a plataforma MUST NOT
  ser implementada no MVP. Avaliações cuja compra não puder ser confirmada MUST NOT ser
  publicadas, e o autor MUST ser informado e orientado a usar o contato caso tenha comprado.
- **FR-030a**: O endereço da página de envio de avaliação MUST ser divulgado ao comprador
  após a compra (no e-mail de entrega da plataforma de checkout ou dentro do PDF do
  produto). A página MUST NOT exigir código individual, e a divulgação do endereço não
  dispensa a verificação de compra do FR-030. A página de envio de avaliação MUST NOT ter
  link em nenhuma página do site (navegação, rodapé, seção de avaliações ou contato), MUST
  ser marcada para não indexação em buscadores e MUST ficar fora do sitemap. O comprador
  que perdeu o link MUST poder solicitá-lo pelo canal de contato.
- **FR-031**: Cada avaliação publicada MUST exibir nota, comentário, nome público autorizado,
  data da avaliação e o selo de compra verificada.
- **FR-032**: Nota média e quantidade de avaliações MUST ser calculadas somente a partir das
  avaliações aprovadas e publicadas, e MUST NOT ser exibidas quando não houver avaliação
  publicada.
- **FR-033**: Sem avaliações aprovadas, a seção pública de avaliações MUST ficar oculta, sem
  estrelas vazias, contagens, exemplos ou espaços vazios na página.
- **FR-034**: O site MUST NOT exibir avaliações, depoimentos, métricas ou selos de confiança
  artificiais ou não comprovados.
- **FR-035**: O autor MUST poder solicitar a remoção da própria avaliação pelo canal de
  contato, e a avaliação MUST ser retirada da exibição pública após confirmação de autoria.
- **FR-036**: O envio de avaliações e de feedback privado MUST ter proteção contra envios
  automatizados que não exija conta e não impeça o uso por teclado ou leitores de tela.
- **FR-036a**: Cada avaliação e cada mensagem de feedback privado enviadas MUST ser
  encaminhadas por e-mail à caixa oficial da Novera, identificando o tipo de envio
  (avaliação ou feedback, e o tipo de feedback) e todos os campos preenchidos. O MVP MUST NOT
  usar banco de dados ou armazenamento próprio para esses envios; a caixa de e-mail é o
  registro operacional.
- **FR-036b**: A confirmação de envio ao remetente MUST ser exibida somente depois que o
  encaminhamento por e-mail for aceito; se o encaminhamento falhar, o remetente MUST ver uma
  mensagem de erro clara, sem perder o texto digitado.
- **FR-036c**: Os e-mails de avaliação e de feedback privado MUST ser excluídos
  manualmente pela equipe Novera em até 6 meses após a conclusão do atendimento ou da decisão
  de moderação; o autor MUST poder pedir exclusão antecipada pelo `/contato`. Para
  avaliações publicadas, nome público, nota, comentário e data permanecem no site enquanto
  publicados; o e-mail do autor segue o mesmo prazo. Esse prazo MUST constar na política de
  privacidade e no aviso dos formulários (FR-023).
- **FR-036d**: Avaliações aprovadas na moderação MUST ser publicadas pela inclusão manual,
  pela equipe Novera, no conteúdo do site; a remoção (FR-035) segue o mesmo processo
  manual.

**Navegação, responsividade e acessibilidade**

- **FR-036e**: O site MUST ter exatamente estas páginas no MVP: página inicial (`/`), com
  seções de apresentação da marca, apresentação do Planner 2027, demonstração, benefícios,
  como funciona, avaliações (somente quando houver avaliação publicada) e compra; detalhes
  do produto (`/planner-2027`); FAQ (`/faq`); contato e feedback privado (`/contato`);
  envio de avaliação (`/avaliar`, oculta conforme FR-030a); e uma página própria para cada texto legal (política de
  privacidade, termos e condições, informações comerciais), com endereços legíveis em
  português. A demonstração MUST NOT ter página própria no MVP.
- **FR-037**: A navegação principal MUST ser enxuta e permitir, a partir de qualquer página:
  voltar à página inicial, conhecer o produto, acessar demonstrações, encontrar o FAQ,
  localizar contato/suporte e chegar à compra.
- **FR-038**: A navegação em telas pequenas MUST ser operável por toque e teclado, com
  rótulos compreensíveis e estado aberto/fechado anunciado a tecnologias assistivas.
- **FR-039**: Todas as páginas MUST ser utilizáveis de 320 px de largura até telas desktop
  largas, sem rolagem horizontal, sem conteúdo importante cortado e legíveis sem zoom
  obrigatório.
- **FR-040**: Todas as páginas MUST atender WCAG 2.2 nível AA, incluindo navegação completa por
  teclado, foco visível, contraste adequado, textos alternativos relevantes e controles com
  rótulos compreensíveis.
- **FR-041**: Nenhuma informação MUST depender exclusivamente de animação; animações não
  essenciais MUST ser desativadas quando o visitante preferir movimento reduzido.
- **FR-042**: O site MUST NOT exibir pop-ups invasivos ou elementos que bloqueiem a leitura.
- **FR-043**: O site MUST exibir uma página "não encontrado" na identidade Novera com caminho
  de volta à página inicial.
- **FR-044**: Nenhum link ou botão MUST levar a página fictícia, vazia ou quebrada.

**Conteúdo, identidade e busca**

- **FR-045**: Todo conteúdo MUST estar em português brasileiro, com tom próximo, claro,
  profissional e objetivo.
- **FR-046**: Textos provisórios MUST ser identificáveis como tal no conteúdo de trabalho e
  MUST NOT ser publicados oficialmente.
- **FR-047**: O visual MUST seguir a identidade Dark Minimal Premium da Constitution (paleta,
  tipografia refinada, hierarquia clara, espaço negativo equilibrado) e MUST NOT usar hero com
  efeitos exagerados, gradientes chamativos, cards repetitivos de preenchimento, ícones
  decorativos em excesso ou seções redundantes.
- **FR-048**: Cada página MUST ter título e descrição próprios para buscadores e
  compartilhamento, e endereço legível em português. Todas as páginas MUST ser indexáveis e
  constar do sitemap, exceto a página de envio de avaliação (FR-030a).

### Fora do Escopo do MVP (funcionalidades futuras)

Dependem de especificações próprias e MUST NOT ser implementadas nesta funcionalidade:
área do cliente; login e autenticação; sistema de pagamento próprio; blog; programa de
indicação; votação de novos produtos; biblioteca/catálogo completo de produtos; dashboard
administrativo; lista de espera ou cadastro para aviso de lançamento.

### Entidades-Chave

- **Produto**: item digital da Novera. Atributos: nome, descrição, período coberto, formato,
  conteúdo incluído, funcionalidades confirmadas, orientações de uso, status de venda
  (vendas abertas / não abertas), endereço oficial de checkout (quando houver), preço
  (somente quando aprovado).
- **Material de demonstração**: imagem ou vídeo real de um produto. Atributos: tipo,
  descrição (texto alternativo/legenda), seção do produto mostrada, status de aprovação.
- **Registro de compatibilidade**: combinação aplicativo/dispositivo testada. Atributos:
  aplicativo, sistema/dispositivo, recursos verificados (links internos, escrita), resultado,
  data do teste.
- **Pergunta frequente**: pergunta, resposta, status de aprovação.
- **Página legal/informação comercial**: tipo (privacidade, termos, informações comerciais),
  conteúdo, status (pendente/aprovado), data de vigência.
- **Avaliação**: produto avaliado, nota (1–5), comentário, nome público, e-mail usado na
  compra (privado; chave da verificação manual), autorização de publicação, data de envio, status de verificação de
  compra, status de moderação (pendente/aprovada/rejeitada/removida), motivo da decisão,
  data de publicação.
- **Feedback privado**: tipo (sugestão/problema/dúvida/suporte), mensagem, meio de resposta,
  data, status de atendimento. Nunca público.

## Critérios de Sucesso *(obrigatório)*

### Resultados Mensuráveis

- **SC-001**: Em teste com pelo menos 5 pessoas do público-alvo que não conhecem a Novera,
  pelo menos 4 descrevem corretamente a proposta da marca após até 30 segundos na página
  inicial.
- **SC-002**: No mesmo teste, pelo menos 90% dos participantes identificam que o Planner 2027
  é um PDF interativo e não um aplicativo.
- **SC-003**: 100% das funcionalidades e características anunciadas são rastreáveis ao
  arquivo real do produto em revisão de conteúdo antes da publicação.
- **SC-004**: A partir de qualquer página, o visitante chega à área de compra (ou ao estado
  "vendas ainda não abertas"), ao FAQ, ao contato e às informações legais em no máximo duas
  interações.
- **SC-005**: Uma verificação completa de links do site encontra 0 links quebrados e 0
  destinos fictícios, nos estados de checkout configurado e não configurado.
- **SC-006**: 100% das páginas são exibidas sem rolagem horizontal e sem conteúdo cortado nas
  larguras de 320 px, 768 px e 1440 px.
- **SC-007**: 100% das funções do site (navegação, CTAs, FAQ, formulários, vídeo) são
  operáveis somente com teclado, com foco sempre visível, e a auditoria de acessibilidade não
  aponta violações WCAG 2.2 AA críticas.
- **SC-008**: Com movimento reduzido ativado ou animações desativadas, 100% das informações
  continuam disponíveis.
- **SC-009**: Um comprador conclui o envio de uma avaliação em até 3 minutos e um cliente
  conclui o envio de feedback privado em até 2 minutos.
- **SC-010**: 0 avaliações publicadas sem moderação; 0 mensagens de feedback privado
  exibidas publicamente; 0 indicadores de avaliação (média, contagem, estrelas) exibidos sem
  avaliação real publicada.
- **SC-011**: O conteúdo principal de cada página fica visível em até 2,5 segundos em uma
  conexão móvel típica.
- **SC-012**: Em revisão de design, um segundo produto fictício de teste (não publicado) pode
  ser apresentado usando a mesma identidade e estrutura apenas com novo conteúdo, sem criar
  novos padrões visuais.
- **SC-013**: Nas primeiras 4 semanas após a abertura das vendas, menos de 20% das mensagens
  de suporte tratam de dúvidas já respondidas no FAQ ou na página de detalhes.

## Premissas

- O público-alvo acessa o site majoritariamente pelo celular; a experiência é pensada
  primeiro para telas pequenas.
- O arquivo final do Planner 2027 existe ou existirá antes da publicação oficial; o conteúdo
  do site será conferido contra ele.
- A entrega do PDF após a compra é feita pela plataforma de checkout externa; o site apenas
  explica o processo.
- A moderação de avaliações e o atendimento de feedback privado são feitos manualmente pela
  equipe Novera a partir da caixa de e-mail oficial (FR-036a), sem dashboard administrativo
  no MVP.
- A verificação de compra é manual (FR-030). Não há armazenamento próprio de envios no MVP
  (FR-036a); a exceção de armazenamento prevista na Constitution v1.1.0 não é usada nesta
  versão. O serviço de envio de e-mail e a proteção contra spam serão definidos no
  planejamento técnico, priorizando opções sem custo.
- O nome público da avaliação é escolhido pelo autor (pode ser nome, primeiro nome com
  inicial ou apelido); o e-mail informado nunca é publicado.
- O comentário da avaliação tem tamanho mínimo e máximo razoáveis, a definir no plano, para
  evitar envios vazios ou excessivos.
- A data exibida na avaliação é a data de envio.
- Há um único produto à venda no MVP; o site não terá catálogo.
- Política de privacidade e termos serão redigidos/validados pela Novera (com apoio jurídico,
  se necessário); a especificação não define o texto jurídico.

## Pendências de Decisão

Decisões comerciais ainda não tomadas. Nenhuma pode ser inventada; cada uma deve ser
registrada antes da publicação oficial.

| # | Pendência | Impacto | Bloqueia publicação? |
|---|-----------|---------|----------------------|
| P-01 | Plataforma de checkout (Kiwify, Hotmart ou outra) | CTA de compra, entrega, verificação de compra | Bloqueia abertura de vendas |
| P-02 | Endereço oficial de checkout | CTA de compra | Bloqueia abertura de vendas |
| P-03 | Preço e eventuais condições comerciais | Área de compra | Bloqueia abertura de vendas |
| P-04 | Dados da empresa (razão social, CNPJ ou equivalente) | Informações comerciais | Sim |
| P-05 | Canais de contato e suporte (e-mail, prazo de resposta) | Contato, FAQ | Sim |
| P-06 | Política de privacidade e termos e condições | Páginas legais, formulários | Sim |
| P-07 | Política de reembolso/arrependimento | Informações comerciais, FAQ | Sim |
| P-08 | Aplicativos/dispositivos efetivamente testados | Compatibilidade, FAQ | Não (usa requisitos gerais) |
| P-09 | Imagens e vídeo reais do produto | Demonstração, detalhes | Não (usa estado informativo) |
| P-10 | Redação final aprovada dos textos comerciais | Todo o site | Sim |
| G-01 | Domínio do site e do e-mail (identificado no planejamento técnico) | Resend (domínio verificado), Turnstile (hostname), URL canônica, SEO | Sim |
| G-03 | Confirmação dos termos de uso comercial no plano gratuito da hospedagem | Legalidade da hospedagem (research R-03a) | Sim |
