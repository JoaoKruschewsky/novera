import { cn } from "@/lib/cn";

/**
 * Régua editorial: fio champagne de 1 px com numeração de seção (design-system §1). Decorativa.
 * Sobre a faixa de papel, a numeração usa graphite (champagne sobre sand não atinge 4,5:1).
 */
export function EditorialRule({
  number,
  className,
  onPaper = false,
}: {
  number?: string;
  className?: string;
  onPaper?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center gap-4",
        onPaper ? "text-text-on-paper" : "text-text-accent",
        className,
      )}
    >
      {number ? <span className="eyebrow tabular-nums">{number}</span> : null}
      <span className={cn("h-px flex-1", onPaper ? "bg-text-on-paper" : "bg-accent")} />
    </div>
  );
}
