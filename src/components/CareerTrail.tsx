import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { career } from "../data/workbench";
const stops = [...career].reverse();
export function CareerTrail() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const path =
          root.current?.querySelector<SVGPathElement>(".trail-progress");
        if (path) {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: ".trail-cards",
              start: "top 70%",
              end: "bottom 65%",
              scrub: 0.7,
            },
          });
        }
        gsap.utils.toArray<HTMLElement>(".trail-card").forEach((card, i) => {
          gsap.from(card, {
            y: 45,
            rotation: i % 2 ? -3 : 3,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 92%", once: true },
          });
          ScrollTrigger.create({
            trigger: card,
            start: "top 58%",
            end: "bottom 30%",
            onEnter: () => setActive(i),
            onEnterBack: () => setActive(i),
          });
        });
      }, root);
      return () => context.revert();
    });
    return () => mm.revert();
  }, []);
  return (
    <section
      className="career-trail shell"
      id="experience"
      ref={root}
      aria-labelledby="journey-heading"
    >
      <div className="trail-heading">
        <p className="eyebrow">JOURNEY</p>
        <h2 id="journey-heading">
          The path
          <br /> so far<span>.</span>
        </h2>
        <a className="quiet-link" href="/Dorsa-Khalili-CV.pdf" download>
          Full résumé <ArrowUpRight size={15} />
        </a>
        <span className="trail-counter" aria-hidden="true">
          0{active + 1}
          <small> / 04</small>
        </span>
      </div>
      <div className="trail-cards" role="group" aria-label="Career journey">
        <svg
          className="trail-route"
          viewBox="0 0 600 950"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M170 70C170 200 470 150 450 320S110 420 160 560S500 670 435 875"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
          <path
            className="trail-progress"
            d="M170 70C170 200 470 150 450 320S110 420 160 560S500 670 435 875"
            stroke="var(--coral)"
            strokeWidth="2"
          />
        </svg>
        {stops.map((item, i) => (
          <button
            className="trail-card"
            data-active={active === i}
            aria-pressed={active === i}
            key={item.company}
            onClick={() => setActive(i)}
          >
            <span className="trail-card-top">
              <span className="trail-number">0{i + 1}</span>
              <span className="trail-year">{item.date}</span>
              <ArrowUpRight size={17} />
            </span>
            <strong>{item.company}</strong>
            <span className="trail-role">{item.role}</span>
            {active === i && (
              <span className="career-context" aria-live="polite">
                {item.note}
              </span>
            )}
            <span className="trail-pin" aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}
