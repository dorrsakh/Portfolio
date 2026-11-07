import { useState } from "react";

const scenes = [
  {
    id: "login",
    label: "Login",
    title: "A welcoming first impression.",
    poster: "/media/dreamaan-login.webp",
    video: null,
    note: "The redesigned login page, captured from the current development preview.",
  },
  {
    id: "home",
    label: "Home",
    title: "A home for the whole workflow.",
    poster: "/media/dreamaan-home.webp",
    video: "/media/dreamaan-home.webm",
    note: "Projects, assignments, and credits together in a real demonstration workspace.",
  },
  {
    id: "project",
    label: "Project",
    title: "From the next idea to the next shot.",
    poster: "/media/dreamaan-project.webp",
    video: "/media/dreamaan-project.webm",
    note: "A project overview connects creation with assignments, review, and production progress.",
  },
  {
    id: "organization",
    label: "Organization",
    title: "The bigger picture, in one place.",
    poster: "/media/dreamaan-organization.webp",
    video: "/media/dreamaan-organization.webm",
    note: "Project and usage views from the organization dashboard.",
  },
  {
    id: "studio-generation",
    label: "Studio",
    title: "One prompt. A new possibility.",
    poster: "/media/dreamaan-studio-generation.webp",
    video: "/media/dreamaan-studio-generation.webm",
    note: "One real text-to-image generation with Seedream 5 Pro. Generation wait shortened; failed generations hidden.",
  },
];

export function DreamaanTour() {
  const [selected, setSelected] = useState(1);
  const scene = scenes[selected];
  return (
    <div className="dreamaan-tour">
      <div
        className="tour-selector"
        role="group"
        aria-label="Dreamaan product tour"
      >
        {scenes.map((item, index) => (
          <button
            key={item.id}
            aria-pressed={index === selected}
            onClick={() => setSelected(index)}
          >
            {item.label}
            <span>{item.video ? "Film" : "Still"}</span>
          </button>
        ))}
      </div>
      <div className="tour-screen">
        {scene.video ? (
          <video
            key={scene.id}
            controls
            autoPlay
            playsInline
            preload="metadata"
            poster={scene.poster}
            aria-label={`Dreamaan ${scene.label} walkthrough`}
            aria-describedby="tour-note"
          >
            <source src={scene.video} type="video/webm" />
            <track
              kind="captions"
              src={`/media/dreamaan-${scene.id}.vtt`}
              srcLang="en"
              label="English"
              default
            />
            Your browser does not support this video.{" "}
            <a href={scene.video}>Download the clip</a>.
          </video>
        ) : (
          <img
            src={scene.poster}
            alt="Dreamaan redesigned login page with an animated media collage and sign-in form"
            width="1440"
            height="960"
          />
        )}
      </div>
      <div className="tour-description">
        <h3>{scene.title}</h3>
        <p id="tour-note">{scene.note}</p>
        <span>Development preview · Demonstration content</span>
      </div>
    </div>
  );
}
