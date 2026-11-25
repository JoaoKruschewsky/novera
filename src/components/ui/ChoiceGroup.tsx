import { cn } from "@/lib/cn";
import { FieldError } from "./Field";

interface ChoiceGroupProps {
  id: string;
  name: string;
  legend: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  defaultValue?: string;
  error?: string;
  className?: string;
}

/** Grupo de rádios nativos com fieldset/legend (acessível sem JavaScript). */
export function ChoiceGroup({
  id,
  name,
  legend,
  options,
  defaultValue,
  error,
  className,
}: ChoiceGroupProps) {
  return (
    <fieldset
      id={id}
      aria-describedby={error ? `${id}-erro` : undefined}
      className={cn("min-w-0", className)}
      tabIndex={-1}
    >
      <legend className="font-semibold text-text-primary">{legend}</legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <label
            key={o.value}
            className={cn(
              "flex min-h-11 cursor-pointer items-center gap-3 rounded-sm border px-3 py-2",
              "has-checked:border-accent has-checked:bg-surface-raised",
              error ? "border-state-error" : "border-border-field",
            )}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              defaultChecked={defaultValue === o.value}
              required
              className="size-4 accent-accent"
            />
            {o.label}
          </label>
        ))}
      </div>
      <FieldError id={`${id}-erro`} message={error} />
    </fieldset>
  );
}
