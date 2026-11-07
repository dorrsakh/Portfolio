import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { chapters } from "../data/portfolio";
export function CaseStudy({
  onClose,
  initialChapter,
  onChapter,
}: {
  onClose: () => void;
  initialChapter: number;
  onChapter: (index: number) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    [chapter, setChapter] = useState(initialChapter),
    [video, setVideo] = useState(false);
  const current = chapters[chapter];
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null,
      el = dialog.current,
      overflow = document.body.style.overflow;
    el?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      el?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  function select(index: number) {
    setChapter(index);
    onChapter(index);
    setVideo(false);
  }
  return (
    <dialog
      ref={dialog}
      className="case-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            "a[href],button,input,select,textarea,video[controls],[tabindex]",
          ),
        ).filter(
          (element) =>
            !element.hasAttribute("disabled") &&
            element.tabIndex >= 0 &&
            element.getClientRects().length > 0,
        );
        const first = controls[0],
          last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      aria-labelledby="case-title"
      data-lenis-prevent
    >
      <div className="case-content">
        <div className="case-header">
          <button onClick={onClose} className="case-back">
            <ChevronLeft size={16} /> Selected work
          </button>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close Dreamaan case study"
          >
            <X />
          </button>
        </div>
        <div className="case-intro">
          <span className="eyebrow coral">DREAMAAN / RASTAAR / 2026</span>
          <h2 id="case-title">
            More space
            <br />
            for <i>creativity.</i>
          </h2>
          <p>
            Building thoughtful interfaces for AI-powered cinematic production.
          </p>
          <div className="case-metadata">
            <div>
              <span>MY ROLE</span>
              <strong>Frontend / Software Engineer</strong>
            </div>
            <div>
              <span>FOCUS</span>
              <strong>Assets, Studio & references</strong>
            </div>
            <div>
              <span>STATUS</span>
              <strong>
                <span className="status-dot" /> Redesign in progress
              </strong>
            </div>
          </div>
        </div>
        <div className="case-nav" aria-label="Case study chapters">
          {chapters.map((item, index) => (
            <button
              key={item.id}
              aria-pressed={chapter === index && !video}
              onClick={() => select(index)}
            >
              {item.short}
            </button>
          ))}
          <button
            className="walkthrough-button"
            aria-pressed={video}
            onClick={() => setVideo(true)}
          >
            <Play size={13} /> Walkthrough
          </button>
        </div>
        <div className="case-media">
          {video ? (
            <video
              controls
              autoPlay
              playsInline
              preload="metadata"
              poster="/media/dreamaan-assets.webp"
              aria-label="Dreamaan Assets and Studio walkthrough"
            >
              <source
                src="/media/dreamaan-walkthrough.webm"
                type="video/webm"
              />
              <track
                kind="captions"
                src="/media/walkthrough.vtt"
                srcLang="en"
                label="English"
                default
              />
            </video>
          ) : (
            <img
              src={current.image}
              alt={current.alt}
              width="1440"
              height="960"
            />
          )}
        </div>
        {video ? (
          <p className="case-video-note">
            A silent walkthrough of the current development preview. Captions
            describe the interactions.
          </p>
        ) : (
          <div className="case-story">
            <div>
              <span className="eyebrow coral">
                0{chapter + 1} / {current.label.toUpperCase()}
              </span>
              <h3>{current.title}</h3>
              <a
                className="text-link"
                href={`https://github.com/copilot-rast/dreamaan-web/pull/${current.pr}`}
                target="_blank"
                rel="noreferrer"
              >
                View contribution on GitHub <ArrowUpRight size={16} />
              </a>
            </div>
            <div>
              <h4>The challenge</h4>
              <p>{current.problem}</p>
              <h4>My contribution</h4>
              <p>{current.contribution}</p>
              <ul>
                {current.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {chapter === 3 && !video && (
          <figure className="case-picker">
            <img
              src="/media/dreamaan-picker.webp"
              alt="The shared asset picker filtered to generated demonstration media, with batch selection controls"
              loading="lazy"
              width="1440"
              height="960"
            />
            <figcaption>
              One shared picker. Reusable media, batch selection, and a
              connected reference workflow.
            </figcaption>
          </figure>
        )}
        <div className="case-proof">
          <span className="eyebrow">THE ENGINEERING BEHIND THE INTERFACE</span>
          <div>
            <div>
              <h4>Built for real workflows</h4>
              <p>
                Model limits, permission-aware views, validation, and retry
                behavior are part of the interface decisions.
              </p>
            </div>
            <div>
              <h4>Reviewed and tested</h4>
              <p>
                Focused tests and authenticated browser checks support the
                Assets and Elements contributions. Development status is
                documented in the linked PRs.
              </p>
            </div>
            <div>
              <h4>A work in progress</h4>
              <p>
                This case study includes unmerged feature work and my
                contributions within a team-built product. Generated artwork is
                demonstration content.
              </p>
            </div>
          </div>
        </div>
        <div className="case-mobile-images">
          <img
            src="/media/dreamaan-assets-mobile.webp"
            alt="Dreamaan responsive asset library on mobile"
            loading="lazy"
            width="390"
            height="844"
          />
          <div>
            <span className="eyebrow coral">THE SAME CARE, AT EVERY SIZE</span>
            <h3>
              Small screen.
              <br />
              Full attention.
            </h3>
            <p>
              Responsive layouts, reachable controls, and a mobile search sheet
              keep the workflow usable away from a desktop.
            </p>
          </div>
        </div>
        <div className="case-bottom">
          <button
            className="text-link"
            onClick={() => select((chapter + 3) % 4)}
          >
            <ChevronLeft size={17} /> Previous chapter
          </button>
          <button
            className="text-link"
            onClick={() => {
              select((chapter + 1) % 4);
              dialog.current?.scrollTo({ top: 0, behavior: "instant" });
            }}
          >
            Next chapter <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </dialog>
  );
}
