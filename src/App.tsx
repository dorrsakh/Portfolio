import { useEffect, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Menu,
  Github,
  Linkedin,
  X,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SmoothScroll } from "./components/SmoothScroll";
import { ContactForm } from "./components/ContactForm";
import { CreativeCursor } from "./components/CreativeCursor";
import { BackToTop } from "./components/BackToTop";
import { TechnologyKeyboard } from "./components/TechnologyKeyboard";
import { WorkCard } from "./components/WorkCard";
import { ProjectDialog } from "./components/ProjectDialog";
import { work, tools, career, type Work } from "./data/workbench";
gsap.registerPlugin(ScrollTrigger);
export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const [projectOpener, setProjectOpener] = useState<HTMLElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [selected, setSelected] = useState<string | null>(null),
    [project, setProject] = useState<Work | null>(null),
    [menu, setMenu] = useState(false),
    [copied, setCopied] = useState(false),
    [stop, setStop] = useState(0);
  const tool = tools.find((t) => t.id === selected);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from(".hero-copy > *", {
          y: 25,
          opacity: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: "power3.out",
        });
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
          gsap.from(el, {
            y: 65,
            opacity: 0,
            filter: "blur(8px)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          }),
        );
        gsap.utils.toArray<HTMLElement>(".section-heading h2").forEach((el) =>
          gsap.from(el, {
            yPercent: 35,
            opacity: 0,
            filter: "blur(12px)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }),
        );
        gsap.to(".hero-copy", {
          y: 65,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }, root);
      return () => ctx.revert();
    });
    return () => {
      mm.revert();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    if (!menu) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);
  async function copy() {
    try {
      await navigator.clipboard.writeText("dorrsakhalili@gmail.com");
      setCopied(true);
      timer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      location.href = "mailto:dorrsakhalili@gmail.com";
    }
  }
  return (
    <SmoothScroll>
      <div
        className="portfolio"
        ref={root}
        onPointerMove={(e) => {
          root.current?.style.setProperty("--pointer-x", `${e.clientX}px`);
          root.current?.style.setProperty("--pointer-y", `${e.clientY}px`);
        }}
      >
        <div className="ambient-light" aria-hidden="true" />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <a className="wordmark" href="#home" aria-label="Dorsa Khalili home">
            dorsa<span>.</span>
          </a>
          <nav
            id="navigation"
            aria-label="Main navigation"
            className={menu ? "open" : ""}
          >
            {[
              ["work", "Work"],
              ["stack", "Stack"],
              ["experience", "Journey"],
              ["contact", "Contact"],
            ].map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
                {label}
              </a>
            ))}
          </nav>
          <a className="header-resume" href="/Dorsa-Khalili-CV.pdf" download>
            Résumé <Download size={14} />
          </a>
          <button
            id="menu-toggle"
            className="icon-button menu-toggle"
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            aria-controls="navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </header>
        <main id="main">
          <section
            className="hero shell"
            id="home"
            tabIndex={-1}
            aria-labelledby="hero-heading"
          >
            <div className="hero-copy">
              <p className="eyebrow">
                <i className="status-light" /> FRONTEND & SOFTWARE ENGINEER
              </p>
              <h1 id="hero-heading">
                Dorsa
                <br />
                Khalili<span>.</span>
              </h1>
              <p className="hero-description">
                Thoughtful interfaces.
                <br />A little play.
              </p>
              <div className="hero-actions">
                <a className="primary-link" href="#work">
                  Selected work <ArrowDownRight size={18} />
                </a>
              </div>
              <div className="hero-socials" aria-label="Social accounts">
                <a
                  href="https://github.com/dorrsakh"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Dorsa on GitHub"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://linkedin.com/in/dorsa-khalili"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Dorsa on LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
            <div className="hero-keyboard-anchor" aria-hidden="true" />
          </section>
          <TechnologyKeyboard selected={selected} onSelect={setSelected} />
          <section
            className="work-section shell"
            id="work"
            aria-labelledby="work-heading"
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">WORK</p>
                <h2 id="work-heading">
                  Made to be used<span>.</span>
                </h2>
              </div>
              <p className="work-filter" role="status">
                {tool
                  ? tool.projects.length
                    ? `${tool.name} → ${tool.projects.length} projects highlighted`
                    : `${tool.name} · Part of my workflow`
                  : "Selected projects."}
              </p>
            </div>
            <div className="work-grid">
              {work.map((p) => (
                <WorkCard
                  key={p.id}
                  project={p}
                  match={
                    tool?.projects.length
                      ? tool.projects.includes(p.id)
                      : undefined
                  }
                  onOpen={(opener) => {
                    setProjectOpener(opener);
                    setProject(p);
                  }}
                />
              ))}
            </div>
            <a
              className="text-link more-work"
              href="https://github.com/dorrsakh"
              target="_blank"
              rel="noreferrer"
            >
              More on GitHub <ArrowUpRight size={16} />
            </a>
          </section>
          <section
            className="journey shell"
            id="experience"
            aria-labelledby="journey-heading"
            data-reveal
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">JOURNEY</p>
                <h2 id="journey-heading">
                  Always building<span>.</span>
                </h2>
              </div>
            </div>
            <div
              className="career-path"
              role="group"
              aria-label="Career journey"
            >
              {career.map((c, i) => (
                <button
                  key={c.company}
                  className="career-stop"
                  aria-pressed={stop === i}
                  onClick={() => setStop(i)}
                >
                  <span className="career-date">{c.date}</span>
                  <span className="career-node">
                    <i />
                  </span>
                  <strong>{c.company}</strong>
                  <span>{c.role}</span>
                </button>
              ))}
            </div>
            <div className="career-context" aria-live="polite">
              <span>0{stop + 1}</span>
              <p key={stop}>{career[stop].note}</p>
              <a className="quiet-link" href="/Dorsa-Khalili-CV.pdf" download>
                Full résumé <ArrowUpRight size={15} />
              </a>
            </div>
          </section>
          <section
            className="contact shell"
            id="contact"
            aria-labelledby="contact-heading"
            data-reveal
          >
            <p className="eyebrow">SAY HELLO</p>
            <div className="contact-layout">
              <div className="contact-intro">
                <div className="contact-row">
                  <h2 id="contact-heading">
                    Let’s make
                    <br /> it <em>click.</em>
                  </h2>
                  <a
                    className="contact-arrow"
                    href="mailto:dorrsakhalili@gmail.com"
                    aria-label="Email Dorsa"
                  >
                    <ArrowUpRight />
                  </a>
                </div>
                <div className="contact-bottom">
                  <div className="email-line">
                    <a href="mailto:dorrsakhalili@gmail.com">
                      dorrsakhalili@gmail.com
                    </a>
                    <button
                      className="icon-button"
                      aria-label={
                        copied ? "Email copied" : "Copy email address"
                      }
                      onClick={copy}
                    >
                      {copied ? <Check size={17} /> : <Copy size={17} />}
                    </button>
                    <span className="sr-only" role="status">
                      {copied ? "Email address copied" : ""}
                    </span>
                  </div>
                  <div className="social-links">
                    <a
                      href="https://github.com/dorrsakh"
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub ↗
                    </a>
                    <a
                      href="https://linkedin.com/in/dorsa-khalili"
                      target="_blank"
                      rel="noreferrer"
                    >
                      LinkedIn ↗
                    </a>
                  </div>
                </div>
              </div>
              <ContactForm />
            </div>
          </section>
        </main>
        <footer className="shell">
          <span>Dorsa Khalili © {new Date().getFullYear()}</span>
          <a href="https://nareshkhatri.dev/" target="_blank" rel="noreferrer">
            Built with Naresh’s keyboard ↗
          </a>
        </footer>
        <BackToTop />
        <CreativeCursor />
        {project && (
          <ProjectDialog
            project={project}
            returnFocus={projectOpener}
            onClose={() => setProject(null)}
          />
        )}
      </div>
    </SmoothScroll>
  );
}
