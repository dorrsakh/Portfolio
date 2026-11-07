import { useRef, useState } from "react";
import type { PointerEvent } from "react";
export function InteractionLab() {
  const ref = useRef<SVGSVGElement>(null),
    [point, setPoint] = useState({ x: 240, y: 95 }),
    [soft, setSoft] = useState(true),
    [dragging, setDragging] = useState(false);
  function move(e: PointerEvent<SVGSVGElement>) {
    if (!dragging || !ref.current) return;
    const b = ref.current.getBoundingClientRect();
    setPoint({
      x: Math.max(35, Math.min(445, ((e.clientX - b.left) / b.width) * 480)),
      y: Math.max(30, Math.min(160, ((e.clientY - b.top) / b.height) * 190)),
    });
  }
  return (
    <div className="interaction-lab">
      <div className="lab-top">
        <span>A little attention to detail.</span>
        <button aria-pressed={soft} onClick={() => setSoft(!soft)}>
          {soft ? "Soft response" : "Direct response"}
        </button>
      </div>
      <svg
        ref={ref}
        viewBox="0 0 480 190"
        aria-hidden="true"
        onPointerMove={move}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        <path className="lab-guide" d="M40 95H440M240 25V165" />
        <path
          className="lab-curve"
          d={`M40 95 Q${point.x} ${point.y} 440 95`}
          style={{
            transition: dragging
              ? "none"
              : soft
                ? "d .75s cubic-bezier(.22,1,.36,1)"
                : "none",
          }}
        />
        <circle className="lab-origin" cx="40" cy="95" r="3" />
        <circle className="lab-origin" cx="440" cy="95" r="3" />
        <circle
          className="lab-handle"
          cx={point.x}
          cy={point.y}
          r="10"
          onPointerDown={(e) => {
            setDragging(true);
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          style={{
            transition: dragging
              ? "none"
              : soft
                ? "cx .75s cubic-bezier(.22,1,.36,1),cy .75s cubic-bezier(.22,1,.36,1)"
                : "none",
          }}
        />
      </svg>
      <div className="lab-bottom">
        <span>Drag the point. Shape the response.</span>
        <button
          onClick={() =>
            setPoint((p) => ({
              x: p.x < 240 ? 330 : 150,
              y: p.y < 90 ? 145 : 40,
            }))
          }
        >
          Move the point ↗
        </button>
      </div>
    </div>
  );
}
