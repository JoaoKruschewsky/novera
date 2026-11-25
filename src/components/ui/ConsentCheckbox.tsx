import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { FieldError } from "./Field";

interface ConsentCheckboxProps {
  id: string;
  name: string;
  children: ReactNode;
  defaultChecked?: boolean;
  error?: ReactNode;
  errorText?: string;
  className?: string;
}

/** Caixa de consentimento com rótulo clicável e erro associado. */
export function ConsentCheckbox({
  id,
  name,
  children,
  defaultChecked,
  errorText,
  error,
  className,
}: ConsentCheckboxProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          required
          aria-invalid={errorText ? true : undefined}
          aria-describedby={errorText ? `${id}-erro` : undefined}
          className={cn("mt-1 size-5 shrink-0 accent-accent")}
        />
        <span className="text-text-primary">{children}</span>
      </label>
      {error ?? <FieldError id={`${id}-erro`} message={errorText} />}
    </div>
  );
}
