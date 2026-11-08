import { useEffect, useRef } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { DreamaanTour } from "./DreamaanTour";
import type { Work } from "../data/workbench";
export function ProjectDialog({
  project,
  onClose,
  returnFocus,
}: {
  project: Work;
  returnFocus: HTMLElement | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = returnFocus;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dialog = ref.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, [returnFocus]);
  return (
    <dialog
      ref={ref}
      className="project-dialog"
      data-lenis-prevent
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="project-dialog-title"
    >
      <div className="dialog-inner">
        <header>
          <div>
            <p>{project.category}</p>
            <h2 id="project-dialog-title">{project.name}</h2>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close project"
          >
            <X />
          </button>
        </header>
        {project.id === "dreamaan" ? (
          <DreamaanTour />
        ) : (
          <video
            controls
            autoPlay
            playsInline
            poster={project.poster}
            aria-label={`${project.name} walkthrough`}
          >
            <source src={project.video} type="video/webm" />
            <track
              kind="captions"
              src={`/media/${project.id === "gamehub" ? "gamehub" : "calorie"}-walkthrough.vtt`}
              srcLang="en"
              label="English"
              default
            />
          </video>
        )}
        <div className="dialog-details">
          <div>
            <p className="eyebrow">MY CONTRIBUTION</p>
            <ul>
              {project.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div>
            <p>{project.note}</p>
            {project.url && (
              <a
                className="text-link"
                href={project.url}
                target="_blank"
                rel="noreferrer"
              >
                View source <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
