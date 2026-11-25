# Contrato: Envio de Formulários (Server Actions)

**Funcionalidade**: `001-novera-site-mvp` | Referências: FR-023 a FR-030a, FR-036 a FR-036b; [data-model.md §2](../data-model.md)

Duas Server Actions, em `src/features/envios/actions.ts`:

| Ação | Usada em | Entrada | Saída |
|---|---|---|---|
| `submitReview(prev, formData)` | `/avaliar` | `ReviewSubmission` (multipart/form-data) | `SubmissionResult` |
| `submitFeedback(prev, formData)` | `/contato` | `FeedbackSubmission` | `SubmissionResult` |

Os dois formulários usam `<form action={...}>` com `useActionState`. Funcionam **sem
JavaScript** (aprimoramento progressivo); com JavaScript, o resultado aparece sem recarregar a
página.

## Sequência de processamento (igual nas duas ações)

1. **Honeypot**: se `website` estiver preenchido → retorna `{ status: 'success' }` **sem
   enviar** nada (não informa o robô).
2. **Token de formulário**: valida o HMAC e o tempo desde a renderização (≥ 3 s, ≤ 2 h). Se
   falhar → `error/verificacao`.
3. **Turnstile**: `POST https://challenges.cloudflare.com/turnstile/v0/siteverify` com
   `TURNSTILE_SECRET_KEY`, o token e o IP (`CF-Connecting-IP`), com tempo limite de 5 s. Se
   falhar ou demorar demais → `error/verificacao`.
4. **Validação Zod** (servidor, fonte da verdade). Se falhar → `invalid` com `fieldErrors` e
   `values`.
5. **Normalização**: `trim`, colapso de espaços, remoção de caracteres de controle. O texto é
   tratado **sempre como texto puro** (escapado no e-mail; nunca interpretado como HTML).
6. **Encaminhamento por e-mail** via a interface `MailTransport` (Resend em produção, falso em
   testes; ver [encaminhamento-email.md](./encaminhamento-email.md)), com tempo limite de 8 s.
   - Aceito → `{ status: 'success' }`.
   - Rejeitado por cota → `error/limite` ("Recebemos muitos envios hoje. Tente novamente
     amanhã ou escreva para <e-mail de suporte>.").
   - Outro erro → `error/envio` ("Não foi possível enviar agora. Seu texto foi mantido; tente
     de novo em alguns minutos.").
7. **Registro (observabilidade)**: `console.info` estruturado só com `{ action, outcome,
   reason?, durationMs }`. **Nunca** registrar e-mail, nome ou texto (LGPD).

## Mensagens de sucesso (texto aprovado pendente, P-10)

- Avaliação: "Obrigado! Sua avaliação foi recebida e será publicada somente depois que
  confirmarmos a compra e fizermos a moderação."
- Feedback: "Mensagem enviada. Responderemos no e-mail informado." (+ prazo de resposta,
  quando aprovado em P-05).

## Requisitos de interface do formulário (acessibilidade)

- Aviso de privacidade (FR-023) **acima** do botão de envio: finalidade, dados coletados,
  prazo de 6 meses, link para `/privacidade`.
- Erros: resumo no topo com `role="alert"` e links para cada campo + mensagem junto ao campo
  (`aria-describedby`); o foco vai para o resumo após o envio inválido.
- Sucesso: a mensagem substitui o formulário e recebe foco (`tabIndex=-1`); um link
  "Voltar ao início".
- Botão em estado de carregamento ("Enviando…", `aria-busy`, desativado contra duplo clique).
- O widget Turnstile fica dentro do formulário, com rótulo; se falhar ao carregar, mostra uma
  instrução textual e o e-mail de contato como alternativa.
