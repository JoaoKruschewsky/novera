import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Grade com margens do design system (§2.4): 20 px mobile, 32 px tablet, largura máx. 1200 px. */
export function Container({
  children,
  className,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 md:px-8",
        wide ? "max-w-wide" : "max-w-content",
        className,
      )}
    >
      {children}
    </div>
  );
}
