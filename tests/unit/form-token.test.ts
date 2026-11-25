import { describe, expect, it } from "vitest";
import { issueFormToken, TEMPO_MAXIMO_MS, verifyFormToken } from "@/features/envios/form-token";

const SECRET = "segredo-de-teste-unitario-com-mais-de-32-caracteres";
const T0 = 1_800_000_000_000;

describe("token de formulário (R-10)", () => {
  it("aceita token válido depois de 3 s", async () => {
    const t = await issueFormToken(SECRET, T0);
    expect(await verifyFormToken(t, SECRET, T0 + 5_000)).toEqual({ ok: true });
  });
  it("rejeita envio cedo demais", async () => {
    const t = await issueFormToken(SECRET, T0);
    expect(await verifyFormToken(t, SECRET, T0 + 1_000)).toEqual({ ok: false, reason: "cedo" });
  });
  it("rejeita token expirado", async () => {
    const t = await issueFormToken(SECRET, T0);
    expect(await verifyFormToken(t, SECRET, T0 + TEMPO_MAXIMO_MS + 1)).toEqual({
      ok: false,
      reason: "expirado",
    });
  });
  it("rejeita token adulterado", async () => {
    const t = await issueFormToken(SECRET, T0);
    const [, assinatura] = t.split(".");
    expect(await verifyFormToken(`${T0 - 60_000}.${assinatura}`, SECRET, T0 + 5_000)).toEqual({
      ok: false,
      reason: "assinatura",
    });
  });
  it("rejeita token assinado com outro segredo", async () => {
    const t = await issueFormToken("outro-segredo-qualquer-com-32-caracteres-ou-mais", T0);
    expect((await verifyFormToken(t, SECRET, T0 + 5_000)).ok).toBe(false);
  });
  it("rejeita formato inválido", async () => {
    expect(await verifyFormToken("", SECRET)).toEqual({ ok: false, reason: "formato" });
    expect(await verifyFormToken("abc.def", SECRET)).toEqual({ ok: false, reason: "formato" });
  });
});
