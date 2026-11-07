import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Menu,
  MoveUpRight,
  Plus,
  Pause,
  Play,
  X,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapters, experiences, projects } from "./data/portfolio";
import { SmoothScroll } from "./components/SmoothScroll";
import { CaseStudy } from "./components/CaseStudy";
import { Marquee } from "./components/motion/marquee";
const InterfaceScene = lazy(() => import("./components/InterfaceScene"));
gsap.registerPlugin(ScrollTrigger);
function App() {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false),
    [chapter, setChapter] = useState(0),
    [caseOpen, setCaseOpen] = useState(false),
    [copied, setCopied] = useState(false),
    [active, setActive] = useState("home");
  const [marqueePaused, setMarqueePaused] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
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
            duration: 1.1,
            stagger: 0.12,
            ease: "power4.out",
            delay: 0.1,
          },
        );
        gsap.fromTo(
          ".hero-intro,.hero-bottom",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.5, stagger: 0.1 },
        );
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) =>
          gsap.fromTo(
            el,
            { y: 28, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 94%", once: true },
            },
          ),
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
    return () => {
      media.revert();
      observer.disconnect();
      if (timer.current) clearTimeout(timer.current);
    };
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
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <a className="wordmark" href="#home" aria-label="Dorsa Khalili home">
            dorsa<span>.</span>
            <span className="wordmark-star" aria-hidden="true">
              ✳
            </span>
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
                href={`#${id}`}
                key={id}
                aria-current={active === id ? "location" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                <span className="nav-dot" />
                {label}
              </a>
            ))}
            <a
              className="nav-contact"
              href="#contact"
              onClick={() => setMenuOpen(false)}
            >
              Let’s talk <ArrowUpRight size={16} />
            </a>
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
        </header>
        <main id="main">
          <section
            className="hero section-shell"
            id="home"
            aria-labelledby="hero-heading"
          >
            <div className="hero-eyebrow">
              <span className="status-dot" /> FRONTEND / SOFTWARE ENGINEER
              <span className="hero-edition">PORTFOLIO — 2026</span>
            </div>
            <div className="hero-composition">
              <div className="hero-type">
                <p className="hero-intro">
                  Hi, I’m Dorsa Khalili{" "}
                  <span className="tiny-spark" aria-hidden="true">
                    ✳
                  </span>
                </p>
                <h1 id="hero-heading">
                  <span className="hero-line">
                    <span>Thoughtful</span>
                  </span>
                  <span className="hero-line">
                    <span>interfaces.</span>
                  </span>
                  <span className="hero-line accent-line">
                    <span>
                      Made to <i>move.</i>
                    </span>
                  </span>
                </h1>
                <div className="hero-description hero-intro">
                  <span className="small-rule" />
                  <p>
                    I turn complex ideas into intuitive web experiences. A
                    little curiosity. A lot of care. Always built for people.
                  </p>
                </div>
                <a className="pill-button hero-intro" href="#work">
                  Explore my work <ArrowDownRight size={19} />
                </a>
              </div>
              <div
                className="hero-art"
                aria-label="Interactive arrangement of interface panels"
              >
                <div className="art-grid" aria-hidden="true" />
                <div className="art-orbit orbit-one" aria-hidden="true" />
                <div className="art-orbit orbit-two" aria-hidden="true" />
                <Suspense
                  fallback={
                    <div className="scene-fallback" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </div>
                  }
                >
                  <InterfaceScene />
                </Suspense>
                <a className="floating-panel panel-studio" href="#work">
                  <span className="panel-topline">
                    <span className="panel-led" /> CREATIVE STUDIO{" "}
                    <ArrowUpRight size={12} />
                  </span>
                  <div className="mini-studio-image" />
                  <span className="panel-footer">
                    An idea. A frame. A possibility.<span>↗</span>
                  </span>
                </a>
                <a className="floating-panel panel-code" href="#about">
                  <span className="code-dots">
                    <i />
                    <i />
                    <i />
                    <span>the approach.tsx</span>
                  </span>
                  <code>
                    <span className="code-purple">const</span> experience ={" "}
                    {"{"}
                    <br />
                    &nbsp; thoughtful: <span className="code-coral">true</span>,
                    <br />
                    &nbsp; builtFor:{" "}
                    <span className="code-green">'people'</span>,<br />
                    &nbsp; details: <span className="code-green">'matter'</span>
                    <br />
                    {"}"};
                  </code>
                </a>
                <div className="art-tag tag-react">
                  <span aria-hidden="true">⚛</span> React
                </div>
                <div className="art-tag tag-typescript">
                  <b>TS</b> TypeScript
                </div>
                <div className="art-coordinate" aria-hidden="true">
                  FIG. 01 — IDEAS INTO INTERFACES
                </div>
                <div className="art-hint">
                  <Plus size={12} /> Move your cursor. Follow your curiosity.
                </div>
              </div>
            </div>
            <div className="hero-bottom">
              <span>BASED IN TEHRAN, IRAN ↗</span>
              <span className="currently">
                Currently building creative tools at{" "}
                <a href="#work">
                  Rastaar <ArrowUpRight size={12} />
                </a>
              </span>
              <a className="scroll-link" href="#work">
                SCROLL TO EXPLORE <ArrowDown size={14} />
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
                  <span className="strip-spark" aria-hidden="true">
                    ✳
                  </span>
                </span>
              ))}
            </Marquee>
            <button
              type="button"
              className="icon-button marquee-control"
              aria-label={
                marqueePaused
                  ? "Resume technology marquee"
                  : "Pause technology marquee"
              }
              aria-pressed={marqueePaused}
              onClick={() => setMarqueePaused(!marqueePaused)}
            >
              {marqueePaused ? (
                <Play size={14} aria-hidden="true" />
              ) : (
                <Pause size={14} aria-hidden="true" />
              )}
            </button>
          </div>
          <section
            className="work section-shell"
            id="work"
            aria-labelledby="work-heading"
          >
            <div className="section-topline" data-reveal>
              <span className="eyebrow">01 / SELECTED WORK</span>
              <span className="quiet-label">
                A FEW THINGS I’VE PUT MY HEART INTO
              </span>
            </div>
            <div className="section-heading" data-reveal>
              <h2 id="work-heading">
                Good ideas.
                <br />
                <span className="serif-word">Real interfaces.</span>
              </h2>
              <p>
                From AI-powered creative workflows to everyday tools. A closer
                look at what I build, and how I think.
              </p>
            </div>
            <article className="featured-project" data-reveal>
              <div className="project-stage">
                <div className="stage-top">
                  <span className="project-brand">
                    <span aria-hidden="true">✳</span> Dreamaan
                  </span>
                  <span className="wip-badge">
                    <span /> REDESIGN IN PROGRESS
                  </span>
                </div>
                <button
                  className="screenshot-frame"
                  onClick={() => setCaseOpen(true)}
                  aria-label={`Explore Dreamaan ${current.label} case study`}
                >
                  <span className="browser-chrome">
                    <span className="window-dots">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span>dreamaan / {current.id}</span>
                    <ExternalLink size={11} />
                  </span>
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
                      Explore the details <ArrowUpRight size={17} />
                    </span>
                  </span>
                </button>
                <div className="stage-bottom">
                  <span>AI-POWERED CINEMATIC PRODUCTION</span>
                  <span className="stage-count">
                    0{chapter + 1} <span>/ 04</span>
                  </span>
                </div>
              </div>
              <div className="project-detail">
                <div className="project-intro">
                  <div>
                    <span className="eyebrow coral">
                      FEATURED PROJECT / RASTAAR
                    </span>
                    <h3>
                      Making room
                      <br />
                      for <i>creativity.</i>
                    </h3>
                  </div>
                  <button
                    className="round-arrow"
                    onClick={() => setCaseOpen(true)}
                    aria-label="Open Dreamaan case study"
                  >
                    <ArrowUpRight />
                  </button>
                </div>
                <p className="project-summary">
                  A creative platform for AI-driven animation and cinematic
                  production. I help make complex workflows feel clear,
                  connected, and intuitive.
                </p>
                <div
                  className="chapter-tabs"
                  role="tablist"
                  aria-label="Dreamaan feature chapters"
                >
                  {chapters.map((item, index) => (
                    <button
                      key={item.id}
                      role="tab"
                      id={`chapter-tab-${index}`}
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
                <div
                  className="chapter-panel"
                  id="chapter-panel"
                  role="tabpanel"
                  aria-labelledby={`chapter-tab-${chapter}`}
                  tabIndex={0}
                >
                  <span className="chapter-label">
                    0{chapter + 1} — {current.label}
                  </span>
                  <h4>{current.title}</h4>
                  <p>{current.description}</p>
                </div>
                <div className="tech-tags">
                  <span>React</span>
                  <span>TypeScript</span>
                  <span>Next.js</span>
                  <span>UI/UX</span>
                </div>
                <button
                  className="text-link case-link"
                  onClick={() => setCaseOpen(true)}
                >
                  Explore the case study <ArrowUpRight size={17} />
                </button>
              </div>
            </article>
            <div className="other-work">
              {projects.map((project, index) => (
                <article
                  key={project.name}
                  className={`small-project small-project-${index}`}
                  data-reveal
                >
                  <a
                    className="small-project-art"
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View ${project.name} on GitHub`}
                  >
                    <span className="art-project-index">
                      0{index + 2} / PERSONAL PROJECT
                    </span>
                    {index === 0 ? (
                      <div className="game-visual">
                        <div className="game-sidebar">
                          <span className="game-logo">
                            g<span>.</span>
                          </span>
                          <span>Discover</span>
                          <span className="game-active">All games</span>
                          <span>Adventure</span>
                          <span>Role-playing</span>
                        </div>
                        <div className="game-content">
                          <div className="game-search">
                            Find your next adventure <span>⌕</span>
                          </div>
                          <strong>
                            Never stop exploring<span>.</span>
                          </strong>
                          <div className="game-grid">
                            <div>
                              <span>EXPLORE</span>
                            </div>
                            <div>
                              <span>DISCOVER</span>
                            </div>
                            <div>
                              <span>PLAY</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="calorie-visual">
                        <div className="calorie-title">
                          <span>Daily balance</span>
                          <span className="calorie-chip">
                            A little, every day ↗
                          </span>
                        </div>
                        <div className="calorie-body">
                          <div className="calorie-ring">
                            <div>
                              <span>1,240</span>
                              <small>of 2,000 kcal</small>
                            </div>
                          </div>
                          <div className="calorie-stats">
                            <span>
                              MEALS{" "}
                              <b>
                                1,540 <small>kcal</small>
                              </b>
                            </span>
                            <span>
                              ACTIVITY{" "}
                              <b>
                                300 <small>kcal</small>
                              </b>
                            </span>
                          </div>
                        </div>
                        <div className="calorie-row">
                          <span className="meal-icon">+</span>
                          <span>
                            Lunch
                            <br />
                            <small>A moment to refuel</small>
                          </span>
                          <b>540 kcal</b>
                        </div>
                      </div>
                    )}
                    <span className="visual-caption">
                      INTERFACE STUDY · BASED ON PROJECT FEATURES
                    </span>
                    <span className="project-hover-arrow">
                      <ArrowUpRight />
                    </span>
                  </a>
                  <div className="small-project-info">
                    <span className="eyebrow muted">{project.category}</span>
                    <h3>
                      <a href={project.url} target="_blank" rel="noreferrer">
                        {project.name}
                        <ArrowUpRight size={22} />
                      </a>
                    </h3>
                    <p>{project.description}</p>
                    <div className="tech-tags">
                      {project.stack.map((item) => (
                        <span key={item}>{item}</span>
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
              <Github size={16} /> More experiments on GitHub{" "}
              <ArrowUpRight size={16} />
            </a>
          </section>
          <section
            className="about section-shell"
            id="about"
            aria-labelledby="about-heading"
          >
            <div className="section-topline" data-reveal>
              <span className="eyebrow">02 / THE PERSON BEHIND THE PIXELS</span>
              <span className="quiet-label">
                CURIOUS BY NATURE. THOUGHTFUL BY DESIGN.
              </span>
            </div>
            <div className="about-layout">
              <div className="about-heading" data-reveal>
                <span className="large-spark" aria-hidden="true">
                  ✳
                </span>
                <h2 id="about-heading">
                  Engineer’s mind.
                  <br />
                  <span className="serif-word">Creative heart.</span>
                </h2>
                <div className="about-note">
                  <span>
                    Good software starts
                    <br />
                    with understanding people.
                  </span>
                  <ArrowUpRight size={30} strokeWidth={1} />
                </div>
              </div>
              <div className="about-copy" data-reveal>
                <p className="about-lead">
                  I’m Dorsa, a frontend and software engineer who cares as much
                  about how a product feels as how it works.
                </p>
                <p>
                  I build with React, Next.js, and TypeScript, bringing together
                  responsive interfaces, API integrations, and the small details
                  that make a workflow feel effortless.
                </p>
                <p>
                  At Rastaar, I work on Dreamaan, an AI-powered creative
                  platform. My work spans feature development, UI/UX
                  improvements, debugging, and automated testing.
                </p>
                <p>
                  I use AI development tools as part of my process, then review,
                  test, and refine the code. Curiosity helps me move forward.
                  Care helps me build something worth using.
                </p>
                <div className="about-facts">
                  <div>
                    <span>BASED IN</span>
                    <strong>Tehran, Iran</strong>
                  </div>
                  <div>
                    <span>LANGUAGES</span>
                    <strong>Persian · English C1</strong>
                  </div>
                  <div>
                    <span>BACKGROUND</span>
                    <strong>Computer Engineering</strong>
                  </div>
                  <div>
                    <span>ALSO PART OF MY STORY</span>
                    <strong>Python teaching & UI/UX</strong>
                  </div>
                </div>
                <a className="text-link" href="/Dorsa-Khalili-CV.pdf" download>
                  Download my résumé <Download size={16} />
                </a>
              </div>
            </div>
            <div className="toolkit" data-reveal>
              <div>
                <span className="eyebrow">MY EVERYDAY TOOLKIT</span>
                <p>
                  The tools change.
                  <br />
                  The care stays.
                </p>
              </div>
              <div className="toolkit-items">
                {[
                  "React",
                  "Next.js",
                  "TypeScript",
                  "Tailwind CSS",
                  "Zustand",
                  "React Query",
                  "Jest",
                  "Playwright",
                  "Figma",
                  "Git",
                  "Cursor",
                  "Claude",
                  "Copilot",
                  "Codex",
                ].map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </section>
          <section
            className="experience section-shell"
            id="experience"
            aria-labelledby="experience-heading"
          >
            <div className="section-topline" data-reveal>
              <span className="eyebrow">03 / ALONG THE WAY</span>
              <span className="quiet-label">
                ALWAYS LEARNING. ALWAYS BUILDING.
              </span>
            </div>
            <div className="experience-layout">
              <div data-reveal>
                <h2 id="experience-heading">
                  A little more
                  <br />
                  <span className="serif-word">experience.</span>
                </h2>
                <p className="experience-aside">
                  Different teams, different challenges.
                  <br />
                  The same attention to the details.
                </p>
                <a
                  className="text-link"
                  href="/Dorsa-Khalili-CV.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  The full story <ArrowUpRight size={16} />
                </a>
              </div>
              <div className="experience-list">
                {experiences.map((item, index) => (
                  <details
                    key={item.company}
                    className="experience-item"
                    open={index === 0}
                    data-reveal
                  >
                    <summary>
                      <span className="experience-date">{item.date}</span>
                      <span className="experience-title">
                        <strong>
                          {item.company}
                          {index === 0 && (
                            <span className="current-label">CURRENT</span>
                          )}
                        </strong>
                        <span>{item.role}</span>
                      </span>
                      <Plus size={18} className="experience-plus" />
                    </summary>
                    <div className="experience-description">
                      <p>{item.description}</p>
                      <div className="tech-tags">
                        {item.stack.map((tech) => (
                          <span key={tech}>{tech}</span>
                        ))}
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
          <section
            className="contact section-shell"
            id="contact"
            aria-labelledby="contact-heading"
          >
            <div className="contact-top" data-reveal>
              <span className="eyebrow">04 / LET’S MAKE SOMETHING GOOD</span>
              <span className="contact-spark" aria-hidden="true">
                ✳
              </span>
            </div>
            <div className="contact-main" data-reveal>
              <h2 id="contact-heading">
                Have something
                <br />
                in <span className="serif-word">mind?</span>
              </h2>
              <a
                className="contact-arrow"
                href="mailto:dorrsakhalili@gmail.com"
                aria-label="Email Dorsa Khalili"
              >
                <MoveUpRight strokeWidth={1} />
              </a>
            </div>
            <div className="contact-bottom" data-reveal>
              <div>
                <p>
                  A thoughtful product. A new collaboration.
                  <br />
                  Or just a good conversation.
                </p>
                <div className="email-line">
                  <a href="mailto:dorrsakhalili@gmail.com">
                    dorrsakhalili@gmail.com
                  </a>
                  <button
                    className="icon-button"
                    onClick={copyEmail}
                    aria-label={copied ? "Email copied" : "Copy email address"}
                  >
                    {copied ? <Check size={17} /> : <Copy size={17} />}
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
                  <Github size={16} />
                  GitHub <ArrowUpRight size={16} />
                </a>
                <a
                  href="https://linkedin.com/in/dorsa-khalili"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Linkedin size={16} />
                  LinkedIn <ArrowUpRight size={16} />
                </a>
                <a href="/Dorsa-Khalili-CV.pdf" download>
                  <Download size={16} />
                  Résumé <ArrowDown size={16} />
                </a>
              </div>
            </div>
          </section>
        </main>
        <footer className="site-footer section-shell">
          <a className="wordmark" href="#home">
            dorsa<span>.</span>
          </a>
          <span>
            BUILT WITH CURIOSITY & CARE <span aria-hidden="true">✳</span>{" "}
            {new Date().getFullYear()}
          </span>
          <a href="#home">
            BACK TO TOP <ArrowUpRight size={13} />
          </a>
        </footer>
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
