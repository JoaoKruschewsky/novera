"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { ChoiceGroup } from "@/components/ui/ChoiceGroup";
import { ConsentCheckbox } from "@/components/ui/ConsentCheckbox";
import { Field } from "@/components/ui/Field";
import { ErrorSummary, SuccessMessage } from "@/components/ui/FormStatus";
import { TextArea } from "@/components/ui/TextArea";
import { submitFeedback } from "../actions";
import { IDLE, type SubmissionResult } from "../result";
import { FEEDBACK_TIPOS, LIMITES } from "../schemas";
import { AntiSpamFields } from "./AntiSpamFields";
import { PrivacyNotice } from "./PrivacyNotice";
import { TurnstileWidget } from "./TurnstileWidget";

const ROTULOS: Record<string, string> = {
  type: "Tipo de mensagem",
  message: "Mensagem",
  replyEmail: "E-mail para resposta",
  name: "Nome",
  privacyAck: "Aviso de privacidade",
};

const TIPOS = Object.entries(FEEDBACK_TIPOS).map(([value, t]) => ({ value, label: t.longo }));

/**
 * Feedback privado (FR-024 a FR-026, contracts/envio-formularios.md). Nunca é publicado.
 * O texto digitado é preservado em qualquer erro (FR-036b).
 */
export function FeedbackForm({
  contactEmail,
  responseTime,
}: {
  contactEmail: string | null;
  responseTime: string | null;
}) {
  const [state, formAction, pending] = useActionState<SubmissionResult, FormData>(
    submitFeedback,
    IDLE,
  );

  if (state.status === "success") {
    return (
      <SuccessMessage title="Mensagem enviada. Responderemos no e-mail informado.">
        {responseTime ? <p>Prazo de resposta: {responseTime}.</p> : null}
      </SuccessMessage>
    );
  }

  const values = state.status === "invalid" || state.status === "error" ? state.values : {};
  const errors = state.status === "invalid" ? state.fieldErrors : {};

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
          title="Sua mensagem não foi enviada."
          message={<p>{state.message}</p>}
          focusKey={state}
        />
      ) : null}

      <ChoiceGroup
        id="type"
        name="type"
        legend="Tipo de mensagem"
        options={TIPOS}
        defaultValue={values.type}
        error={errors.type}
      />
      <TextArea
        id="message"
        name="message"
        label="Mensagem"
        hint={`De ${LIMITES.message.min} a ${LIMITES.message.max} caracteres.`}
        maxLength={LIMITES.message.max}
        defaultValue={values.message}
        error={errors.message}
      />
      <Field
        id="replyEmail"
        name="replyEmail"
        type="email"
        autoComplete="email"
        label="E-mail para resposta"
        hint="Usado só para responder a esta mensagem."
        maxLength={LIMITES.email.max}
        defaultValue={values.replyEmail}
        error={errors.replyEmail}
      />
      <Field
        id="name"
        name="name"
        autoComplete="name"
        label="Nome"
        optional
        maxLength={LIMITES.name.max}
        defaultValue={values.name}
        error={errors.name}
      />

      <AntiSpamFields />
      <TurnstileWidget resetKey={state} contactEmail={contactEmail} />

      <PrivacyNotice
        finalidade="Usamos estes dados só para responder à sua mensagem e prestar suporte."
        dados="o tipo de mensagem, o texto, o e-mail para resposta e, se você quiser, o nome"
      />
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
          Enviar mensagem
        </Button>
      </div>
    </form>
  );
}
