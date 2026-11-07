import { useEffect, useRef } from "react";
import * as THREE from "three";
export default function InterfaceScene() {
  const mount = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
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
    camera.position.set(0, 0, 8);
    const group = new THREE.Group();
    scene.add(group);
    const geometry = new THREE.TorusKnotGeometry(1.12, 0.22, 140, 18, 2, 3);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xb9a6e8,
      metalness: 0.5,
      roughness: 0.22,
      clearcoat: 1,
      transparent: true,
      opacity: 0.8,
    });
    const knot = new THREE.Mesh(geometry, material);
    knot.rotation.z = -0.35;
    group.add(knot);
    const wireGeometry = new THREE.IcosahedronGeometry(1.9, 1),
      wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xb4a4da,
        wireframe: true,
        transparent: true,
        opacity: 0.08,
      });
    const wire = new THREE.Mesh(wireGeometry, wireMaterial);
    group.add(wire);
    scene.add(new THREE.AmbientLight(0xffffff, 1.4));
    const light = new THREE.PointLight(0xffa291, 65);
    light.position.set(3, 3, 4);
    scene.add(light);
    const rim = new THREE.PointLight(0xa899ff, 50);
    rim.position.set(-3, -2, 2);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0xffffff, 2);
    fill.position.set(0, 4, 4);
    scene.add(fill);
    let x = 0,
      y = 0,
      frame = 0,
      visible = true;
    const coarse = matchMedia("(pointer: coarse)").matches;
    const move = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      x = (event.clientX - box.left) / box.width - 0.5;
      y = (event.clientY - box.top) / box.height - 0.5;
    };
    const leave = () => {
      x = 0;
      y = 0;
    };
    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    resize();
    const intersection = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
    });
    intersection.observe(el);
    const parent = el.parentElement;
    if (!coarse) {
      parent?.addEventListener("pointermove", move);
      parent?.addEventListener("pointerleave", leave);
    }
    const start = performance.now();
    function animate() {
      frame = requestAnimationFrame(animate);
      if (!visible || document.hidden || reduced.matches) return;
      const t = (performance.now() - start) / 1000;
      group.rotation.y += (x * 0.45 - group.rotation.y) * 0.035;
      group.rotation.x += (-y * 0.3 - group.rotation.x) * 0.035;
      knot.rotation.y = t * 0.075;
      knot.position.y = Math.sin(t * 0.6) * 0.07;
      wire.rotation.z = t * 0.025;
      renderer.render(scene, camera);
    }
    animate();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      parent?.removeEventListener("pointermove", move);
      parent?.removeEventListener("pointerleave", leave);
      geometry.dispose();
      material.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return <div className="interface-scene" ref={mount} aria-hidden="true" />;
}
