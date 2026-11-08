import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import type { Work } from "../data/workbench";
export function WorkCard({
  project,
  match,
  onOpen,
}: {
  project: Work;
  match: boolean | undefined;
  onOpen: (opener: HTMLButtonElement) => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const node = video.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) node.pause();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  function preview() {
    if (
      matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)")
        .matches
    )
      void video.current?.play().catch(() => {});
  }
  function stop() {
    video.current?.pause();
    setPlaying(false);
  }
  return (
    <article
      className={`work-card ${project.id === "dreamaan" ? "featured" : ""}`}
      data-match={match}
      data-reveal
    >
      <button
        className="work-media"
        onClick={(event) => onOpen(event.currentTarget)}
        onPointerEnter={preview}
        onPointerLeave={stop}
        onFocus={preview}
        onBlur={stop}
        aria-label={`Explore ${project.name}`}
      >
        <img
          src={project.poster}
          alt={`${project.name} application interface`}
          loading="lazy"
          width="1440"
          height="900"
        />
        <video
          ref={video}
          muted
          playsInline
          loop
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          style={{ opacity: playing ? 1 : 0 }}
        >
          <source src={project.video} type="video/webm" />
        </video>
        <span className="media-corner">
          <Play size={13} fill="currentColor" /> View project
        </span>
        <span className="media-arrow">
          <ArrowUpRight />
        </span>
        {project.id === "dreamaan" && (
          <span className="project-status">
            <i /> Redesign in progress
          </span>
        )}
      </button>
      <div className="work-meta">
        <div>
          <p className="eyebrow">{project.category}</p>
          <h3>
            <button onClick={(event) => onOpen(event.currentTarget)}>
              {project.name} <ArrowUpRight size={22} />
            </button>
          </h3>
          <p>{project.description}</p>
        </div>
        <div
          className="project-logos"
          aria-label={
            project.stack.length
              ? "Project technologies"
              : "JavaScript, Bootstrap, Local storage"
          }
        >
          {project.stack.map((id) => (
            <img
              key={id}
              src={`/logos/${id}.svg`}
              alt={
                id === "reactquery"
                  ? "React Query"
                  : id === "nextjs"
                    ? "Next.js"
                    : id
              }
              title={id}
            />
          ))}
          {!project.stack.length && <span>JS / Bootstrap</span>}
        </div>
      </div>
    </article>
  );
}
