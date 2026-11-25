const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
] as const;

/** "2026-11-18" → "18 de novembro de 2026" (sem depender do fuso horário). */
export function formatDatePtBR(isoDate: string): string {
  const [ano, mes, dia] = isoDate.split("-").map(Number);
  if (!ano || !mes || !dia || mes < 1 || mes > 12) throw new Error(`Data inválida: ${isoDate}`);
  return `${dia} de ${MESES[mes - 1]} de ${ano}`;
}

/** "2027-01" → "janeiro de 2027". */
export function formatMonthPtBR(isoMonth: string): string {
  const [ano, mes] = isoMonth.split("-").map(Number);
  if (!ano || !mes || mes < 1 || mes > 12) throw new Error(`Mês inválido: ${isoMonth}`);
  return `${MESES[mes - 1]} de ${ano}`;
}

/** 3.33 → "3,3" (uma casa decimal, vírgula). */
export function formatAverage(value: number): string {
  return (Math.round(value * 10) / 10).toFixed(1).replace(".", ",");
}

export function pluralize(n: number, singular: string, plural: string): string {
  return n === 1 ? singular : plural;
}

/** Centavos → "R$ 97,00". */
export function formatBRL(amountCents: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
    .format(amountCents / 100)
    .replace(/\u00a0/g, " ");
}

/** Data e hora no fuso de Brasília: "2026-11-18 14:32 (horário de Brasília)". */
export function formatDateTimeBrasilia(date: Date): string {
  const partes = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const p = (t: Intl.DateTimeFormatPartTypes) => partes.find((x) => x.type === t)?.value ?? "";
  return `${p("year")}-${p("month")}-${p("day")} ${p("hour")}:${p("minute")} (horário de Brasília)`;
}
