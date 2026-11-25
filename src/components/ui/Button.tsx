import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "quiet";

const base =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-body font-semibold leading-tight " +
  "transition-colors duration-(--duration-fast) ease-novera " +
  "aria-disabled:cursor-not-allowed aria-disabled:opacity-60 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover active:bg-accent",
  secondary:
    "border border-text-secondary text-text-primary hover:border-text-primary hover:bg-surface-raised",
  quiet: "px-1 text-text-accent underline decoration-1 underline-offset-4 hover:decoration-2",
};

/** Classes do botão, para uso em elementos que não sejam <Button>. */
export function buttonClasses(variant: ButtonVariant = "primary", className?: string): string {
  return cn(base, variants[variant], className);
}

interface CommonProps {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & {
    href?: undefined;
    /** Estado de envio: rótulo "Enviando…", aria-busy e desabilitado contra duplo clique. */
    loading?: boolean;
    loadingLabel?: string;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  "aria-label"?: string;
};

/** Botão Novera (design-system §4): alvo ≥ 44 × 44 px, rótulo sempre textual. */
export function Button(props: ButtonAsButton | ButtonAsLink) {
  if (props.href !== undefined) {
    const { href, variant = "primary", className, children, ...rest } = props;
    return (
      <Link href={href} className={buttonClasses(variant, className)} {...rest}>
        {children}
      </Link>
    );
  }
  const {
    variant = "primary",
    className,
    children,
    loading = false,
    loadingLabel = "Enviando…",
    disabled,
    type = "button",
    ...rest
  } = props;
  return (
    <button
      type={type}
      className={buttonClasses(variant, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? loadingLabel : children}
    </button>
  );
}
