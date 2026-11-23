# Contrato: Variáveis de Ambiente

**Funcionalidade**: `001-novera-site-mvp` | Referência: Constitution VI

Todas as variáveis são validadas na inicialização por um schema Zod em `src/config/env.ts`.
Só as variáveis com o prefixo `NEXT_PUBLIC_` chegam ao navegador. O arquivo `.env.example`
(versionado) lista todas **sem valores reais**; `.env*.local` fica no `.gitignore`. Os
segredos de produção ficam **só** nas configurações da hospedagem (secrets do Worker) e no
GitHub Actions (secrets do repositório, apenas o token de deploy).

| Variável | Pública? | Obrigatória em produção oficial | Descrição |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | sim | sim | URL canônica (`https://<domínio>`); usada em metadados e sitemap (G-01) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | sim | sim | chave pública do widget |
| `NEXT_PUBLIC_SALES_OVERRIDE` | sim | não | `nao-abertas` força o estado sem vendas |
| `TURNSTILE_SECRET_KEY` | **não** | sim | verificação no servidor |
| `MAIL_TRANSPORT` | não | sim (`smtp` ou `resend`) | `smtp` \| `resend` \| `fake` (`fake` bloqueia a publicação) |
| `MAIL_FROM` | não | sim | remetente: qualquer endereço (`email@x` ou `Nome <email@x>`), sem domínio fixo |
| `SMTP_HOST` | não | com `smtp` | servidor SMTP de qualquer provedor (ex.: `smtp.gmail.com`) |
| `SMTP_PORT` | não | não (padrão 465) | 465 = TLS direto; 587 = STARTTLS; a 25 não funciona no Workers |
| `SMTP_SECURE` | não | não | `true`/`false` força TLS direto ou STARTTLS (padrão: `true` só na 465) |
| `SMTP_USER` | **não** | com `smtp` | usuário da caixa remetente |
| `SMTP_PASSWORD` | **não** | com `smtp` | senha (no Gmail, "senha de app") |
| `RESEND_API_KEY` | **não** | com `resend` | chave da API do Resend (exige domínio verificado) |
| `NOVERA_INBOX_EMAIL` | **não** | sim | caixa que recebe os envios (G-02); não exposta no HTML |
| `FORM_SIGNING_SECRET` | **não** | sim | HMAC do token de formulário (≥ 32 bytes aleatórios) |
| `NOVERA_PUBLICACAO_OFICIAL` | não | — | `true` ativa a guarda de publicação (falha o build com pendências) |

Os valores de teste do Turnstile (chaves oficiais "sempre aprova" e "sempre reprova") são
usados no CI e no desenvolvimento local.

## Segredos de CI (GitHub Actions)

| Segredo | Uso |
|---|---|
| `CLOUDFLARE_API_TOKEN` | deploy (escopo mínimo: Workers Scripts:Edit na conta Novera) |
| `CLOUDFLARE_ACCOUNT_ID` | deploy |

O CI de PR **não** recebe segredos de produção; os testes usam `MAIL_TRANSPORT=fake` e as
chaves de teste do Turnstile.
