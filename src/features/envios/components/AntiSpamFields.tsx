"use client";

import { useEffect, useState } from "react";
import { getFormToken } from "../actions";

/**
 * Camadas 2 e 3 do antispam (research R-10):
 * - honeypot `website`, oculto visual e semanticamente;
 * - token assinado emitido quando o formulário aparece (as páginas são estáticas).
 */
export function AntiSpamFields() {
  const [token, setToken] = useState("");
  useEffect(() => {
    let ativo = true;
    getFormToken()
      .then((t) => ativo && setToken(t ?? ""))
      .catch(() => undefined);
    return () => {
      ativo = false;
    };
  }, []);
  return (
    <>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Não preencha este campo</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>
      <input type="hidden" name="formToken" value={token} />
    </>
  );
}
