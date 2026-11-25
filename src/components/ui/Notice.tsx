import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface NoticeProps {
  title?: string;
  children: ReactNode;
  /** true só quando o conteúdo muda dinamicamente (role="status"). */
  live?: boolean;
  /** Sobre faixa de papel. */
  onPaper?: boolean;
  className?: string;
}

/**
 * Bloco informativo tipográfico para estados honestos: vendas não abertas, materiais em breve,
 * documento em preparação (FR-010, FR-017, FR-022). Nunca simula conteúdo.
 */
export function Notice({ title, children, live = false, onPaper = false, className }: NoticeProps) {
  return (
    <div
      role={live ? "status" : undefined}
      className={cn(
        "max-w-prose border-l-2 py-1 pl-5",
        onPaper ? "border-text-on-paper text-text-on-paper" : "border-accent text-text-secondary",
        className,
      )}
    >
      {title ? (
        <p
          className={cn(
            "text-h3 font-semibold",
            onPaper ? "text-text-on-paper" : "text-text-primary",
          )}
        >
          {title}
        </p>
      ) : null}
      <div className={cn(title && "mt-2")}>{children}</div>
    </div>
  );
}
