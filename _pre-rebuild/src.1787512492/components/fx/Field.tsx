"use client";

import { useEffect, useRef } from "react";
import { runField } from "@/lib/field-gl";

/**
 * Mounts the live point field onto a canvas that fills its parent.
 *
 * Renders nothing on the server and does not start under reduced motion — in
 * that case the section keeps its static bloom lighting and loses nothing it
 * needed.
 */
export default function Field({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handle = runField(canvas);
    return () => handle?.destroy();
  }, []);

  return (
    <canvas
      ref={ref}
      className={className}
      aria-hidden="true"
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
