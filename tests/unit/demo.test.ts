import { describe, expect, it } from "vitest";
import type { DemoMaterial } from "@/content/types";
import { arquivosDoMaterial, assertDemoFilesExist, selectApprovedDemo } from "@/lib/demo";

const m = (id: string, status: DemoMaterial["status"]): DemoMaterial => ({
  id,
  kind: "imagem",
  src: `/media/planner-2027/${id}`,
  width: 1600,
  height: 1200,
  alt: "Página real do planner",
  caption: "c",
  section: "diario",
  status,
});

describe("demo", () => {
  it("só materiais aprovados", () => {
    expect(selectApprovedDemo([m("a", "aprovado"), m("b", "pendente")]).map((x) => x.id)).toEqual([
      "a",
    ]);
  });
  it("lista as 6 variantes de cada imagem", () => {
    expect(arquivosDoMaterial(m("a", "aprovado"))).toHaveLength(6);
  });
  it("falha se material aprovado não existe no disco", () => {
    expect(() => assertDemoFilesExist([m("a", "aprovado")], () => false)).toThrow(/sem arquivo/);
  });
  it("ignora materiais pendentes na checagem", () => {
    expect(() => assertDemoFilesExist([m("a", "pendente")], () => false)).not.toThrow();
  });
});
