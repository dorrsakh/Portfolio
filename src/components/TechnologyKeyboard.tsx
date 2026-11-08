import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { tools } from "../data/workbench";
export function TechnologyKeyboard({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null),
    [pressed, setPressed] = useState<string | null>(null);
  const current = tools.find((t) => t.id === (hover ?? selected));
  function activate(id: string) {
    if (id === "work" || id === "contact") {
      document
        .getElementById(id)
        ?.scrollIntoView({
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      return;
    }
    onSelect(selected === id ? null : id);
  }
  const activateRef = useRef(activate);
  useEffect(() => {
    activateRef.current = activate;
  });
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.repeat ||
        target.closest(
          "input,textarea,select,button,a,[contenteditable],dialog",
        ) ||
        document.querySelector("dialog[open]")
      )
        return;
      const b = root.current?.getBoundingClientRect();
      if (!b || b.bottom < 0 || b.top > innerHeight) return;
      const t = tools.find(
        (t) =>
          t.shortcut.toLowerCase() ===
          (e.key === "Enter" ? "↵" : e.key.toLowerCase()),
      );
      if (t) {
        e.preventDefault();
        setPressed(t.id);
        activateRef.current(t.id);
      }
    };
    const up = () => setPressed(null);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", up);
    };
  }, []);
  return (
    <div className="keyboard-workbench" id="stack" ref={root}>
      <div className="keyboard-label">
        <span>THE TOOLKIT / 16 KEYS</span>
        <span className="live-dot">Ready to play</span>
      </div>
      <div
        className="keyboard-perspective"
        onPointerMove={(e) => {
          if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          const b = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty(
            "--rx",
            `${8 - ((e.clientY - b.top) / b.height) * 5}deg`,
          );
          e.currentTarget.style.setProperty(
            "--ry",
            `${((e.clientX - b.left) / b.width) * 8 - 4}deg`,
          );
        }}
        onPointerLeave={(e) => {
          e.currentTarget.style.setProperty("--rx", "8deg");
          e.currentTarget.style.setProperty("--ry", "-4deg");
          setHover(null);
        }}
      >
        <div className="keyboard-case">
          <div
            className="key-grid"
            role="group"
            aria-label="Interactive technology keyboard"
          >
            {tools.map((t) => (
              <button
                key={t.id}
                className="keycap"
                data-selected={selected === t.id}
                data-pressed={pressed === t.id}
                data-action={t.id === "work" || t.id === "contact"}
                aria-label={t.name}
                aria-pressed={
                  t.id === "work" || t.id === "contact"
                    ? undefined
                    : selected === t.id
                }
                onClick={() => activate(t.id)}
                onPointerEnter={() => setHover(t.id)}
                onFocus={() => setHover(t.id)}
                onBlur={() => setHover(null)}
                onPointerDown={() => setPressed(t.id)}
                onPointerUp={() => setPressed(null)}
                onPointerCancel={() => setPressed(null)}
                onPointerLeave={() => setPressed(null)}
              >
                <span className="key-face">
                  <small>{t.shortcut}</small>
                  {t.id === "work" ? (
                    <ArrowDownRight />
                  ) : t.id === "contact" ? (
                    <ArrowUpRight />
                  ) : (
                    <img src={`/logos/${t.id}.svg`} alt="" draggable={false} />
                  )}
                  <span>{t.name}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="keyboard-signature">
            <span>
              dorsa<span className="coral">.</span>
            </span>
            <span>CRAFTED TO CONNECT</span>
            <i />
          </div>
        </div>
      </div>
      <div className="keyboard-readout" aria-live="polite">
        <div>
          <span>{current ? current.name : "A few of my favorite tools."}</span>
          <p>{current ? current.note : "Tap a key. Or try your keyboard."}</p>
        </div>
        {selected && (
          <button className="reset-key" onClick={() => onSelect(null)}>
            Reset ↺
          </button>
        )}
      </div>
    </div>
  );
}
