import type { CompatibilityRecord, Copy } from "../../types";

/**
 * Registros de compatibilidade TESTADOS (FR-013, data-model §1.6). Inicia vazio (P-08).
 * Só entra um aplicativo/dispositivo com teste real registrado (data, links e escrita).
 * Exemplo: { app: "Nome do app", platform: "Sistema e dispositivo", checks: { internalLinks: true,
 * handwriting: true }, result: "compativel", testedOn: "2027-01-10", notes: "..." }
 */
export const compatibility: CompatibilityRecord[] = [];

/** Requisitos gerais exibidos enquanto não houver testes registrados (US4-2). */
export const generalRequirements: Copy = {
  text: "Para usar o planner, você precisa de um aplicativo que abra arquivos PDF com links internos e permita escrever ou fazer anotações sobre o arquivo. A lista de aplicativos e dispositivos testados será publicada depois dos testes.",
  status: "pendente",
};
