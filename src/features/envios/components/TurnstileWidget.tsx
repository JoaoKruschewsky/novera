"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}

const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
/** Chave de teste "sempre aprova", usada só se a variável não estiver definida (desenvolvimento). */
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

let carregamento: Promise<void> | null = null;

function carregarScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  carregamento ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_URL;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      carregamento = null;
      reject(new Error("turnstile"));
    };
    document.head.appendChild(s);
  });
  return carregamento;
}

/**
 * Antispam Cloudflare Turnstile em modo managed (research R-10). Carregado só nas páginas de
 * formulário. Insere o campo `cf-turnstile-response` dentro do formulário. Se falhar ao carregar,
 * mostra uma instrução textual com o contato alternativo.
 */
export function TurnstileWidget({
  resetKey,
  contactEmail,
}: {
  resetKey: unknown;
  contactEmail: string | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    let ativo = true;
    carregarScript()
      .then(() => {
        if (!ativo || !ref.current || !window.turnstile || widgetId.current) return;
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: SITE_KEY,
          language: "pt-br",
          theme: "dark",
          "response-field-name": "cf-turnstile-response",
        });
      })
      .catch(() => ativo && setFalhou(true));
    return () => {
      ativo = false;
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, []);

  // Após cada tentativa de envio, gera um novo desafio (o token é de uso único).
  useEffect(() => {
    if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
  }, [resetKey]);

  return (
    <div>
      <p className="text-small text-text-secondary" id="turnstile-rotulo">
        Verificação contra envios automáticos
      </p>
      <div ref={ref} aria-labelledby="turnstile-rotulo" className="mt-2 min-h-16" />
      {falhou ? (
        <p role="alert" className="mt-2 text-small text-text-primary">
          Não foi possível carregar a verificação de segurança. Recarregue a página
          {contactEmail ? ` ou escreva para ${contactEmail}` : ""}.
        </p>
      ) : null}
    </div>
  );
}
