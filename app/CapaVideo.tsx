"use client";

import { useEffect, useRef } from "react";

/**
 * Una capa de video de la escena (FLOW-ASSETS.md): WebM con alfa sobre el escenario.
 *
 * - `loop` (proyector, haz, audiencia): repite sin costura.
 * - sin `loop` (Voltio, telón): reproduce una vez y SOSTIENE el último cuadro.
 * - Se pausa fuera del viewport y respeta `prefers-reduced-motion` mostrando el poster.
 * - `preload="metadata"` + poster para no descargar 5 videos al abrir la página.
 */
export default function CapaVideo({
  src,
  poster,
  loop = false,
  className,
  onEnded,
}: {
  src: string;
  poster: string;
  loop?: boolean;
  className?: string;
  onEnded?: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // un play() rechazado (autoplay bloqueado) no debe romper la escena
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "120px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      loop={loop}
      muted
      playsInline
      preload="metadata"
      onEnded={onEnded}
      aria-hidden="true"
    />
  );
}
