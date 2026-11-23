import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { EditorialRule } from "./EditorialRule";

interface SectionHeaderProps {
  /** Numeração editorial, por exemplo "01". */
  number?: string;
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Nível do título; a hierarquia de headings vem da página (sem pular níveis). */
  as?: "h1" | "h2" | "h3";
  id?: string;
  onPaper?: boolean;
  className?: string;
}

/** Cabeçalho de seção: numeração + eyebrow em versalete + título serifado + lead (design-system §4). */
export function SectionHeader({
  number,
  eyebrow,
  title,
  lead,
  as: Heading = "h2",
  id,
  onPaper = false,
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn("max-w-3xl", className)}>
      {number ? (
        <EditorialRule number={number} onPaper={onPaper} className="mb-6 max-w-xs" />
      ) : null}
      {eyebrow ? (
        <p className={cn("eyebrow mb-3", onPaper ? "text-text-on-paper" : "text-text-accent")}>
          {eyebrow}
        </p>
      ) : null}
      <Heading
        id={id}
        className={cn(
          Heading === "h1" ? "text-h1" : Heading === "h2" ? "text-h2" : "text-h3",
          onPaper ? "text-text-on-paper" : "text-text-primary",
        )}
      >
        {title}
      </Heading>
      {lead ? (
        <div
          className={cn(
            "mt-4 max-w-prose text-lead",
            onPaper ? "text-text-on-paper" : "text-text-secondary",
          )}
        >
          {lead}
        </div>
      ) : null}
    </header>
  );
}
