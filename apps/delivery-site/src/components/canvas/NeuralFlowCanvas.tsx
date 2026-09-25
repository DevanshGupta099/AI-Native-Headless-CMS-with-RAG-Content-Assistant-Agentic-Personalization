'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function NeuralFlowCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let width = container.clientWidth || 800;
    let height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.045);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 7.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Grid of particles forming a dynamic neural wave
    const cols = 70;
    const rows = 50;
    const particleCount = cols * rows;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color('#3B82F6'); // Electric blue
    const color2 = new THREE.Color('#E8380D'); // Firefly flame
    const color3 = new THREE.Color('#FFB347'); // Warm amber

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
        mixedColor.lerp(color3, i / cols);

        colors[index * 3] = mixedColor.r;
        colors[index * 3 + 1] = mixedColor.g;
        colors[index * 3 + 2] = mixedColor.b;

        index++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle sprite
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,210,170,0.85)');
    grad.addColorStop(0.7, 'rgba(232,56,13,0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const spriteTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.16,
      map: spriteTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
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
      width = container.clientWidth || 800;
      height = container.clientHeight || 400;
      if (width <= 0 || height <= 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const startTime = performance.now();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = (performance.now() - startTime) * 0.001 * 1.4;

      const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute | undefined;
      if (positionAttr) {
        const pos = positionAttr.array as Float32Array;
        let pIdx = 0;
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const x = pos[pIdx * 3] ?? 0;
            const z = pos[pIdx * 3 + 2] ?? 0;
            pos[pIdx * 3 + 1] =
              Math.sin(x * 0.8 + time) * 0.38 +
              Math.cos(z * 0.65 + time * 0.85) * 0.38 +
              Math.sin(Math.hypot(x, z) * 1.3 - time) * 0.22;
            pIdx++;
          }
        }
        positionAttr.needsUpdate = true;
      }

      // Parallax smooth interpolation
      particles.rotation.y = time * 0.025 + mouseX * 0.12;
      particles.rotation.x = 0.15 - mouseY * 0.08;

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
      geometry.dispose();
      material.dispose();
      spriteTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-3xl bg-[#09090b] border border-white/[0.08]">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
