import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { experiences } from "../data/portfolio";

const chapters = [
  {
    id: "rastaar",
    year: "2026",
    theme: "Creative workflows, made clearer.",
    context: "AI & creative tools",
    points: [
      "Build responsive interfaces and connect them to product APIs.",
      "Debug, test, and validate changes, including AI-assisted work.",
    ],
    tools: [
      { name: "React", logo: "react" },
      { name: "TypeScript", logo: "typescript" },
      { name: "Playwright", logo: "playwright" },
    ],
  },
  {
    id: "pardik",
    year: "2024",
    theme: "Connected homes. Considered interfaces.",
    context: "Smart home experiences",
    points: [
      "Develop scalable web interfaces with React, Next.js, and TypeScript.",
      "Refine performance and responsive behavior alongside cross-functional teams.",
    ],
    tools: [
      { name: "React", logo: "react" },
      { name: "Next.js", logo: "nextjs" },
      { name: "TypeScript", logo: "typescript" },
    ],
  },
  {
    id: "bluprint",
    year: "2024",
    theme: "From layouts to working products.",
    context: "Frontend foundations",
    points: [
      "Implement responsive, maintainable interface components.",
      "Connect frontend applications to backend services with attention to UX.",
    ],
    tools: [],
  },
  {
    id: "dash",
    year: "2021",
    theme: "Making the fundamentals click.",
    context: "Teaching & mentoring",
    points: [
      "Teach foundational Python through structured learning materials.",
      "Mentor beginner students as they build their understanding.",
    ],
    tools: [{ name: "Python", logo: "python" }],
  },
];
export function CareerJourney({ onExplore }: { onExplore: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const articles = Array.from(
      section.querySelectorAll<HTMLElement>(".career-chapter"),
    );
    let frame = 0;
    function update() {
      frame = 0;
      const position = innerHeight * 0.38;
      const bounds = articles.map((a) => a.getBoundingClientRect());
      let nearest = 0;
      bounds.forEach((b, i) => {
        if (b.top <= position) nearest = i;
      });
      setActive(nearest);
      const span = bounds[bounds.length - 1].top - bounds[0].top;
      const progress = Math.max(
        0,
        Math.min(1, (position - bounds[0].top) / span),
      );
      section!.style.setProperty("--career-progress", String(progress));
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, []);
  useEffect(() => {
    if (!matchMedia("(max-width: 700px)").matches) return;
    const nav = ref.current?.querySelector<HTMLElement>(".career-stops");
    const stop = nav?.querySelector<HTMLElement>("[aria-current]");
    if (nav && stop)
      nav.scrollLeft =
        stop.offsetLeft - (nav.clientWidth - stop.offsetWidth) / 2;
  }, [active]);
  return (
    <section
      ref={ref}
      className="career section-shell"
      id="experience"
      aria-labelledby="experience-heading"
    >
      <div className="section-rule" data-line />
      <div className="career-heading" data-reveal>
        <div>
          <span className="section-index">03 / Along the way</span>
          <h2 id="experience-heading">
            A few chapters.
            <br />
            <span>Still writing the next.</span>
          </h2>
        </div>
        <p>
          From teaching the fundamentals
          <br />
          to building creative tools.
        </p>
      </div>
      <div className="career-layout">
        <aside className="career-rail" aria-label="Career journey">
          <div className="career-year" aria-hidden="true" key={active}>
            <span>{chapters[active].year}</span>
            <small>{chapters[active].context}</small>
          </div>
          <nav className="career-stops" aria-label="Career chapters">
            <svg
              className="career-route"
              viewBox="0 0 28 280"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path className="career-route-base" d="M14 35V245" />
              <path
                className="career-route-progress"
                d="M14 35V245"
                pathLength="1"
              />
            </svg>
            {experiences.map((item, i) => (
              <a
                key={item.company}
                href={`#career-${chapters[i].id}`}
                onClick={async (event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  const target = document.getElementById(
                    `career-${chapters[i].id}`,
                  );
                  if (!target) return;
                  history.replaceState(null, "", `#${target.id}`);
                  await document.fonts.ready;
                  let top = 0;
                  for (
                    let node: HTMLElement | null = target;
                    node;
                    node = node.offsetParent as HTMLElement | null
                  )
                    top += node.offsetTop;
                  window.scrollTo({
                    top:
                      top -
                      (matchMedia("(max-width: 700px)").matches ? 160 : 120),
                    behavior: matchMedia("(prefers-reduced-motion: reduce)")
                      .matches
                      ? "instant"
                      : "smooth",
                  });
                  target.focus({ preventScroll: true });
                }}
                aria-current={active === i ? "step" : undefined}
              >
                <span className="career-stop-dot" />
                <span>
                  <strong>{item.company}</strong>
                  <small>
                    {i === 0 ? "Now" : chapters[i].year}{" "}
                    <span aria-hidden="true">↗</span>
                  </small>
                </span>
              </a>
            ))}
          </nav>
          <span className="career-rail-hint">
            Scroll to follow the story <ArrowDownRight size={13} />
          </span>
        </aside>
        <div className="career-chapters">
          {experiences.map((item, i) => (
            <article
              key={item.company}
              id={`career-${chapters[i].id}`}
              className={`career-chapter ${active === i ? "is-current" : ""}`}
              tabIndex={-1}
              aria-labelledby={`career-title-${i}`}
            >
              <div className="career-chapter-top">
                <span>
                  Chapter {String(i + 1).padStart(2, "0")} /{" "}
                  {chapters[i].context}
                </span>
                <span className={i === 0 ? "career-current" : ""}>
                  {i === 0 ? "Present" : "Previous"}
                </span>
              </div>
              <div className="career-role" data-reveal>
                <div>
                  <h3 id={`career-title-${i}`}>{item.company}</h3>
                  <p>{item.role}</p>
                </div>
                <time>{item.date}</time>
              </div>
              <h4>{chapters[i].theme}</h4>
              <ul>
                {chapters[i].points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <div className="career-tools">
                {chapters[i].tools.length
                  ? chapters[i].tools.map((tool) => (
                      <span key={tool.name}>
                        <img
                          src={`/logos/${tool.logo}.svg`}
                          className={
                            tool.logo === "nextjs"
                              ? "brand-logo-invert"
                              : undefined
                          }
                          alt=""
                          width="22"
                          height="22"
                        />
                        {tool.name}
                      </span>
                    ))
                  : item.stack.map((tool) => <span key={tool}>{tool}</span>)}
              </div>
              {i === 0 && (
                <button className="career-project" onClick={onExplore}>
                  <img
                    src="/media/dreamaan-assets.webp"
                    alt=""
                    loading="lazy"
                    width="96"
                    height="60"
                  />
                  <span>
                    <small>A closer look at the work</small>
                    <strong>
                      Explore Dreamaan <ArrowUpRight size={16} />
                    </strong>
                  </span>
                </button>
              )}
            </article>
          ))}
        </div>
      </div>
      <div className="career-end">
        <span>More to learn. More to make.</span>
        <a href="#contact">
          The next chapter? <ArrowUpRight size={15} />
        </a>
      </div>
    </section>
  );
}
