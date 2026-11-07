import { useEffect } from "react";
import type { ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup = () => {};
    const setup = () => {
      cleanup();
      if (media.matches || window.matchMedia("(pointer: coarse)").matches) {
        cleanup = () => {};
        return;
      }
      const lenis = new Lenis({
        duration: 0.85,
        smoothWheel: true,
        anchors: true,
        prevent: (node) => node.hasAttribute("data-lenis-prevent"),
      });
      const frame = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(frame);
      cleanup = () => {
        gsap.ticker.remove(frame);
        lenis.destroy();
      };
    };
    setup();
    media.addEventListener("change", setup);
    return () => {
      cleanup();
      media.removeEventListener("change", setup);
    };
  }, []);
  return children;
}
