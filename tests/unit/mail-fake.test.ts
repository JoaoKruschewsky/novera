import { mkdtempSync, readdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { FakeTransport, FALHA_SIMULADA } from "@/features/envios/mail/fake";

const msg = {
  to: "caixa@example.com",
  from: "site@example.com",
  replyTo: "p@example.com",
  subject: "s",
  text: "t",
};

describe("FakeTransport", () => {
  it("grava o e-mail como JSON", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "fake-mail-"));
    expect(await new FakeTransport(dir).send(msg)).toEqual({ ok: true });
    const arquivos = readdirSync(dir);
    expect(arquivos).toHaveLength(1);
    expect(JSON.parse(readFileSync(path.join(dir, arquivos[0] ?? ""), "utf8"))).toEqual(msg);
  });
  it("simula falha de cota e de envio pelos marcadores, sem gravar", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "fake-mail-"));
    const t = new FakeTransport(dir);
    expect(await t.send({ ...msg, text: `x ${FALHA_SIMULADA.quota}` })).toEqual({
      ok: false,
      kind: "quota",
    });
    expect(await t.send({ ...msg, text: `x ${FALHA_SIMULADA.other}` })).toEqual({
      ok: false,
      kind: "other",
    });
    expect(readdirSync(dir)).toHaveLength(0);
  });
});
