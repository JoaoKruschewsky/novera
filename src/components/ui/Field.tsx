import { CircleAlert } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Classes de borda e foco dos campos; erro = borda + ícone + texto, nunca só cor. */
export function fieldClasses(invalid: boolean, className?: string) {
  return cn(
    "w-full rounded-sm border bg-surface-base px-3 py-2.5 text-body text-text-primary placeholder:text-text-secondary/70",
    "transition-colors duration-(--duration-fast) focus-visible:border-focus-ring",
    invalid ? "border-2 border-state-error" : "border-border-field",
    className,
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-small font-semibold text-state-error">
      <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

export function FieldHint({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1 text-small text-text-secondary">
      {children}
    </p>
  );
}

/** Liga ajuda e erro ao campo por aria-describedby. */
export function describedBy(id: string, hint?: ReactNode, error?: string): string | undefined {
  const ids = [hint ? `${id}-ajuda` : null, error ? `${id}-erro` : null].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

interface FieldProps extends Omit<ComponentPropsWithoutRef<"input">, "id" | "name"> {
  id: string;
  name: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
}

/** Campo de texto com rótulo visível, ajuda e erro associados (design-system §4). */
export function Field({
  id,
  name,
  label,
  hint,
  error,
  optional = false,
  className,
  ...rest
}: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block font-semibold text-text-primary">
        {label}
        {optional ? <span className="font-normal text-text-secondary"> (opcional)</span> : null}
      </label>
      <FieldHint id={`${id}-ajuda`}>{hint}</FieldHint>
      <input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        required={!optional}
        className={cn(fieldClasses(Boolean(error)), "mt-2 min-h-11")}
        {...rest}
      />
      <FieldError id={`${id}-erro`} message={error} />
    </div>
  );
}
