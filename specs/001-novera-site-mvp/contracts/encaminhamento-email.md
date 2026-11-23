# Contrato: E-mail de Encaminhamento para a Equipe Novera

**Funcionalidade**: `001-novera-site-mvp` | Referências: FR-036a, FR-036c, FR-030

## Interface interna

```text
MailTransport.send({ to, from, replyTo, subject, text }) → { ok: true } | { ok: false, kind: 'quota' | 'other' }
```

Implementações: `ResendTransport` (produção, `RESEND_API_KEY`) e `FakeTransport` (testes e
desenvolvimento; grava em memória ou imprime no console). A seleção é feita por
`MAIL_TRANSPORT=resend|fake`. Em produção, `fake` **falha o build** pela guarda de
publicação.

## Envelope

| Campo | Valor |
|---|---|
| `from` | `Site Novera <no-reply@<DOMÍNIO>>` (`MAIL_FROM`) |
| `to` | `NOVERA_INBOX_EMAIL` |
| `replyTo` | e-mail informado pela pessoa (`purchaseEmail` ou `replyEmail`) |
| Formato | **texto puro** (sem HTML, sem rastreamento de abertura ou clique) |

## Assuntos (filtráveis)

- Avaliação: `[Novera][Avaliação] Nota {1-5} — {publicName}`
- Feedback: `[Novera][Feedback][{Sugestão|Problema|Dúvida|Suporte}] {primeiros 50 caracteres da mensagem}`

## Corpo: avaliação

```text
Nova avaliação recebida pelo site (NÃO publicada).

Produto: Novera Planner Digital 2027
Nota: 4 de 5
Nome público desejado: …
E-mail usado na compra (verificar no painel do checkout): …
Autorização de publicação: sim
Data de envio: 2026-11-18 14:32 (horário de Brasília)

Comentário:
…

---
Próximos passos:
1. Confirmar a compra pelo e-mail no painel da plataforma de checkout.
2. Moderar (spam, abuso, dados pessoais, relação com o produto). Nota baixa NÃO é motivo de rejeição.
3. Se aprovada, adicionar em src/content/avaliacoes.ts via Pull Request (sem o e-mail).
Excluir este e-mail até 6 meses após a decisão (política de privacidade).
```

## Corpo: feedback

```text
Nova mensagem de feedback privado (NUNCA publicar sem consentimento explícito do autor).

Tipo: Problema encontrado
Nome (opcional): …
E-mail para resposta: …
Data de envio: …

Mensagem:
…

---
Responda usando "Responder" (vai para o e-mail da pessoa).
Excluir este e-mail até 6 meses após a conclusão do atendimento.
```
