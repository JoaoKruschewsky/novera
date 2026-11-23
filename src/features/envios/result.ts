/** Resultado das Server Actions de envio (data-model §2.3). */
export type FormValues = Record<string, string>;

export type SubmissionResult =
  | { status: "idle" }
  /** Só depois que o provedor de e-mail aceitou o envio (FR-036b). */
  | { status: "success" }
  /** Erros por campo; `values` preserva o texto digitado (US7-7). */
  | { status: "invalid"; fieldErrors: Record<string, string>; values: FormValues }
  | {
      status: "error";
      reason: "verificacao" | "envio" | "limite";
      message: string;
      values: FormValues;
    };

export const IDLE: SubmissionResult = { status: "idle" };
