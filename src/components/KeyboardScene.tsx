// Keycap mesh adapted from Naresh Khatri's MIT-licensed 3d-portfolio.
// See THIRD_PARTY_LICENSES/naresh-portfolio-LICENSE.txt and assets/keyboard/provenance.json.
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { keyboardKeys } from "../data/keyboard";
type Props = {
  selected: string | null;
  hovered: string | null;
  pressed: string | null;
  onReady: (ready: boolean) => void;
};
export default function KeyboardScene({
  selected,
  hovered,
  pressed,
  onReady,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const state = useRef({ selected, hovered, pressed });
  useEffect(() => {
    state.current = { selected, hovered, pressed };
  }, [selected, hovered, pressed]);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let disposed = false,
      frame = 0,
      renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      onReady(false);
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(innerWidth, innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.append(renderer.domElement);
    const scene = new THREE.Scene(),
      board = new THREE.Group();
    board.visible = false;
    let readyAt = 0;
    scene.add(board);
    const camera = new THREE.PerspectiveCamera(
      32,
      innerWidth / innerHeight,
      0.1,
      100,
    );
    camera.position.set(0, 15, 15);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight("#ffffff", "#36313e", 1.8));
    const light = new THREE.DirectionalLight("#fff5df", 3);
    light.position.set(-3, 10, 5);
    scene.add(light);
    const fill = new THREE.DirectionalLight("#b1c9f9", 0.8);
    fill.position.set(7, 5, -5);
    scene.add(fill);
    const resources: Array<{ dispose: () => void }> = [];
    const geo = new RoundedBoxGeometry(11.55, 0.6, 5.1, 5, 0.22);
    resources.push(geo);
    const caseMaterial = new THREE.MeshStandardMaterial({
      color: "#414547",
      metalness: 0.5,
      roughness: 0.38,
    });
    resources.push(caseMaterial);
    const body = new THREE.Mesh(geo, caseMaterial);
    body.position.y = -0.45;
    board.add(body);
    const plateGeo = new RoundedBoxGeometry(11.15, 0.15, 4.7, 4, 0.15),
      plateMat = new THREE.MeshStandardMaterial({
        color: "#171a1d",
        roughness: 0.9,
      });
    resources.push(plateGeo, plateMat);
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.y = -0.12;
    board.add(plate);
    const entries: Array<{
      group: THREE.Group;
      mat: THREE.MeshPhysicalMaterial;
      index: number;
      rest: number;
    }> = [];
    const pose = { x: 0, y: 0, rx: 0.05, ry: -0.32, rz: -0.15, scale: 1 };
    let pointerX = 0,
      pointerY = 0;
    const drag = {
      x: 0,
      y: 0,
      startX: 0,
      startY: 0,
      baseX: 0,
      baseY: 0,
      active: false,
      moved: false,
      owner: null as HTMLElement | null,
      pointerId: -1,
    };
    let rotationWeight = 0,
      contactWeight = 0,
      suppressClick = false;
    let clickTimer: ReturnType<typeof setTimeout> | undefined;
    const v = new THREE.Vector3();
    const controls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scene-key]"),
    );
    const project = (x: number, y: number, z: number) => {
      v.set(x, y, z);
      board.localToWorld(v);
      v.project(camera);
      return {
        x: (v.x * 0.5 + 0.5) * innerWidth,
        y: (-0.5 * v.y + 0.5) * innerHeight,
      };
    };
    const updateControls = () => {
      if (!controls[0]?.parentElement?.classList.contains("is-3d")) return;
      board.updateMatrixWorld(true);
      keyboardKeys.forEach((key, i) => {
        const el = controls[i];
        if (!el || !el.closest(".is-3d")) return;
        const interactive =
          container.dataset.phase === "hero" ||
          container.dataset.phase === "stack";
        el.tabIndex = interactive && key.tool ? 0 : -1;
        el.style.pointerEvents = interactive ? "auto" : "none";
        el.setAttribute("aria-hidden", String(!interactive));
        const y = entries[i]?.group.position.y ?? 0.7;
        const a = project(key.x - key.width * 0.43, y + 0.15, key.z - 0.4),
          b = project(key.x + key.width * 0.43, y + 0.15, key.z - 0.4),
          c = project(key.x + key.width * 0.43, y + 0.15, key.z + 0.4),
          d = project(key.x - key.width * 0.43, y + 0.15, key.z + 0.4);
        const left = Math.min(a.x, b.x, c.x, d.x),
          top = Math.min(a.y, b.y, c.y, d.y),
          width = Math.max(a.x, b.x, c.x, d.x) - left,
          height = Math.max(a.y, b.y, c.y, d.y) - top;
        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.clipPath = `polygon(${[a, b, c, d].map((p) => `${((p.x - left) / width) * 100}% ${((p.y - top) / height) * 100}%`).join(",")})`;
      });
    };
    const keyTexture = async (
      label: string,
      icon?: string,
      shortcut?: string,
    ) => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#343536";
      ctx.font = icon ? "500 36px Arial" : "500 64px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, 256, icon ? 420 : 256);
      if (icon && shortcut) {
        ctx.font = "500 36px Arial";
        ctx.textAlign = "left";
        ctx.fillText(shortcut, 35, 48);
      }
      if (icon) {
        try {
          const svg = await (await fetch(icon)).text();
          const normalized = svg.replace(
            /<svg\b([^>]*)>/,
            (_m, attrs: string) =>
              `<svg ${attrs.replace(/\s(?:width|height)="[^"]*"/g, "")} width="256" height="256">`,
          );
          const img = new Image();
          const url = URL.createObjectURL(
            new Blob([normalized], { type: "image/svg+xml" }),
          );
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = reject;
            img.src = url;
          });
          ctx.drawImage(img, 144, 80, 224, 224);
          URL.revokeObjectURL(url);
        } catch {
          /* Printed label remains available if a texture cannot load. */
        }
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      resources.push(texture);
      return texture;
    };
    const loader = new GLTFLoader();
    void loader
      .loadAsync("/assets/keyboard/keycaps.glb")
      .then(async (gltf) => {
        if (disposed) {
          gltf.scene.traverse((obj) => {
            if (obj instanceof THREE.Mesh) obj.geometry.dispose();
          });
          return;
        }
        const cap = gltf.scene.children[0] as THREE.Mesh;
        const geometry = cap.geometry;
        resources.push(geometry);
        gltf.scene.children.slice(1).forEach((obj) => {
          if (obj instanceof THREE.Mesh) obj.geometry.dispose();
        });
        await Promise.all(
          keyboardKeys.map(async (key, index) => {
            const group = new THREE.Group();
            group.position.set(key.x, 0.66, key.z);
            const mat = new THREE.MeshPhysicalMaterial({
              color: key.action ? "#efa28e" : key.tool ? "#f0eee7" : "#a5aaa9",
              roughness: 0.36,
              metalness: 0.03,
              clearcoat: 0.25,
            });
            resources.push(mat);
            const mesh = new THREE.Mesh(geometry, mat);
            mesh.scale.x = key.width;
            group.add(mesh);
            board.add(group);
            entries[index] = { group, mat, index, rest: 0.66 };
            const texture = await keyTexture(
              key.tool?.name ?? key.label,
              key.tool && !key.action ? `/logos/${key.tool.id}.svg` : undefined,
              key.label,
            );
            if (disposed) return;
            const material = new THREE.MeshBasicMaterial({
              map: texture,
              transparent: true,
              depthWrite: false,
              toneMapped: false,
            });
            const planeGeo = new THREE.PlaneGeometry(
              0.81 * Math.min(key.width, 2),
              0.81,
            );
            resources.push(material, planeGeo);
            const plane = new THREE.Mesh(planeGeo, material);
            plane.rotation.x = -Math.PI / 2;
            plane.position.y = 0.13985;
            group.add(plane);
          }),
        );
        if (disposed) return;
        readyAt = performance.now();
        board.visible = true;
        onReady(true);
        ScrollTrigger.refresh();
      })
      .catch(() => {
        if (!disposed) onReady(false);
      });
    const lerp = THREE.MathUtils.lerp;
    const fit = () => {
      const unit =
        (2 * Math.tan(THREE.MathUtils.degToRad(16)) * Math.sqrt(450)) /
        innerHeight;
      const hero = document
        .querySelector(".hero-keyboard-anchor")
        ?.getBoundingClientRect();
      const stack = document
        .querySelector(".stack-scene-anchor")
        ?.getBoundingClientRect();
      const work = document.querySelector("#work")?.getBoundingClientRect();
      const contact = document
        .querySelector("#contact")
        ?.getBoundingClientRect();
      const center = {
        x: hero ? hero.left + hero.width / 2 : innerWidth * 0.7,
        y: hero ? hero.top + scrollY + hero.height / 2 : innerHeight * 0.5,
      };
      const progress = stack
        ? THREE.MathUtils.clamp(
            (innerHeight - stack.top) / (innerHeight * 0.95),
            0,
            1,
          )
        : 0;
      const projectProgress = work
        ? THREE.MathUtils.clamp(
            (innerHeight * 0.8 - work.top) / (innerHeight * 0.8),
            0,
            1,
          )
        : 0;
      const contactRaw = contact
        ? THREE.MathUtils.clamp(
            (innerHeight - contact.top) / (innerHeight * 0.8),
            0,
            1,
          )
        : 0;
      const contactProgress = THREE.MathUtils.smoothstep(contactRaw, 0, 1);
      contactWeight = contactProgress;
      rotationWeight = progress * (1 - projectProgress);
      const width =
        innerWidth < 721
          ? innerWidth * 0.92
          : Math.min(innerWidth * 0.77, 1240);
      const heroWidth = hero
        ? hero.width * (innerWidth < 721 ? 0.84 : 1.02)
        : width;
      const targetWidth = lerp(heroWidth, width, progress);
      const x = lerp(center.x, innerWidth * 0.5, progress);
      const y = lerp(center.y, innerHeight * 0.55, progress);
      pose.x = (x - innerWidth * 0.5) * unit;
      const dy = -(y - innerHeight * 0.5) * unit;
      pose.y = dy;
      pose.rx = lerp(0.08, 0.22, progress);
      pose.ry = lerp(-0.35, 0.06, progress);
      pose.rz = lerp(-0.13, 0.03, progress);
      pose.scale = (targetWidth * unit) / 11.55;
      if (projectProgress > 0) {
        pose.x = lerp(
          pose.x,
          (innerWidth * 0.86 - innerWidth * 0.5) * unit,
          projectProgress,
        );
        pose.y = lerp(pose.y, -innerHeight * 0.9 * unit, projectProgress);
        pose.scale *= lerp(1, 0.28, projectProgress);
        pose.ry += projectProgress * 1.8;
        pose.rz -= projectProgress * 0.35;
      }
      if (contactProgress > 0) {
        pose.x = lerp(
          pose.x,
          (innerWidth * 0.22 - innerWidth * 0.5) * unit,
          contactProgress,
        );
        pose.y = lerp(pose.y, -innerHeight * 0.24 * unit, contactProgress);
        pose.scale = lerp(
          pose.scale,
          (innerWidth * 0.33 * unit) / 11.55,
          contactProgress,
        );
        pose.rx = lerp(pose.rx, -0.5, contactProgress);
        pose.ry = lerp(pose.ry, 0.25, contactProgress);
        pose.rz = lerp(pose.rz, -0.2, contactProgress);
      }
      pose.rx += drag.y * rotationWeight;
      pose.ry += drag.x * rotationWeight;
      container.dataset.phase =
        contactProgress > 0.5
          ? "contact"
          : projectProgress > 0.5
            ? "work"
            : progress > 0.7
              ? "stack"
              : "hero";
    };
    let previousTime = performance.now();
    let previousPose = "";
    const render = () => {
      if (disposed) return;
      frame = requestAnimationFrame(render);
      if (document.hidden) return;
      const now = performance.now();
      const delta = Math.min((now - previousTime) / 1000, 0.05);
      previousTime = now;
      fit();
      const signature = [
        pose.x,
        pose.y,
        pose.rx,
        pose.ry,
        pose.rz,
        pose.scale,
        pointerX,
        pointerY,
        state.current.selected,
        state.current.hovered,
        state.current.pressed,
        contactWeight,
      ].join(":");
      const settling = entries.some(({ group, index, rest }) => {
        const id = keyboardKeys[index].tool?.id ?? `key-${index}`;
        const down =
          state.current.pressed === id || state.current.hovered === id;
        return Math.abs(group.position.y - (rest + (down ? -0.22 : 0))) > 0.001;
      });
      if (
        signature === previousPose &&
        !settling &&
        now - readyAt > 1200 &&
        contactWeight === 0
      )
        return;
      previousPose = signature;
      board.position.set(pose.x, pose.y / Math.SQRT2, -pose.y / Math.SQRT2);
      board.scale.setScalar(pose.scale);
      board.rotation.set(
        pose.rx + pointerY * 0.035,
        pose.ry + pointerX * 0.04,
        pose.rz,
      );
      entries.forEach(({ group, mat, index, rest }) => {
        const key = keyboardKeys[index];
        const id = key.tool?.id ?? `key-${index}`;
        const down =
          state.current.pressed === id || state.current.hovered === id;
        const floating =
          Math.sin(now * 0.0015 + index * 0.8) * 0.12 * contactWeight;
        const reveal = readyAt
          ? Math.pow(
              1 -
                THREE.MathUtils.clamp((now - readyAt - index * 12) / 650, 0, 1),
              3,
            ) * 2
          : 0;
        group.position.y = lerp(
          group.position.y,
          rest + (down ? -0.22 : 0) + floating + reveal,
          1 - Math.exp(-delta * 22),
        );
        mat.emissive.set("#efa28e");
        mat.emissiveIntensity =
          state.current.selected === id ? 0.22 : down ? 0.12 : 0;
      });
      updateControls();
      renderer.render(scene, camera);
    };
    const startDrag = (e: PointerEvent) => {
      if (
        container.dataset.phase !== "stack" ||
        e.button !== 0 ||
        e.pointerType === "touch"
      )
        return;
      const owner = (e.target as Element).closest<HTMLElement>(
        "[data-scene-key], [data-keyboard-grab]",
      );
      if (!owner) return;
      Object.assign(drag, {
        active: true,
        moved: false,
        startX: e.clientX,
        startY: e.clientY,
        baseX: drag.x,
        baseY: drag.y,
        owner,
        pointerId: e.pointerId,
      });
      owner.setPointerCapture(e.pointerId);
    };
    const endDrag = () => {
      if (!drag.active) return;
      drag.active = false;
      if (drag.owner?.hasPointerCapture(drag.pointerId))
        drag.owner.releasePointerCapture(drag.pointerId);
      document.documentElement.removeAttribute("data-keyboard-dragging");
      if (drag.moved) {
        suppressClick = true;
        clickTimer = setTimeout(() => {
          suppressClick = false;
        }, 150);
      }
    };
    const cancelClick = (e: MouseEvent) => {
      if (suppressClick) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    };
    const resetRotation = () => {
      drag.x = 0;
      drag.y = 0;
    };
    const move = (e: PointerEvent) => {
      if (drag.active) {
        const dx = e.clientX - drag.startX,
          dy = e.clientY - drag.startY;
        if (Math.hypot(dx, dy) > 6) drag.moved = true;
        if (drag.moved) {
          e.preventDefault();
          document.documentElement.setAttribute(
            "data-keyboard-dragging",
            "true",
          );
          drag.x = THREE.MathUtils.clamp(drag.baseX + dx * 0.006, -1.2, 1.2);
          drag.y = THREE.MathUtils.clamp(drag.baseY + dy * 0.004, -0.5, 0.6);
        }
      }
      pointerX = e.clientX / innerWidth - 0.5;
      pointerY = e.clientY / innerHeight - 0.5;
    };
    const resize = () => {
      previousPose = "";
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerdown", startDrag, true);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    window.addEventListener("blur", endDrag);
    window.addEventListener("click", cancelClick, true);
    window.addEventListener("keyboard-reset", resetRotation);
    window.addEventListener("resize", resize);
    render();
    const revealOnOpen = () => {
      readyAt = performance.now();
    };
    window.addEventListener("portfolio-open", revealOnOpen);
    const loss = (event: Event) => {
      event.preventDefault();
      onReady(false);
    };
    renderer.domElement.addEventListener("webglcontextlost", loss);
    return () => {
      disposed = true;
      window.removeEventListener("portfolio-open", revealOnOpen);
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", startDrag, true);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      window.removeEventListener("blur", endDrag);
      window.removeEventListener("click", cancelClick, true);
      window.removeEventListener("keyboard-reset", resetRotation);
      clearTimeout(clickTimer);
      document.documentElement.removeAttribute("data-keyboard-dragging");
      window.removeEventListener("resize", resize);
      renderer.domElement.removeEventListener("webglcontextlost", loss);
      resources.forEach((r) => r.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onReady]);
  return (
    <div className="keyboard-webgl" ref={host} data-testid="keyboard-scene" />
  );
}
