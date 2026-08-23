"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Grand, cinematic background:
 */
export default function DataGalaxyBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      500
    );
    camera.position.set(0, 4, 28);

    // --------- Galaxy points ----------
    const count = 15000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const radius = 32;
    const branches = 5;
    const spin = 1.2;
    const randomness = 0.85;

    const inner = new THREE.Color("#22d3ee"); // cyan-400
    const outer = new THREE.Color("#7dd3fc"); // sky-300

    for (let i = 0; i < count; i++) {
      const r = Math.random() * radius;
      const branch = i % branches;
      const angle = (branch / branches) * Math.PI * 2 + r * spin;

      const rx = (Math.random() ** 2) * (Math.random() < 0.5 ? 1 : -1);
      const ry = (Math.random() ** 2) * (Math.random() < 0.5 ? 1 : -1);
      const rz = (Math.random() ** 2) * (Math.random() < 0.5 ? 1 : -1);

      const i3 = i * 3;
      positions[i3 + 0] = Math.cos(angle) * r + rx * randomness;
      positions[i3 + 1] = ry * randomness * 0.8 + (r - radius / 2) * 0.02;
      positions[i3 + 2] = Math.sin(angle) * r + rz * randomness;

      const t = r / radius;
      const c = inner.clone().lerp(outer, t);
      colors[i3 + 0] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    const galaxyGeom = new THREE.BufferGeometry();
    galaxyGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    galaxyGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const galaxyMat = new THREE.PointsMaterial({
      size: 0.05,
      transparent: true,
      opacity: 0.95,
      vertexColors: true,
      depthWrite: false,
    });

    const galaxy = new THREE.Points(galaxyGeom, galaxyMat);
    scene.add(galaxy);

    // --------- Star sphere (far background) ----------
    const starCount = 4000;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const s = 140 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const i3 = i * 3;
      starPos[i3] = s * Math.sin(phi) * Math.cos(theta);
      starPos[i3 + 1] = s * Math.sin(phi) * Math.sin(theta);
      starPos[i3 + 2] = s * Math.cos(phi);
    }
    const starsGeom = new THREE.BufferGeometry();
    starsGeom.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starsMat = new THREE.PointsMaterial({
      size: 0.6,
      color: 0x94e2ff,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    const stars = new THREE.Points(starsGeom, starsMat);
    scene.add(stars);

    const clock = new THREE.Clock();
    let raf = 0;

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    const animate = () => {
      const t = clock.getElapsedTime();
      galaxy.rotation.y = t * 0.03;
      galaxy.rotation.x = Math.sin(t * 0.03) * 0.15;
      stars.rotation.y = t * 0.005;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      galaxyGeom.dispose();
      galaxyMat.dispose();
      starsGeom.dispose();
      starsMat.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" ref={mountRef}>
      {/* slight cyan glows to anchor the hero */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_70%_45%,rgba(34,211,238,.18),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_15%_20%,rgba(125,211,252,.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,.25),transparent_50%)]" />
    </div>
  );
}
