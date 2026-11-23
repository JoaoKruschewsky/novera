import { describe, expect, it, vi } from "vitest";
import { SITEVERIFY_URL, verifyTurnstile } from "@/features/envios/turnstile";

const resposta = (body: unknown, ok = true) =>
  ({ ok, json: async () => body }) as unknown as Response;

describe("verifyTurnstile", () => {
  it("aprova quando o siteverify responde success: true e envia secret, token e IP", async () => {
    const fetchMock = vi.fn(async () => resposta({ success: true }));
    expect(
      await verifyTurnstile("tok", "sec", "1.2.3.4", fetchMock as unknown as typeof fetch),
    ).toBe(true);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(SITEVERIFY_URL);
    const body = init.body as URLSearchParams;
    expect(body.get("secret")).toBe("sec");
    expect(body.get("response")).toBe("tok");
    expect(body.get("remoteip")).toBe("1.2.3.4");
  });
  it("reprova com success: false", async () => {
    const f = vi.fn(async () => resposta({ success: false }));
    expect(await verifyTurnstile("tok", "sec", null, f as unknown as typeof fetch)).toBe(false);
  });
  it("reprova com erro HTTP", async () => {
    const f = vi.fn(async () => resposta({}, false));
    expect(await verifyTurnstile("tok", "sec", null, f as unknown as typeof fetch)).toBe(false);
  });
  it("reprova com falha de rede ou tempo esgotado", async () => {
    const f = vi.fn(async () => {
      throw new Error("timeout");
    });
    expect(await verifyTurnstile("tok", "sec", null, f as unknown as typeof fetch)).toBe(false);
  });
  it("reprova sem token, sem chamar o serviço", async () => {
    const f = vi.fn();
    expect(await verifyTurnstile("", "sec", null, f as unknown as typeof fetch)).toBe(false);
    expect(f).not.toHaveBeenCalled();
  });
});
