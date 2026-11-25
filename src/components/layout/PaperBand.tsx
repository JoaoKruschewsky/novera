import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Faixa de papel (design-system §1, assinatura 1): fundo sand, largura --w-wide.
 * A classe `paper` troca o foco para graphite (globals.css).
 */
export function PaperBand({
  children,
  className,
  id,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "paper mx-auto w-full max-w-wide bg-surface-paper text-text-on-paper md:rounded-md",
        className,
      )}
    >
      {children}
    </section>
  );
}
