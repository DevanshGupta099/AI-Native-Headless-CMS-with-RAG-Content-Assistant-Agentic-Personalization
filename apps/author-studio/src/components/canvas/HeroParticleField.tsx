'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroParticleField() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId: number;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.035);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 2. Generate Particles
    const PARTICLE_COUNT = 180;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const velocities: { x: number; y: number; z: number; ox: number; oy: number; oz: number }[] = [];

    const palette = [
      new THREE.Color('#E8380D'), // Adobe flame
      new THREE.Color('#F56E40'), // warm coral
      new THREE.Color('#FFB347'), // luminous amber
      new THREE.Color('#3B82F6'), // electric blue
      new THREE.Color('#FFFFFF'), // core white
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 8 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = (radius * Math.sin(phi) * Math.sin(theta)) * 0.65;
      const z = (radius * Math.cos(phi)) * 0.75;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      velocities.push({
        x: (Math.random() - 0.5) * 0.008,
        y: (Math.random() - 0.5) * 0.008,
        z: (Math.random() - 0.5) * 0.008,
        ox: x,
        oy: y,
        oz: z,
      });

      const color = palette[Math.floor(Math.random() * palette.length)] ?? new THREE.Color('#E8380D');
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
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
    grad.addColorStop(0.25, 'rgba(255,220,180,0.85)');
    grad.addColorStop(0.65, 'rgba(232,56,13,0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const spriteTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.65,
      map: spriteTexture,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(geometry, particleMaterial);
    scene.add(particleSystem);

    // Dynamic Line Connections Geometry
    const linePositions = new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 6);
    const lineColors = new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineMesh);

    // Mouse Tracking for Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      camera.position.x = mouseX * 2.2;
      camera.position.y = -mouseY * 1.5;
      camera.lookAt(0, 0, 0);

      particleSystem.rotation.y = elapsed * 0.035;
      particleSystem.rotation.x = Math.sin(elapsed * 0.02) * 0.08;
      lineMesh.rotation.y = particleSystem.rotation.y;
      lineMesh.rotation.x = particleSystem.rotation.x;

      const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
      const lPosAttr = lineGeometry.getAttribute('position') as THREE.BufferAttribute;
      const lColAttr = lineGeometry.getAttribute('color') as THREE.BufferAttribute;

      if (!posAttr || !lPosAttr || !lColAttr) {
        renderer.render(scene, camera);
        return;
      }

      const pos = posAttr.array as Float32Array;
      const lPos = lPosAttr.array as Float32Array;
      const lCol = lColAttr.array as Float32Array;

      // Update particle positions with subtle breathing drift
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 3;
        const v = velocities[i];
        if (!v) continue;
        pos[idx] = v.ox + Math.sin(elapsed * 0.4 + i) * 0.4;
        pos[idx + 1] = v.oy + Math.cos(elapsed * 0.35 + i * 0.5) * 0.35;
        pos[idx + 2] = v.oz + Math.sin(elapsed * 0.25 + i * 1.2) * 0.3;
      }
      posAttr.needsUpdate = true;

      // Build constellation lines for nearby nodes
      let lineVertexIdx = 0;
      let lineCount = 0;
      const MAX_DISTANCE = 4.2;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const x1 = pos[i3] ?? 0;
        const y1 = pos[i3 + 1] ?? 0;
        const z1 = pos[i3 + 2] ?? 0;

        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const j3 = j * 3;
          const x2 = pos[j3] ?? 0;
          const y2 = pos[j3 + 1] ?? 0;
          const z2 = pos[j3 + 2] ?? 0;

          const distSq = (x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2;

          if (distSq < MAX_DISTANCE * MAX_DISTANCE) {
            const alpha = 1 - Math.sqrt(distSq) / MAX_DISTANCE;

            lPos[lineVertexIdx] = x1;
            lPos[lineVertexIdx + 1] = y1;
            lPos[lineVertexIdx + 2] = z1;

            lCol[lineVertexIdx] = 0.95 * alpha;
            lCol[lineVertexIdx + 1] = 0.43 * alpha;
            lCol[lineVertexIdx + 2] = 0.15 * alpha;

            lPos[lineVertexIdx + 3] = x2;
            lPos[lineVertexIdx + 4] = y2;
            lPos[lineVertexIdx + 5] = z2;

            lCol[lineVertexIdx + 3] = 1.0 * alpha;
            lCol[lineVertexIdx + 4] = 0.7 * alpha;
            lCol[lineVertexIdx + 5] = 0.28 * alpha;

            lineVertexIdx += 6;
            lineCount++;
            if (lineCount >= 320) break;
          }
        }
        if (lineCount >= 320) break;
      }

      lineGeometry.setDrawRange(0, lineCount * 2);
      lPosAttr.needsUpdate = true;
      lColAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      lineGeometry.dispose();
      particleMaterial.dispose();
      spriteTexture.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      <div ref={containerRef} className="w-full h-full" />
      {/* Vignette fade to dark void */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090b]" />
    </div>
  );
}
