import { useEffect, useRef } from "react";
import { gsap } from "gsap";
export function CreativeCursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const media = matchMedia(
      "(pointer:fine) and (prefers-reduced-motion:no-preference)",
    );
    let cleanup = () => {};
    const setup = () => {
      cleanup();
      if (!media.matches) return;
      const x = gsap.quickTo(node, "x", { duration: 0.22, ease: "power3.out" }),
        y = gsap.quickTo(node, "y", { duration: 0.22, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        node.style.opacity = "1";
        x(e.clientX);
        y(e.clientY);
        const target = e.target as HTMLElement;
        node.dataset.interactive = String(!!target.closest("a,button,video"));
        node.dataset.project = String(!!target.closest(".work-media"));
      };
      const click = () =>
        gsap.fromTo(
          node.querySelector(".cursor-ring"),
          { scale: 0.6 },
          { scale: 1, duration: 0.5, ease: "elastic.out(1,.4)" },
        );
      const leave = () => {
        node.style.opacity = "0";
      };
      addEventListener("pointermove", move, { passive: true });
      addEventListener("pointerdown", click);
      document.addEventListener("pointerleave", leave);
      cleanup = () => {
        removeEventListener("pointermove", move);
        removeEventListener("pointerdown", click);
        document.removeEventListener("pointerleave", leave);
        gsap.killTweensOf(node);
        node.style.opacity = "0";
      };
    };
    setup();
    media.addEventListener("change", setup);
    return () => {
      cleanup();
      media.removeEventListener("change", setup);
    };
  }, []);
  return (
    <div className="creative-cursor" ref={ref} aria-hidden="true">
      <div className="cursor-ring">
        <span>VIEW ↗</span>
      </div>
      <i />
    </div>
  );
}
