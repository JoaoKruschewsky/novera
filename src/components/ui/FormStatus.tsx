"use client";

import { CircleAlert, CircleCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Resumo de erros (contrato de envio, acessibilidade): role="alert", links para cada campo
 * e foco programático após o envio inválido.
 */
export function ErrorSummary({
  title,
  errors,
  labels,
  message,
  focusKey,
}: {
  title: string;
  errors?: Record<string, string>;
  labels?: Record<string, string>;
  message?: ReactNode;
  /** Muda a cada envio, para devolver o foco ao resumo. */
  focusKey: unknown;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, [focusKey]);
  const lista = errors ? Object.entries(errors) : [];
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      className="rounded-sm border-2 border-state-error p-5 outline-none focus-visible:outline-2"
    >
      <p className="flex items-center gap-2 font-semibold text-text-primary">
        <CircleAlert aria-hidden="true" className="size-5 text-state-error" />
        {title}
      </p>
      {message ? <div className="mt-2 text-text-secondary">{message}</div> : null}
      {lista.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1 pl-6 text-text-secondary">
          {lista.map(([campo, msg]) => (
            <li key={campo}>
              <a href={`#${campo}`} className="text-text-accent underline underline-offset-4">
                {labels?.[campo] ? `${labels[campo]}: ` : ""}
                {msg}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** Mensagem de sucesso: substitui o formulário e recebe foco (tabIndex=-1). */
export function SuccessMessage({ title, children }: { title: string; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      className="max-w-prose rounded-sm border border-border-subtle bg-surface-raised p-6 outline-none focus-visible:outline-2"
    >
      <p className="flex items-start gap-3 text-h3 font-semibold text-state-success">
        <CircleCheck aria-hidden="true" className="mt-1 size-6 shrink-0" />
        {title}
      </p>
      {children ? <div className="mt-3 text-text-secondary">{children}</div> : null}
      <Link
        href="/"
        className="mt-6 inline-flex min-h-11 items-center text-text-accent underline underline-offset-4"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
