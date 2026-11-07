import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { RotateCcw, RotateCw } from "lucide-react";
export default function InterfaceScene({
  paused = false,
}: {
  paused?: boolean;
}) {
  const mount = useRef<HTMLDivElement>(null),
    mesh = useRef<THREE.Mesh | null>(null),
    geometries = useRef<{
      loop: THREE.BufferGeometry;
      orb: THREE.BufferGeometry;
    } | null>(null),
    pausedRef = useRef(paused);
  const rotateRef = useRef<(delta: number) => void>(() => {});
  const [shape, setShape] = useState<"loop" | "orb">("loop");
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);
  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene(),
      camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.z = 7.4;
    const group = new THREE.Group();
    scene.add(group);
    const loop = new THREE.TorusKnotGeometry(1.04, 0.24, 130, 18, 2, 3),
      orb = new THREE.IcosahedronGeometry(1.3, 3);
    geometries.current = { loop, orb };
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xc7c5cd,
      metalness: 0.7,
      roughness: 0.22,
      clearcoat: 1,
    });
    const object = new THREE.Mesh(loop, material);
    object.rotation.set(0.35, -0.1, -0.35);
    group.add(object);
    mesh.current = object;
    scene.add(new THREE.AmbientLight(0xffffff, 1.8));
    const key = new THREE.DirectionalLight(0xffd1bd, 4);
    key.position.set(3, 4, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xa6a1ca, 3);
    fill.position.set(-4, -1, 2);
    scene.add(fill);
    const edge = new THREE.PointLight(0xffffff, 30);
    edge.position.set(0, 3, -2);
    scene.add(edge);
    let frame = 0,
      visible = true,
      drag = false,
      lastX = 0,
      lastY = 0,
      targetX = 0.35,
      targetY = -0.1,
      px = 0,
      py = 0,
      lastTime = performance.now(),
      elapsed = 0;
    rotateRef.current = (delta) => {
      targetY += delta;
      if (pausedRef.current) object.rotation.y = targetY;
    };
    const resize = () => {
      const box = el.getBoundingClientRect();
      if (!box.width || !box.height) return;
      renderer.setSize(box.width, box.height);
      camera.aspect = box.width / box.height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    resize();
    const intersection = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
    });
    intersection.observe(el);
    const move = (e: PointerEvent) => {
      if (pausedRef.current || media.matches) return;
      const box = el.getBoundingClientRect();
      px = (e.clientX - box.left) / box.width - 0.5;
      py = (e.clientY - box.top) / box.height - 0.5;
      if (drag) {
        targetY += (e.clientX - lastX) * 0.012;
        targetX += (e.clientY - lastY) * 0.012;
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };
    const down = (e: PointerEvent) => {
      if (pausedRef.current) return;
      drag = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
      el.classList.add("is-dragging");
    };
    const up = () => {
      drag = false;
      el.classList.remove("is-dragging");
    };
    const leave = () => {
      px = 0;
      py = 0;
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("pointerleave", leave);
    function draw(time: number) {
      frame = requestAnimationFrame(draw);
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      if (!visible || document.hidden || media.matches) return;
      if (!pausedRef.current) {
        elapsed += delta;
        targetY += drag ? 0 : delta * 0.11;
        object.rotation.x += (targetX + py * 0.15 - object.rotation.x) * 0.07;
        object.rotation.y += (targetY + px * 0.22 - object.rotation.y) * 0.07;
        group.position.y = Math.sin(elapsed * 0.65) * 0.065;
      }
      renderer.render(scene, camera);
    }
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("pointerleave", leave);
      gsap.killTweensOf(object.scale);
      loop.dispose();
      orb.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      mesh.current = null;
      geometries.current = null;
    };
  }, []);
  function choose(next: "loop" | "orb") {
    setShape(next);
    if (mesh.current && geometries.current) {
      mesh.current.geometry = geometries.current[next];
      if (
        !pausedRef.current &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        gsap.fromTo(
          mesh.current.scale,
          { x: 0.78, y: 0.78, z: 0.78 },
          { x: 1, y: 1, z: 1, duration: 0.65, ease: "power3.out" },
        );
      }
    }
  }
  return (
    <div className="sculpture" data-shape={shape}>
      <div ref={mount} className="interface-scene" aria-hidden="true" />
      <div className="sculpture-controls">
        <span>Drag to rotate</span>
        <div role="group" aria-label="Sculpture controls">
          <button
            aria-pressed={shape === "loop"}
            onClick={() => choose("loop")}
          >
            Loop
          </button>
          <button aria-pressed={shape === "orb"} onClick={() => choose("orb")}>
            Orb
          </button>
          <button
            className="sculpture-rotate"
            aria-label="Rotate sculpture left"
            onClick={() => rotateRef.current(-0.7)}
          >
            <RotateCcw size={13} aria-hidden="true" />
          </button>
          <button
            className="sculpture-rotate"
            aria-label="Rotate sculpture right"
            onClick={() => rotateRef.current(0.7)}
          >
            <RotateCw size={13} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
