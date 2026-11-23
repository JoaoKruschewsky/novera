"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import type { NavItem } from "@/content/types";
import { buttonClasses } from "@/components/ui/Button";

/**
 * Navegação em telas < 1024 px (FR-038) com `<dialog>` nativo (T136: troca do Radix Dialog
 * para reduzir o JavaScript). `showModal()` torna o resto da página inerte (foco retido),
 * Esc fecha pelo próprio navegador e o foco volta ao botão "Menu" ao fechar.
 */
export function MobileNav({ items, purchaseHref }: { items: NavItem[]; purchaseHref: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const abrir = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };
  const fechar = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-controls="menu-mobile"
        aria-expanded={open}
        onClick={abrir}
        className="inline-flex min-h-11 items-center gap-2 rounded-sm px-3 text-text-primary hover:bg-surface-raised lg:hidden"
      >
        <Menu aria-hidden="true" className="size-5" />
        Menu
      </button>
      {/* Clique no fundo (fora do painel) fecha; teclado usa Esc ou o botão "Fechar". */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        ref={dialogRef}
        id="menu-mobile"
        aria-labelledby="menu-mobile-titulo"
        aria-describedby="menu-mobile-descricao"
        onClose={() => setOpen(false)}
        onKeyDown={(e) => {
          // O modal nativo deixa o Tab sair para a interface do navegador; aqui o foco circula.
          if (e.key !== "Tab") return;
          // Controla todo o Tab dentro do menu: igual em todos os navegadores (o Safari, por
          // padrão, pula links no Tab).
          const focaveis = [...e.currentTarget.querySelectorAll<HTMLElement>("a[href], button")];
          if (focaveis.length === 0) return;
          e.preventDefault();
          const atual = focaveis.indexOf(document.activeElement as HTMLElement);
          const passo = e.shiftKey ? -1 : 1;
          const proximo = (atual + passo + focaveis.length) % focaveis.length;
          focaveis[atual === -1 ? 0 : proximo]?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) fechar();
        }}
        className="sheet-content fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-[min(22rem,88vw)] max-w-none overflow-y-auto bg-surface-raised p-0 text-text-primary backdrop:bg-graphite-deep/80"
      >
        <div className="flex min-h-full flex-col p-6">
          <div className="flex items-center justify-between">
            <h2 id="menu-mobile-titulo" className="font-display text-h3">
              Novera
            </h2>
            <button
              type="button"
              onClick={fechar}
              className="inline-flex min-h-11 items-center gap-2 rounded-sm px-3 hover:bg-surface-base"
            >
              <X aria-hidden="true" className="size-5" />
              Fechar
            </button>
          </div>
          <p id="menu-mobile-descricao" className="sr-only">
            Navegação principal do site
          </p>
          <nav aria-label="Principal (menu)" className="mt-8">
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.href} className="border-b border-border-subtle">
                  <Link
                    href={item.href}
                    onClick={fechar}
                    className="flex min-h-12 items-center text-lead hover:text-text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={purchaseHref}
              onClick={fechar}
              className={buttonClasses("primary", "mt-8 w-full")}
            >
              Comprar
            </Link>
          </nav>
        </div>
      </dialog>
    </>
  );
}
