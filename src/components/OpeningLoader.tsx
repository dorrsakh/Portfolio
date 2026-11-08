import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
export function OpeningLoader({
  sceneReady,
  onComplete,
}: {
  sceneReady: boolean;
  onComplete: () => void;
}) {
  const root = useRef<HTMLDivElement>(null),
    exiting = useRef(false),
    timeline = useRef<gsap.core.Timeline | null>(null);
  const [fontsReady, setFontsReady] = useState(false),
    [minimumReady, setMinimumReady] = useState(false);
  const complete = useRef(onComplete);
  useEffect(() => {
    complete.current = onComplete;
  }, [onComplete]);
  const finish = useCallback(() => {
    if (exiting.current) return;
    exiting.current = true;
    window.dispatchEvent(new Event("portfolio-open"));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      complete.current();
      return;
    }
    timeline.current = gsap
      .timeline({ onComplete: () => complete.current() })
      .to(
        ".opening-key",
        {
          y: -42,
          rotationX: 35,
          opacity: 0,
          duration: 0.35,
          stagger: 0.035,
          ease: "power2.in",
        },
        0,
      )
      .to(".opening-details", { opacity: 0, y: -10, duration: 0.25 }, 0)
      .to(
        root.current,
        {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.72,
          ease: "power4.inOut",
        },
        0.12,
      );
  }, []);
  useEffect(() => {
    document.getElementById("boot-screen")?.remove();
    let disposed = false;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.current?.focus({ preventScroll: true });
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minimum = setTimeout(() => setMinimumReady(true), reduced ? 0 : 850);
    const deadline = setTimeout(finish, 6000);
    void Promise.allSettled([
      document.fonts.load("500 16px Space"),
      document.fonts.load("400 16px Archivo"),
    ]).then(() => {
      if (!disposed) setFontsReady(true);
    });
    const key = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        const controls =
          root.current?.querySelectorAll<HTMLElement>("a,button");
        const first = controls?.[0],
          last = controls?.[controls.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === root.current)
        ) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
      if (event.key === "Escape" || event.key === "Enter") {
        event.preventDefault();
        finish();
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      disposed = true;
      clearTimeout(minimum);
      clearTimeout(deadline);
      window.removeEventListener("keydown", key);
      document.body.style.overflow = previous;
      timeline.current?.kill();
    };
  }, [finish]);
  useEffect(() => {
    if (fontsReady && sceneReady && minimumReady) finish();
  }, [fontsReady, sceneReady, minimumReady, finish]);
  const progress = Number(fontsReady) + Number(sceneReady);
  return (
    <div
      ref={root}
      className="opening-loader"
      role="dialog"
      aria-modal="true"
      aria-label="Opening Dorsa’s portfolio"
      tabIndex={-1}
      data-lenis-prevent
    >
      <a
        className="opening-wordmark"
        href="#home"
        onClick={(event) => {
          event.preventDefault();
          finish();
        }}
        aria-label="Enter Dorsa’s portfolio"
      >
        dorsa<span>.</span>
      </a>
      <div className="opening-center">
        <div className="opening-keyboard" aria-hidden="true">
          {["D", "O", "R", "S", "A", "↵"].map((letter, index) => (
            <span
              className="opening-key"
              style={{ "--key-index": index } as React.CSSProperties}
              key={letter}
            >
              <span>{letter}</span>
            </span>
          ))}
        </div>
        <div className="opening-details">
          <p className="opening-title">A little play. A lot of care.</p>
          <div
            className="opening-progress"
            role="progressbar"
            aria-label="Portfolio preparation"
            aria-valuemin={0}
            aria-valuemax={2}
            aria-valuenow={progress}
          >
            <span style={{ transform: `scaleX(${progress / 2})` }} />
          </div>
          <p className="opening-status" role="status">
            {progress === 2
              ? "Your workbench is ready."
              : fontsReady
                ? "Preparing the keyboard…"
                : "Setting the type…"}
          </p>
        </div>
      </div>
      <button className="opening-enter opening-details" onClick={finish}>
        Enter portfolio <ArrowUpRight size={15} />
      </button>
      <span className="opening-corner opening-details" aria-hidden="true">
        DORSA KHALILI / FRONTEND ENGINEER
      </span>
    </div>
  );
}
