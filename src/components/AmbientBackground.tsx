import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  depth: number;
  size: number;
};
export function AmbientBackground({ paused }: { paused: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null),
    pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let width = innerWidth,
      height = innerHeight,
      frame = 0,
      last = 0,
      scroll = scrollY,
      velocity = 0;
    let pointer = { x: -1000, y: -1000 },
      points: Point[] = [],
      ripples: { x: number; y: number; radius: number; life: number }[] = [];
    const coarse = matchMedia("(pointer: coarse)").matches;
    function resize() {
      width = innerWidth;
      height = innerHeight;
      const ratio = Math.min(devicePixelRatio, 1.5);
      canvas!.width = width * ratio;
      canvas!.height = height * ratio;
      canvas!.style.width = width + "px";
      canvas!.style.height = height + "px";
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(
        coarse ? 65 : 160,
        Math.round((width * height) / 8500),
      );
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        depth: 0.3 + Math.random() * 0.7,
        size: 0.6 + Math.random() * 0.9,
      }));
    }
    const move = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
    };
    const leave = () => {
      pointer = { x: -1000, y: -1000 };
    };
    const click = (e: PointerEvent) => {
      if (!pausedRef.current && !media.matches) {
        ripples.push({ x: e.clientX, y: e.clientY, radius: 0, life: 1 });
        ripples = ripples.slice(-3);
      }
    };
    const onScroll = () => {
      velocity = Math.max(-12, Math.min(12, (scrollY - scroll) * 0.09));
      scroll = scrollY;
    };
    function draw(time: number) {
      frame = requestAnimationFrame(draw);
      if (time - last < 30 || document.hidden) return;
      last = time;
      ctx!.clearRect(0, 0, width, height);
      if (media.matches) return;
      if (!pausedRef.current) velocity *= 0.88;
      for (const p of points) {
        const dx = p.x - pointer.x,
          dy = p.y - pointer.y,
          distance = Math.hypot(dx, dy);
        if (!pausedRef.current) {
          if (distance < 170 && distance > 1 && !coarse) {
            const force = (170 - distance) / 170;
            p.vx += (dx / distance) * force * 0.1;
            p.vy += (dy / distance) * force * 0.1;
          }
          p.vx *= 0.94;
          p.vy *= 0.94;
          p.x += p.vx + Math.sin(time * 0.0001 + p.depth * 10) * 0.08;
          p.y += p.vy - 0.1 * p.depth - velocity * p.depth;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }
        const energy = Math.max(0, 1 - distance / 240);
        ctx!.fillStyle = `rgba(${energy > 0.1 ? "219,170,158" : "164,166,183"},${0.15 + p.depth * 0.1 + energy * 0.4})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size + energy * 0.7, 0, Math.PI * 2);
        ctx!.fill();
        if (energy > 0.05 && !coarse) {
          for (const other of points) {
            const d = Math.hypot(p.x - other.x, p.y - other.y);
            if (d < 90 && other.x > p.x) {
              ctx!.strokeStyle = `rgba(192,186,207,${(1 - d / 90) * energy * 0.22})`;
              ctx!.lineWidth = 0.6;
              ctx!.beginPath();
              ctx!.moveTo(p.x, p.y);
              ctx!.lineTo(other.x, other.y);
              ctx!.stroke();
            }
          }
        }
      }
      ripples = ripples.filter((r) => r.life > 0);
      for (const ripple of ripples) {
        if (!pausedRef.current) {
          ripple.radius += 2.5;
          ripple.life -= 0.018;
        }
        ctx!.beginPath();
        ctx!.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx!.strokeStyle = `rgba(239,163,146,${ripple.life * 0.22})`;
        ctx!.lineWidth = 0.8;
        ctx!.stroke();
      }
    }
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", click, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", click);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return <canvas ref={ref} className="ambient-background" aria-hidden="true" />;
}
