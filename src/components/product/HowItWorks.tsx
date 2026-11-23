import type { HomeContent } from "@/content/types";

type Step = HomeContent["howItWorks"][number];

/**
 * Quatro passos (FR-008): linha do tempo vertical no mobile e horizontal a partir de 1024 px,
 * ligados pelo fio champagne (design-system §5).
 */
export function HowItWorks({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-8">
      {steps.map((step, i) => (
        <li
          key={step.id}
          className="relative border-l border-accent pl-6 lg:border-t lg:border-l-0 lg:pt-6 lg:pl-0"
        >
          <span aria-hidden="true" className="eyebrow block text-text-accent tabular-nums">
            {String(i + 1).padStart(2, "0")}
          </span>
          <p className="mt-2 text-h3 font-semibold text-text-primary">
            <span className="sr-only">Passo {i + 1}: </span>
            {step.title.text}
          </p>
          <p className="mt-2 text-text-secondary">{step.description.text}</p>
        </li>
      ))}
    </ol>
  );
}
