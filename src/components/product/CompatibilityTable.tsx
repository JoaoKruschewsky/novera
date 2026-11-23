import type { CompatibilityRecord, Copy } from "@/content/types";
import { formatDatePtBR } from "@/lib/format";
import { resolveCompatibilityView } from "@/lib/compatibility";

const sim = (v: boolean) => (v ? "Sim" : "Não");

/** Compatibilidade verificada (FR-013): só testes registrados; sem eles, requisitos gerais. */
export function CompatibilityTable({
  records,
  generalRequirements,
}: {
  records: CompatibilityRecord[];
  generalRequirements: Copy;
}) {
  const view = resolveCompatibilityView(records);
  if (view.mode === "requisitos-gerais") {
    return <p className="max-w-prose text-text-secondary">{generalRequirements.text}</p>;
  }
  const linhas = [...view.compativeis, ...view.parciais];
  return (
    <div className="space-y-4">
      <p className="max-w-prose text-text-secondary">{generalRequirements.text}</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left text-small">
          <caption className="sr-only">
            Aplicativos e dispositivos testados com o Planner 2027
          </caption>
          <thead>
            <tr className="border-b border-border-subtle text-text-secondary">
              <th scope="col" className="py-3 pr-4 font-semibold">
                Aplicativo
              </th>
              <th scope="col" className="py-3 pr-4 font-semibold">
                Sistema e dispositivo
              </th>
              <th scope="col" className="py-3 pr-4 font-semibold">
                Links internos
              </th>
              <th scope="col" className="py-3 pr-4 font-semibold">
                Escrita
              </th>
              <th scope="col" className="py-3 pr-4 font-semibold">
                Resultado
              </th>
              <th scope="col" className="py-3 font-semibold">
                Testado em
              </th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((r) => (
              <tr
                key={`${r.app}-${r.platform}`}
                className="border-b border-border-subtle align-top"
              >
                <th scope="row" className="py-3 pr-4 font-semibold text-text-primary">
                  {r.app}
                </th>
                <td className="py-3 pr-4">{r.platform}</td>
                <td className="py-3 pr-4">{sim(r.checks.internalLinks)}</td>
                <td className="py-3 pr-4">{sim(r.checks.handwriting)}</td>
                <td className="py-3 pr-4">
                  {r.result === "compativel"
                    ? "Compatível"
                    : `Funciona com limitações${r.notes ? `: ${r.notes}` : ""}`}
                </td>
                <td className="py-3">
                  <time dateTime={r.testedOn}>{formatDatePtBR(r.testedOn)}</time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
