import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { describedBy, FieldError, FieldHint, fieldClasses } from "./Field";

interface TextAreaProps extends Omit<ComponentPropsWithoutRef<"textarea">, "id" | "name"> {
  id: string;
  name: string;
  label: string;
  hint?: ReactNode;
  error?: string;
}

/** Área de texto com rótulo, ajuda (inclui os limites de caracteres) e erro associados. */
export function TextArea({
  id,
  name,
  label,
  hint,
  error,
  className,
  rows = 6,
  ...rest
}: TextAreaProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block font-semibold text-text-primary">
        {label}
      </label>
      <FieldHint id={`${id}-ajuda`}>{hint}</FieldHint>
      <textarea
        id={id}
        name={name}
        rows={rows}
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(fieldClasses(Boolean(error)), "mt-2 resize-y")}
        {...rest}
      />
      <FieldError id={`${id}-erro`} message={error} />
    </div>
  );
}
