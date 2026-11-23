/**
 * Schemas dos formulários (data-model §2, research R-09). Fonte única dos limites e das
 * mensagens: o servidor valida com eles; o cliente usa os mesmos limites nos campos.
 */
import { z } from "zod";
import { contemDadoDeContato } from "@/content/schemas";

export const LIMITES = {
  comment: { min: 20, max: 1500 },
  publicName: { min: 2, max: 60 },
  email: { max: 254 },
  message: { min: 10, max: 3000 },
  name: { max: 60 },
} as const;

/** Checkbox HTML: "on" quando marcado, ausente quando não. */
const checkbox = z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean());

const texto = z.preprocess((v) => (typeof v === "string" ? v.trim() : ""), z.string());

const email = (mensagem: string) =>
  z.preprocess(
    (v) => (typeof v === "string" ? v.trim() : ""),
    z.string().max(LIMITES.email.max, mensagem).pipe(z.email(mensagem)),
  );

export const FEEDBACK_TIPOS = {
  sugestao: { curto: "Sugestão", longo: "Sugestão de melhoria" },
  problema: { curto: "Problema", longo: "Problema encontrado" },
  duvida: { curto: "Dúvida", longo: "Dúvida sobre o produto" },
  suporte: { curto: "Suporte", longo: "Solicitação de suporte" },
} as const;

export type FeedbackTipo = keyof typeof FEEDBACK_TIPOS;

const PRIVACIDADE = "Confirme que leu o aviso de privacidade.";

export const feedbackSchema = z.object({
  type: z.enum(["sugestao", "problema", "duvida", "suporte"], {
    error: "Escolha o tipo de mensagem.",
  }),
  message: texto.pipe(
    z
      .string()
      .min(LIMITES.message.min, `Escreva pelo menos ${LIMITES.message.min} caracteres.`)
      .max(LIMITES.message.max, `A mensagem pode ter no máximo ${LIMITES.message.max} caracteres.`),
  ),
  replyEmail: email("Informe um e-mail para resposta no formato nome@exemplo.com."),
  name: texto.pipe(
    z.string().max(LIMITES.name.max, `O nome pode ter no máximo ${LIMITES.name.max} caracteres.`),
  ),
  privacyAck: checkbox.pipe(z.literal(true, { error: PRIVACIDADE })),
});

export type FeedbackData = z.infer<typeof feedbackSchema>;

export const MENSAGEM_SEM_AUTORIZACAO =
  "Para publicar, autorize a publicação. Se quiser só falar com a equipe, use a página de contato.";

export const reviewSchema = z.object({
  rating: z.preprocess(
    (v) => (typeof v === "string" && v !== "" ? Number(v) : undefined),
    z
      .number({ error: "Escolha uma nota de 1 a 5 estrelas." })
      .int("Escolha uma nota de 1 a 5 estrelas.")
      .min(1, "Escolha uma nota de 1 a 5 estrelas.")
      .max(5, "Escolha uma nota de 1 a 5 estrelas."),
  ),
  comment: texto.pipe(
    z
      .string()
      .min(LIMITES.comment.min, "Escreva pelo menos 20 caracteres sobre sua experiência.")
      .max(
        LIMITES.comment.max,
        `O comentário pode ter no máximo ${LIMITES.comment.max} caracteres.`,
      ),
  ),
  publicName: texto.pipe(
    z
      .string()
      .min(
        LIMITES.publicName.min,
        "Informe como seu nome deve aparecer (2 a 60 caracteres, sem e-mail ou telefone).",
      )
      .max(
        LIMITES.publicName.max,
        "Informe como seu nome deve aparecer (2 a 60 caracteres, sem e-mail ou telefone).",
      )
      .refine((v) => !contemDadoDeContato(v), {
        message: "Informe como seu nome deve aparecer (2 a 60 caracteres, sem e-mail ou telefone).",
      }),
  ),
  purchaseEmail: email("Informe o e-mail usado na compra, no formato nome@exemplo.com."),
  publicationConsent: checkbox.pipe(z.literal(true, { error: MENSAGEM_SEM_AUTORIZACAO })),
  privacyAck: checkbox.pipe(z.literal(true, { error: PRIVACIDADE })),
});

export type ReviewData = z.infer<typeof reviewSchema>;
