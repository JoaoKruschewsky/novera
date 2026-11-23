"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { ConsentCheckbox } from "@/components/ui/ConsentCheckbox";
import { Field, FieldError } from "@/components/ui/Field";
import { ErrorSummary, SuccessMessage } from "@/components/ui/FormStatus";
import { RatingInput } from "@/components/ui/RatingInput";
import { TextArea } from "@/components/ui/TextArea";
import { submitReview } from "../actions";
import { IDLE, type SubmissionResult } from "../result";
import { LIMITES } from "../schemas";
import { AntiSpamFields } from "./AntiSpamFields";
import { PrivacyNotice } from "./PrivacyNotice";
import { TurnstileWidget } from "./TurnstileWidget";

const ROTULOS: Record<string, string> = {
  rating: "Nota",
  comment: "Comentário",
  publicName: "Nome público",
  purchaseEmail: "E-mail da compra",
  publicationConsent: "Autorização",
  privacyAck: "Aviso de privacidade",
};

export const SUCESSO_AVALIACAO =
  "Obrigado! Sua avaliação foi recebida e será publicada somente depois que confirmarmos a compra e fizermos a moderação.";

/** Envio de avaliação sem conta (FR-027, US7). Nada é publicado antes da moderação. */
export function ReviewForm({ contactEmail }: { contactEmail: string | null }) {
  const [state, formAction, pending] = useActionState<SubmissionResult, FormData>(
    submitReview,
    IDLE,
  );

  if (state.status === "success") {
    return <SuccessMessage title={SUCESSO_AVALIACAO} />;
  }

  const values = state.status === "invalid" || state.status === "error" ? state.values : {};
  const errors = state.status === "invalid" ? state.fieldErrors : {};
  const rating = Number(values.rating);

  return (
    <form action={formAction} noValidate className="relative grid max-w-2xl gap-6">
      {state.status === "invalid" ? (
        <ErrorSummary
          title="Revise os campos abaixo:"
          errors={errors}
          labels={ROTULOS}
          focusKey={state}
        />
      ) : null}
      {state.status === "error" ? (
        <ErrorSummary
          title="Sua avaliação não foi enviada."
          message={<p>{state.message}</p>}
          focusKey={state}
        />
      ) : null}

      <RatingInput
        key={`nota-${values.rating ?? ""}`}
        id="rating"
        name="rating"
        defaultValue={rating >= 1 && rating <= 5 ? rating : undefined}
        error={errors.rating}
      />
      <TextArea
        id="comment"
        name="comment"
        label="Comentário"
        hint={`Conte como foi usar o planner. De ${LIMITES.comment.min} a ${LIMITES.comment.max} caracteres; não inclua telefone, e-mail ou endereço.`}
        maxLength={LIMITES.comment.max}
        defaultValue={values.comment}
        error={errors.comment}
      />
      <Field
        id="publicName"
        name="publicName"
        label="Nome público"
        hint="Como seu nome vai aparecer: pode ser nome, primeiro nome com inicial ou apelido."
        maxLength={LIMITES.publicName.max}
        defaultValue={values.publicName}
        error={errors.publicName}
      />
      <Field
        id="purchaseEmail"
        name="purchaseEmail"
        type="email"
        autoComplete="email"
        label="E-mail usado na compra"
        hint="Usado só para confirmar a compra e, se preciso, falar com você. Nunca é publicado."
        maxLength={LIMITES.email.max}
        defaultValue={values.purchaseEmail}
        error={errors.purchaseEmail}
      />

      <AntiSpamFields />
      <TurnstileWidget resetKey={state} contactEmail={contactEmail} />

      <PrivacyNotice
        finalidade="Usamos estes dados para confirmar a compra, moderar e publicar a avaliação que você autorizar."
        dados="a nota, o comentário, o nome público e o e-mail da compra (este nunca é publicado)"
      />
      <ConsentCheckbox
        id="publicationConsent"
        name="publicationConsent"
        defaultChecked={values.publicationConsent === "on"}
        error={
          errors.publicationConsent ? (
            <div id="publicationConsent-erro">
              <FieldError id="publicationConsent-erro-texto" message={errors.publicationConsent} />
              <p className="mt-1 text-small">
                <Link href="/contato" className="text-text-accent underline underline-offset-4">
                  Ir para a página de contato
                </Link>
              </p>
            </div>
          ) : undefined
        }
        errorText={errors.publicationConsent}
      >
        Autorizo a publicação da minha nota, do comentário e do nome público no site da Novera,
        depois da moderação.
      </ConsentCheckbox>
      <ConsentCheckbox
        id="privacyAck"
        name="privacyAck"
        defaultChecked={values.privacyAck === "on"}
        errorText={errors.privacyAck}
      >
        Li o aviso de privacidade.
      </ConsentCheckbox>

      <div>
        <Button type="submit" loading={pending}>
          Enviar avaliação
        </Button>
      </div>
    </form>
  );
}
