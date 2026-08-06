import { useCallback, useEffect, useRef } from "react";

export function CursorEffects() {
  const orbRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);

  const onMouseMove = useCallback((e: MouseEvent) => {
    posRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const animate = () => {
      const { x, y } = posRef.current;
      if (orbRef.current) {
        orbRef.current.style.left = `${x}px`;
        orbRef.current.style.top = `${y}px`;
      }
      if (dotRef.current) {
        dotRef.current.style.left = `${x}px`;
        dotRef.current.style.top = `${y}px`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    const onEnter = () => dotRef.current?.classList.add("hovered");
    const onLeave = () => dotRef.current?.classList.remove("hovered");
    const clickables = Array.from(
      document.querySelectorAll('a, button, [role="button"]'),
    );
    clickables.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clickables.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [onMouseMove]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      const ripple = document.createElement("div");
      ripple.className = "touch-ripple";
      ripple.setAttribute("aria-hidden", "true");
      ripple.style.left = `${touch.clientX}px`;
      ripple.style.top = `${touch.clientY}px`;
      ripple.style.width = "180px";
      ripple.style.height = "180px";
      document.body.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    };

    window.addEventListener("touchstart", onTouch, { passive: true });
    return () => window.removeEventListener("touchstart", onTouch);
  }, []);

  return (
    <>
      <div ref={orbRef} className="cursor-glow-orb" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}

export default CursorEffects;
