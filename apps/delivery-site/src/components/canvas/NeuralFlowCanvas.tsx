'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function NeuralFlowCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080b11, 0.05);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 3, 7);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Grid of particles forming a dynamic wave
    const cols = 65;
    const rows = 45;
    const particleCount = cols * rows;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x00e5ff); // Spectrum Cyan
    const color2 = new THREE.Color(0xeb1000); // Adobe Crimson
    const color3 = new THREE.Color(0xff4d6d); // Adobe Coral

    let index = 0;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = (i - cols / 2) * 0.28;
        const z = (j - rows / 2) * 0.28;
        const y = 0;

        positions[index * 3] = x;
        positions[index * 3 + 1] = y;
        positions[index * 3 + 2] = z;

        // Gradient based on distance from center
        const ratio = Math.hypot(x, z) / 8;
        const mixedColor = color1.clone().lerp(color2, Math.sin(ratio * Math.PI));
        mixedColor.lerp(color3, (i / cols));

        colors[index * 3] = mixedColor.r;
        colors[index * 3 + 1] = mixedColor.g;
        colors[index * 3 + 2] = mixedColor.b;

        index++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse tilt
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    container.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 360;
      if (w <= 0 || h <= 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime() * 1.5;

      const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute | undefined;
      if (positionAttr) {
        const pos = positionAttr.array as Float32Array;
        let pIdx = 0;
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const x = pos[pIdx * 3] ?? 0;
            const z = pos[pIdx * 3 + 2] ?? 0;
            // Dynamic wave equations
            pos[pIdx * 3 + 1] =
              Math.sin(x * 0.8 + time) * 0.35 +
              Math.cos(z * 0.6 + time * 0.8) * 0.35 +
              Math.sin(Math.hypot(x, z) * 1.2 - time) * 0.2;
            pIdx++;
          }
        }
        positionAttr.needsUpdate = true;
      }

      // Parallax smooth interpolation
      particles.rotation.y = time * 0.03 + mouseX * 0.15;
      particles.rotation.x = 0.15 - mouseY * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[360px] overflow-hidden rounded-3xl bg-[#080b11] border border-white/[0.08]">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080b11] via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
