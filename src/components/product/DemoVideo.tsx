"use client";

import { useEffect, useRef } from "react";
import type { DemoMaterial } from "@/content/types";

/**
 * Vídeo de apresentação (FR-011): controles nativos, sempre sem som ao iniciar, com equivalente
 * textual visível. Toca em loop enquanto está visível na tela e pausa ao sair; com
 * `prefers-reduced-motion: reduce`, nunca inicia sozinho (a pessoa usa o play).
 */
export function DemoVideo({ material }: { material: DemoMaterial }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // O React não grava o atributo `muted`: garantimos a propriedade antes de qualquer play().
    video.muted = true;
    video.defaultMuted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pausadoPelaPessoa = false;
    const aoPausar = () => {
      // Pausa feita pela pessoa (não pelo observador): respeitamos e não retomamos sozinhos.
      if (video.dataset.pausaAutomatica !== "1") pausadoPelaPessoa = true;
      delete video.dataset.pausaAutomatica;
    };
    const aoTocar = () => {
      pausadoPelaPessoa = false;
    };
    video.addEventListener("pause", aoPausar);
    video.addEventListener("play", aoTocar);

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada) return;
        if (entrada.isIntersecting && !pausadoPelaPessoa) {
          video.play().catch(() => {});
        } else if (!entrada.isIntersecting && !video.paused) {
          video.dataset.pausaAutomatica = "1";
          video.pause();
        }
      },
      { threshold: 0.5 },
    );
    observador.observe(video);
    return () => {
      observador.disconnect();
      video.removeEventListener("pause", aoPausar);
      video.removeEventListener("play", aoTocar);
    };
  }, []);

  return (
    <figure className="m-0">
      <video
        ref={ref}
        controls
        muted
        loop
        playsInline
        preload="metadata"
        poster={material.poster}
        width={material.width}
        height={material.height}
        aria-label={material.alt}
        aria-describedby={`${material.id}-descricao`}
        className="h-auto w-full rounded-md bg-text-on-paper shadow-paper"
      >
        <source src={material.src} type="video/mp4" />
      </video>
      <figcaption className="mt-3 text-small font-semibold text-text-on-paper">
        {material.caption}
      </figcaption>
      <details className="mt-2 max-w-prose text-small text-text-on-paper">
        <summary className="inline-flex min-h-11 cursor-pointer items-center underline underline-offset-4">
          Ler a descrição do vídeo
        </summary>
        <p id={`${material.id}-descricao`} className="mt-1">
          {material.textEquivalent}
        </p>
      </details>
    </figure>
  );
}
