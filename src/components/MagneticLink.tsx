import { useEffect, useRef } from "react";
import type { AnchorHTMLAttributes } from "react";
import { gsap } from "gsap";
export function MagneticLink({
  children,
  disabledMotion = false,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { disabledMotion?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (
      !el ||
      disabledMotion ||
      !matchMedia(
        "(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)",
      ).matches
    )
      return;
    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" }),
      y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      x((e.clientX - b.left - b.width / 2) * 0.13);
      y((e.clientY - b.top - b.height / 2) * 0.18);
    };
    const leave = () => {
      x(0);
      y(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("blur", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("blur", leave);
      gsap.killTweensOf(el);
      el.style.transform = "";
    };
  }, [disabledMotion]);
  return (
    <a ref={ref} {...props}>
      {children}
    </a>
  );
}
