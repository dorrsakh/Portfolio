import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Volume2, VolumeX } from "lucide-react";
import { tools } from "../data/workbench";
import { keyboardKeys } from "../data/keyboard";
import { useKeyboardSounds } from "./useKeyboardSounds";
const KeyboardScene = lazy(() => import("./KeyboardScene"));
const subscribe = (cb: () => void) => {
  const m = matchMedia("(prefers-reduced-motion: reduce)");
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};
export function TechnologyKeyboard({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  const animate = useSyncExternalStore(
    subscribe,
    () => !matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const [ready, setReady] = useState(false),
    [hovered, setHovered] = useState<string | null>(null),
    [pressed, setPressed] = useState<string | null>(null),
    [sound, setSound] = useState(true);
  const play = useKeyboardSounds();
  const held = useRef<string | null>(null);
  const current = tools.find((t) => t.id === (hovered ?? selected));
  const state = useRef({ selected, onSelect, sound, play });
  useEffect(() => {
    state.current = { selected, onSelect, sound, play };
  }, [selected, onSelect, sound, play]);
  const onReady = useCallback((value: boolean) => setReady(value), []);
  const activate = useCallback((id: string) => {
    if (id === "work" || id === "contact") {
      document.getElementById(id)?.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    } else state.current.onSelect(state.current.selected === id ? null : id);
  }, []);
  const press = useCallback((id: string) => {
    if (held.current === id) return;
    held.current = id;
    setPressed(id);
    if (state.current.sound) state.current.play(true);
  }, []);
  const release = useCallback(() => {
    if (!held.current) return;
    held.current = null;
    setPressed(null);
    if (state.current.sound) state.current.play(false);
  }, []);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        e.repeat ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        target.closest("input,textarea,select,[contenteditable],dialog") ||
        document.querySelector("dialog[open]")
      )
        return;
      if (target.closest("button,a") && !target.closest("[data-scene-key]"))
        return;
      if (target.closest("button") && (e.key === "Enter" || e.key === " "))
        return;
      const stack = document.getElementById("stack")?.getBoundingClientRect();
      if (
        scrollY > innerHeight &&
        (!stack || stack.bottom < 0 || stack.top > innerHeight)
      )
        return;
      const key = keyboardKeys.find(
        (k) =>
          k.label.toLowerCase() === e.key.toLowerCase() ||
          (e.key === " " && k.action === "work") ||
          (e.key === "Enter" && k.action === "contact"),
      );
      if (!key) return;
      e.preventDefault();
      const index = keyboardKeys.indexOf(key),
        id = key.tool?.id ?? `key-${index}`;
      setHovered(null);
      press(id);
      if (key.tool) activate(key.tool.id);
    };
    const up = () => release();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", up);
    };
  }, [activate, press, release]);
  const live = animate && ready;
  return (
    <>
      <div
        className={`keyboard-controls ${live ? "is-3d" : "is-fallback"}`}
        role="group"
        aria-label="Interactive technology keyboard"
      >
        {keyboardKeys.map((key, index) => {
          const id = key.tool?.id ?? `key-${index}`;
          return (
            <button
              key={index}
              data-scene-key={index}
              data-tool={key.tool?.id}
              className="scene-key-control"
              aria-label={key.tool?.name ?? `${key.label} key`}
              tabIndex={key.tool ? 0 : -1}
              aria-pressed={
                key.tool && !key.action ? selected === key.tool.id : undefined
              }
              data-selected={selected === id}
              data-pressed={pressed === id}
              style={
                live
                  ? undefined
                  : {
                      left: `${((key.x + 5.6 - key.width / 2) / 11.3) * 100}%`,
                      top: `${((key.z + 2.13) / 4.5) * 100}%`,
                      width: `${(key.width / 11.3) * 100}%`,
                      height: "21%",
                    }
              }
              onPointerEnter={() => {
                setHovered(id);
                if (live) press(id);
              }}
              onPointerLeave={() => {
                setHovered(null);
                release();
              }}
              onFocus={() => setHovered(id)}
              onBlur={() => setHovered(null)}
              onPointerDown={() => press(id)}
              onPointerUp={release}
              onPointerCancel={release}
              onKeyDown={(event) => {
                if (
                  !event.repeat &&
                  (event.key === "Enter" || event.key === " ")
                )
                  press(id);
              }}
              onKeyUp={(event) => {
                if (event.key === "Enter" || event.key === " ") release();
              }}
              onClick={() => key.tool && activate(key.tool.id)}
            >
              <span className="fallback-key-face">
                <small>{key.label.length === 1 ? key.label : ""}</small>
                {key.tool && !key.action && (
                  <img src={`/logos/${key.tool.id}.svg`} alt="" />
                )}
                <span>{key.tool?.name ?? key.label}</span>
              </span>
            </button>
          );
        })}
      </div>
      {animate && (
        <Suspense fallback={null}>
          <KeyboardScene
            selected={selected}
            hovered={hovered}
            pressed={pressed}
            onReady={onReady}
          />
        </Suspense>
      )}
      <section
        className={`stack-section shell ${live ? "scene-live" : ""}`}
        id="stack"
        aria-labelledby="stack-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">STACK</p>
            <h2 id="stack-heading">
              My stack<span>.</span>
            </h2>
          </div>
          <button
            className="sound-control"
            aria-label={
              sound ? "Mute keyboard sounds" : "Enable keyboard sounds"
            }
            aria-pressed={sound}
            onClick={() => setSound(!sound)}
          >
            {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
            <span>Sound {sound ? "on" : "off"}</span>
          </button>
        </div>
        <div className="stack-scene-anchor" aria-hidden="true" />
        <div className="keyboard-readout" aria-live="polite">
          <div>
            <span>{current?.name ?? "Make some noise."}</span>
            <p>
              {current?.note ??
                "Hover, tap, or press a key. Space takes you to the work."}
            </p>
          </div>
          {selected && (
            <button className="reset-key" onClick={() => onSelect(null)}>
              Reset ↺
            </button>
          )}
        </div>
      </section>
    </>
  );
}
