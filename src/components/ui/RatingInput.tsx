"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { FieldError } from "./Field";

/**
 * Nota de 1 a 5 (design-system §4): grupo de rádios NATIVOS estilizados como estrelas,
 * com legend e rótulos "1 de 5" … "5 de 5". Setas do teclado mudam a nota; funciona sem JavaScript.
 */
export function RatingInput({
  id,
  name,
  legend = "Sua nota",
  defaultValue,
  error,
}: {
  id: string;
  name: string;
  legend?: string;
  defaultValue?: number;
  error?: string;
}) {
  const [valor, setValor] = useState<number>(defaultValue ?? 0);
  return (
    <fieldset
      id={id}
      tabIndex={-1}
      aria-describedby={error ? `${id}-erro` : undefined}
      className="min-w-0"
    >
      <legend className="font-semibold text-text-primary">{legend}</legend>
      <div className="mt-3 flex flex-wrap items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <label
            key={n}
            className={cn(
              "relative inline-flex size-11 cursor-pointer items-center justify-center rounded-sm",
              "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus-ring",
            )}
          >
            <input
              type="radio"
              name={name}
              value={n}
              defaultChecked={defaultValue === n}
              required
              onChange={() => setValor(n)}
              className="peer sr-only"
            />
            <Star
              aria-hidden="true"
              className={cn(
                "size-7 transition-colors duration-(--duration-fast)",
                n <= valor ? "fill-accent text-accent" : "text-text-secondary",
              )}
            />
            <span className="sr-only">{n} de 5</span>
          </label>
        ))}
        <span aria-hidden="true" className="ml-3 text-small text-text-secondary">
          {valor > 0 ? `Nota ${valor} de 5` : "Nenhuma nota escolhida"}
        </span>
      </div>
      <FieldError id={`${id}-erro`} message={error} />
    </fieldset>
  );
}
