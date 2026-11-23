/**
 * Token de formulário assinado (research R-10, camada 3): `timestamp.assinatura` com HMAC-SHA256.
 * Rejeita envios feitos em menos de 3 s (robôs) ou depois de 2 h. Usa Web Crypto (Workers e Node).
 */
export const TEMPO_MINIMO_MS = 3_000;
export const TEMPO_MAXIMO_MS = 2 * 60 * 60 * 1000;

const encoder = new TextEncoder();

async function chave(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function paraBase64Url(bytes: ArrayBuffer): string {
  return Buffer.from(bytes).toString("base64url");
}

export async function issueFormToken(secret: string, now: number = Date.now()): Promise<string> {
  const ts = String(now);
  const assinatura = await crypto.subtle.sign("HMAC", await chave(secret), encoder.encode(ts));
  return `${ts}.${paraBase64Url(assinatura)}`;
}

export type TokenCheck =
  { ok: true } | { ok: false; reason: "formato" | "assinatura" | "cedo" | "expirado" };

export async function verifyFormToken(
  token: string,
  secret: string,
  now: number = Date.now(),
): Promise<TokenCheck> {
  const [ts, assinatura] = token.split(".");
  if (!ts || !assinatura || !/^\d+$/.test(ts)) return { ok: false, reason: "formato" };
  const decodificado = Buffer.from(assinatura, "base64url");
  if (decodificado.length === 0) return { ok: false, reason: "formato" };
  const bytes = new Uint8Array(new ArrayBuffer(decodificado.length));
  bytes.set(decodificado);
  const valido = await crypto.subtle.verify("HMAC", await chave(secret), bytes, encoder.encode(ts));
  if (!valido) return { ok: false, reason: "assinatura" };
  const idade = now - Number(ts);
  if (idade < TEMPO_MINIMO_MS) return { ok: false, reason: "cedo" };
  if (idade > TEMPO_MAXIMO_MS) return { ok: false, reason: "expirado" };
  return { ok: true };
}
