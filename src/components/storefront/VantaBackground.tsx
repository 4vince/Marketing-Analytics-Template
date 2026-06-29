"use client";
import { useEffect, useRef } from "react";

export default function VantaBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const vantaRef = useRef<any>(null);

  useEffect(() => {
    async function init() {
      if (!ref.current || vantaRef.current) return;

      const [three, p5, trunk] = await Promise.all([
        import("three"),
        import("p5"),
        import("vanta/dist/vanta.trunk.min"),
      ]);

      window.THREE = three;

      vantaRef.current = trunk.default({
        el: ref.current,
        p5: p5.default,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0xf24139,
        backgroundColor: 0x141414,
        spacing: 0.12,
        chaos: 0.5,
      });
    }

    init();

    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
