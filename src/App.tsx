import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Github,
  Linkedin,
  Menu,
  Pause,
  Play,
  X,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapters, projects } from "./data/portfolio";
import { SmoothScroll } from "./components/SmoothScroll";
import { CaseStudy } from "./components/CaseStudy";
import { Marquee } from "./components/motion/marquee";
import { AmbientBackground } from "./components/AmbientBackground";
import { MagneticLink } from "./components/MagneticLink";
import { GamePreview, CaloriePreview } from "./components/ProjectPreviews";
import { CareerJourney } from "./components/CareerJourney";
import { SkillPlayground } from "./components/SkillPlayground";
const InterfaceScene = lazy(() => import("./components/InterfaceScene"));
gsap.registerPlugin(ScrollTrigger);

function App() {
  const root = useRef<HTMLDivElement>(null),
    timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [menuOpen, setMenuOpen] = useState(false),
    [chapter, setChapter] = useState(0),
    [caseOpen, setCaseOpen] = useState(false),
    [copied, setCopied] = useState(false),
    [active, setActive] = useState("home"),
    [marqueePaused, setMarqueePaused] = useState(false),
    [ambientPaused, setAmbientPaused] = useState(false);
  const current = chapters[chapter];
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".hero-line > span",
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.2,
            stagger: 0.12,
            ease: "power4.out",
            delay: 0.1,
          },
        );
        gsap.fromTo(
          ".hero-intro,.hero-description,.hero-actions,.hero-bottom",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: 0.6,
            stagger: 0.1,
            ease: "power3.out",
          },
        );
        gsap.to(".hero-type", {
          y: 95,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(".hero-art", {
          y: 135,
          rotation: 7,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
          gsap.fromTo(
            el,
            { y: 36, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 91%", once: true },
            },
          ),
        );
        gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((el) =>
          gsap.fromTo(
            el,
            { scale: 0.94, y: 35, rotateX: 4 },
            {
              scale: 1,
              y: 0,
              rotateX: 0,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "top 24%",
                scrub: 1,
              },
            },
          ),
        );
        gsap.utils.toArray<HTMLElement>("[data-line]").forEach((el) =>
          gsap.fromTo(
            el,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 95%", once: true },
            },
          ),
        );
        gsap.fromTo(
          ".about-statement span",
          { color: "#85858f" },
          {
            color: "#f0efe9",
            stagger: 0.13,
            ease: "none",
            scrollTrigger: {
              trigger: ".about-statement",
              start: "top 82%",
              end: "bottom 40%",
              scrub: 1,
            },
          },
        );
        gsap.fromTo(
          ".contact-heading",
          { y: 60 },
          {
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: ".contact",
              start: "top bottom",
              end: "top 30%",
              scrub: 1,
            },
          },
        );
      }, root);
      return () => ctx.revert();
    });
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: "-15% 0px -60% 0px" },
    );
    root.current
      ?.querySelectorAll("main > section[id]")
      .forEach((el) => observer.observe(el));
    const progress = () => {
      const total = document.documentElement.scrollHeight - innerHeight;
      document.documentElement.style.setProperty(
        "--scroll-progress",
        String(total > 0 ? scrollY / total : 0),
      );
    };
    window.addEventListener("scroll", progress, { passive: true });
    progress();
    return () => {
      media.revert();
      observer.disconnect();
      window.removeEventListener("scroll", progress);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    if (
      !matchMedia(
        "(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)",
      ).matches
    )
      return;
    const cleanups: Array<() => void> = [];
    root.current?.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
      const move = (e: PointerEvent) => {
        if (el.contains(document.activeElement)) return;
        const b = el.getBoundingClientRect();
        gsap.to(el, {
          rotationX: (-(e.clientY - b.top - b.height / 2) / b.height) * 5,
          rotationY: ((e.clientX - b.left - b.width / 2) / b.width) * 6,
          transformPerspective: 1100,
          duration: 0.55,
          ease: "power3.out",
        });
      };
      const leave = () =>
        gsap.to(el, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.65,
          ease: "power3.out",
        });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
        gsap.killTweensOf(el);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [menuOpen]);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText("dorrsakhalili@gmail.com");
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      location.href = "mailto:dorrsakhalili@gmail.com";
    }
  }
  function chapterKey(event: React.KeyboardEvent, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % 4;
    else if (event.key === "ArrowLeft") next = (index + 3) % 4;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 3;
    else return;
    event.preventDefault();
    setChapter(next);
    document.getElementById(`chapter-tab-${next}`)?.focus();
  }
  return (
    <SmoothScroll>
      <div ref={root} className="portfolio">
        <AmbientBackground paused={ambientPaused} />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <div className="header-inner">
            <a
              className="wordmark"
              href="#home"
              aria-label="Dorsa Khalili home"
            >
              dorsa<span>.</span>
            </a>
            <nav
              id="main-navigation"
              className={menuOpen ? "main-nav is-open" : "main-nav"}
              aria-label="Main navigation"
            >
              {[
                ["work", "Work"],
                ["about", "About"],
                ["experience", "Experience"],
              ].map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  aria-current={active === id ? "location" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              ))}
              <MagneticLink
                href="#contact"
                className="nav-contact"
                onClick={() => setMenuOpen(false)}
              >
                Let’s talk <ArrowUpRight size={15} />
              </MagneticLink>
            </nav>
            <button
              className="icon-button menu-toggle"
              id="menu-toggle"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="main-navigation"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
          <div className="reading-progress" aria-hidden="true" />
        </header>
        <main id="main">
          <section
            className="hero section-shell"
            id="home"
            aria-labelledby="hero-heading"
          >
            <div className="hero-composition">
              <div className="hero-type">
                <p className="hero-intro">
                  <span className="status-dot" /> Dorsa Khalili{" "}
                  <span className="hero-role">
                    Frontend / Software Engineer
                  </span>
                </p>
                <h1 id="hero-heading">
                  <span className="hero-line">
                    <span>Good interfaces.</span>
                  </span>
                  <span className="hero-line">
                    <span>
                      A little <em>feeling.</em>
                    </span>
                  </span>
                </h1>
                <p className="hero-description">
                  I build thoughtful web experiences.
                  <br />
                  Clear in purpose. Playful in the details.
                </p>
                <div className="hero-actions">
                  <MagneticLink className="primary-link" href="#work">
                    Selected work <ArrowDownRight size={19} />
                  </MagneticLink>
                  <a
                    className="quiet-link"
                    href="/Dorsa-Khalili-CV.pdf"
                    download
                  >
                    Résumé <Download size={14} />
                  </a>
                </div>
              </div>
              <div className="hero-art">
                <Suspense
                  fallback={
                    <div className="sculpture-fallback" aria-hidden="true" />
                  }
                >
                  <InterfaceScene paused={ambientPaused} />
                </Suspense>
              </div>
            </div>
            <div className="hero-bottom">
              <span>
                Based in Tehran. Building at <a href="#work">Rastaar ↗</a>
              </span>
              <span className="hero-play-hint">
                Move your cursor. Scroll a little. Explore.
              </span>
              <a href="#work" aria-label="Scroll to selected work">
                <ArrowDown size={18} />
              </a>
            </div>
          </section>
          <div className="capability-strip" data-paused={marqueePaused}>
            <Marquee
              label="Core technologies"
              className="technology-marquee"
              speed={36}
              gap="3rem"
            >
              {[
                "React",
                "TypeScript",
                "Next.js",
                "Thoughtful UI/UX",
                "Playwright",
                "AI-assisted development",
              ].map((item) => (
                <span className="technology-item" key={item}>
                  {item}
                  <span className="strip-dot" aria-hidden="true" />
                </span>
              ))}
            </Marquee>
            <button
              className="icon-button marquee-control"
              aria-label={
                marqueePaused
                  ? "Resume technology marquee"
                  : "Pause technology marquee"
              }
              aria-pressed={marqueePaused}
              onClick={() => setMarqueePaused(!marqueePaused)}
            >
              {marqueePaused ? <Play size={13} /> : <Pause size={13} />}
            </button>
          </div>
          <section
            className="work section-shell"
            id="work"
            aria-labelledby="work-heading"
          >
            <div className="section-heading" data-reveal>
              <div>
                <span className="section-index">01 / Work</span>
                <h2 id="work-heading">
                  A few things
                  <br />
                  I’ve helped bring to life.
                </h2>
              </div>
              <p>
                Real products.
                <br />
                Thoughtful interactions.
              </p>
            </div>
            <article className="featured-project">
              <div className="project-heading" data-reveal>
                <div>
                  <h3>
                    Dreamaan<span className="project-period">.</span>
                  </h3>
                  <p>AI-powered creative tools · Rastaar</p>
                </div>
                <span className="wip-badge">
                  <span /> Redesign in progress
                </span>
              </div>
              <div className="project-media-wrap" data-depth>
                <button
                  className="screenshot-frame"
                  onClick={() => setCaseOpen(true)}
                  aria-label={`Explore Dreamaan ${current.label} preview`}
                >
                  <span className="project-screen">
                    <img
                      key={current.image}
                      src={current.image}
                      alt={current.alt}
                      loading="lazy"
                      width="1440"
                      height="960"
                    />
                    <span className="screen-open">
                      A closer look <ArrowUpRight size={18} />
                    </span>
                  </span>
                </button>
                <div
                  className="chapter-tabs"
                  role="tablist"
                  aria-label="Dreamaan feature chapters"
                >
                  {chapters.map((item, index) => (
                    <button
                      key={item.id}
                      id={`chapter-tab-${index}`}
                      role="tab"
                      aria-controls="chapter-panel"
                      aria-selected={chapter === index}
                      tabIndex={chapter === index ? 0 : -1}
                      onClick={() => setChapter(index)}
                      onKeyDown={(event) => chapterKey(event, index)}
                    >
                      {item.short}
                    </button>
                  ))}
                </div>
              </div>
              <div className="project-caption" data-reveal>
                <div
                  className="chapter-panel"
                  id="chapter-panel"
                  role="tabpanel"
                  aria-labelledby={`chapter-tab-${chapter}`}
                  tabIndex={0}
                >
                  <h4>{current.title}</h4>
                  <p>{current.description}</p>
                </div>
                <button
                  className="text-link"
                  aria-label="Open Dreamaan case study"
                  onClick={() => setCaseOpen(true)}
                >
                  Explore project <ArrowUpRight size={17} />
                </button>
              </div>
              <div className="section-rule" data-line />
            </article>
            <div className="other-work">
              {projects.map((project, index) => (
                <article
                  className="small-project"
                  key={project.name}
                  data-reveal
                >
                  {index === 0 ? <GamePreview /> : <CaloriePreview />}
                  <div className="small-project-info">
                    <div>
                      <h3>
                        <a href={project.url} target="_blank" rel="noreferrer">
                          {project.name} <ArrowUpRight size={19} />
                        </a>
                      </h3>
                      <span>
                        {project.category.split(" / ")[0].toLowerCase()}
                      </span>
                    </div>
                    <p>{project.description}</p>
                    <div className="tech-tags">
                      {project.stack.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <a
              className="text-link github-more"
              href="https://github.com/dorrsakh"
              target="_blank"
              rel="noreferrer"
            >
              More experiments on GitHub <ArrowUpRight size={16} />
            </a>
          </section>
          <section
            className="about section-shell"
            id="about"
            aria-labelledby="about-heading"
          >
            <div className="section-rule" data-line />
            <div className="about-grid">
              <div data-reveal>
                <span className="section-index">02 / A little about me</span>
                <h2 id="about-heading">
                  An engineer’s mind.
                  <br />
                  An eye for the details.
                </h2>
                <p className="about-statement">
                  {"Curiosity builds the first version. Care makes it worth using."
                    .split(" ")
                    .map((word, index) => (
                      <span key={index}>{word} </span>
                    ))}
                </p>
              </div>
              <div className="about-copy" data-reveal>
                <p>
                  I’m Dorsa, a frontend and software engineer working where
                  design meets development.
                </p>
                <p>
                  I build with React, Next.js, and TypeScript. At Rastaar, I
                  help turn complex creative workflows into clear, responsive
                  interfaces.
                </p>
                <p>
                  My process includes API integration, automated testing, and
                  AI-assisted development — with a human eye on the result.
                </p>
                <a className="text-link" href="/Dorsa-Khalili-CV.pdf" download>
                  The longer version <Download size={15} />
                </a>
              </div>
            </div>
            <SkillPlayground />
          </section>
          <CareerJourney onExplore={() => setCaseOpen(true)} />
          <section
            className="contact section-shell"
            id="contact"
            aria-labelledby="contact-heading"
          >
            <div className="section-rule" data-line />
            <div className="contact-heading">
              <span className="section-index">04 / Something in mind?</span>
              <h2 id="contact-heading">
                Let’s make
                <br />
                something <em>good.</em>
              </h2>
            </div>
            <div className="contact-bottom">
              <div>
                <p>
                  A thoughtful product. A new collaboration.
                  <br />
                  Or just a good conversation.
                </p>
                <div className="email-line">
                  <MagneticLink href="mailto:dorrsakhalili@gmail.com">
                    dorrsakhalili@gmail.com <ArrowUpRight size={20} />
                  </MagneticLink>
                  <button
                    className="icon-button"
                    aria-label={copied ? "Email copied" : "Copy email address"}
                    onClick={copyEmail}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <span className="sr-only" role="status">
                    {copied ? "Email address copied" : ""}
                  </span>
                </div>
              </div>
              <div className="social-links">
                <a
                  href="https://github.com/dorrsakh"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={15} /> GitHub <ArrowUpRight size={14} />
                </a>
                <a
                  href="https://linkedin.com/in/dorsa-khalili"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Linkedin size={15} /> LinkedIn <ArrowUpRight size={14} />
                </a>
                <a href="/Dorsa-Khalili-CV.pdf" download>
                  <Download size={15} /> Résumé
                </a>
              </div>
            </div>
          </section>
        </main>
        <footer className="site-footer section-shell">
          <span>Dorsa Khalili © {new Date().getFullYear()}</span>
          <span>Built with curiosity & care.</span>
          <a href="#home">
            Back to top <ArrowUpRight size={14} />
          </a>
        </footer>
        <button
          className="ambient-control"
          aria-label={
            ambientPaused ? "Resume ambient motion" : "Pause ambient motion"
          }
          aria-pressed={ambientPaused}
          onClick={() => setAmbientPaused(!ambientPaused)}
        >
          {ambientPaused ? <Play size={12} /> : <Pause size={12} />}
          <span>Motion {ambientPaused ? "off" : "on"}</span>
        </button>
        {caseOpen && (
          <CaseStudy
            onClose={() => setCaseOpen(false)}
            initialChapter={chapter}
            onChapter={setChapter}
          />
        )}
      </div>
    </SmoothScroll>
  );
}
export default App;
