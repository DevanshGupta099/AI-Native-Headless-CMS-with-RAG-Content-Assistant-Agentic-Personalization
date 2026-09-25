'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface NodeData {
  id: string;
  title: string;
  category: 'AEM_CORE' | 'PERSONALIZATION' | 'RAG_CHUNK' | 'AGENT_TOOL';
  x: number;
  y: number;
  z: number;
  similarity: number;
}

const SAMPLE_NODES: NodeData[] = [
  { id: 'vec-1', title: 'Headless CMS Content Lake Architecture', category: 'AEM_CORE', x: 2.3, y: 1.4, z: -1.2, similarity: 0.96 },
  { id: 'vec-2', title: 'GraphQL Experience Query & Delivery API', category: 'AEM_CORE', x: 1.7, y: 2.1, z: -0.5, similarity: 0.91 },
  { id: 'vec-3', title: 'pgvector Cosine Distance (<=>) Index', category: 'RAG_CHUNK', x: -1.6, y: 1.9, z: 1.8, similarity: 0.95 },
  { id: 'vec-4', title: 'Dense Semantic Embeddings (384-dim BGE)', category: 'RAG_CHUNK', x: -2.2, y: 1.1, z: 1.4, similarity: 0.90 },
  { id: 'vec-5', title: 'First-time Visitor Persona Rule Matrix', category: 'PERSONALIZATION', x: 2.4, y: -1.5, z: 1.3, similarity: 0.94 },
  { id: 'vec-6', title: 'Dynamic Hero Variant Edge Resolver', category: 'PERSONALIZATION', x: 1.8, y: -2.3, z: 0.7, similarity: 0.88 },
  { id: 'vec-7', title: 'Agent Tool: Autonomous SEO Audit Engine', category: 'AGENT_TOOL', x: -1.3, y: -1.7, z: -2.0, similarity: 0.98 },
  { id: 'vec-8', title: 'Agent Tool: Contextual Meta Description', category: 'AGENT_TOOL', x: -2.0, y: -1.1, z: -1.6, similarity: 0.95 },
  { id: 'vec-9', title: 'AEM Edge Delivery & Multi-CDN Fabric', category: 'AEM_CORE', x: 0.4, y: 2.7, z: -1.6, similarity: 0.92 },
  { id: 'vec-10', title: 'HuggingFace BGE Semantic Vectors Lake', category: 'RAG_CHUNK', x: -0.9, y: 2.3, z: 2.1, similarity: 0.91 },
  { id: 'vec-11', title: 'Enterprise Audience Behavioral Segmentation', category: 'PERSONALIZATION', x: 3.0, y: -0.6, z: 1.6, similarity: 0.89 },
  { id: 'vec-12', title: 'Human-in-the-Loop Multi-Tool Approval Trace', category: 'AGENT_TOOL', x: -2.5, y: -1.9, z: -0.8, similarity: 0.93 },
  { id: 'vec-13', title: 'Real-time SSE Streaming RAG Synthesis', category: 'RAG_CHUNK', x: -1.0, y: 0.5, z: 2.5, similarity: 0.96 },
  { id: 'vec-14', title: 'Multi-Tenant Content Isolation Fabric', category: 'AEM_CORE', x: 2.7, y: 0.7, z: -2.1, similarity: 0.89 },
  { id: 'vec-15', title: 'Personalized CTA Dynamic Variant Token', category: 'PERSONALIZATION', x: 1.3, y: -2.7, z: 1.7, similarity: 0.92 },
];

export default function VectorSpaceCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<NodeData | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.05);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Spectrum 2 Category Color Map
    const getColor = (category: string) => {
      switch (category) {
        case 'AEM_CORE':
          return 0xffb347; // Luminous Amber
        case 'RAG_CHUNK':
          return 0x22c55e; // Aurora Emerald
        case 'PERSONALIZATION':
          return 0x3b82f6; // Electric Blue
        case 'AGENT_TOOL':
          return 0xe8380d; // Adobe Flame
        default:
          return 0xf56e40;
      }
    };

    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);

    const sphereGeo = new THREE.SphereGeometry(0.13, 24, 24);
    const meshes: { mesh: THREE.Mesh; halo: THREE.Mesh; data: NodeData }[] = [];

    SAMPLE_NODES.forEach((node) => {
      const color = getColor(node.category);
      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.8,
        roughness: 0.15,
        metalness: 0.85,
      });

      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(node.x, node.y, node.z);
      nodeGroup.add(mesh);

      // Specular wireframe concentric halo
      const haloGeo = new THREE.SphereGeometry(0.24, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.22,
        wireframe: true,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(mesh.position);
      nodeGroup.add(halo);

      meshes.push({ mesh, halo, data: node });
    });

    // Connecting Neural Semantic Links (HNSW Graph Representation)
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xf56e40,
      transparent: true,
      opacity: 0.35,
    });

    for (let i = 0; i < SAMPLE_NODES.length; i++) {
      for (let j = i + 1; j < SAMPLE_NODES.length; j++) {
        const a = SAMPLE_NODES[i];
        const b = SAMPLE_NODES[j];
        if (!a || !b) continue;
        const dist = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
        if (dist < 2.6) {
          const points = [new THREE.Vector3(a.x, a.y, a.z), new THREE.Vector3(b.x, b.y, b.z)];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(lineGeo, lineMat);
          nodeGroup.add(line);
        }
      }
    }

    // Dynamic Starfield Nebula Dust
    const particleCount = 220;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      particlePositions[i] = (Math.random() - 0.5) * 16;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.03,
      transparent: true,
      opacity: 0.45,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff2247, 2.5, 20); // Adobe Red light
    pointLight1.position.set(6, 6, 6);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00e5ff, 2, 20); // Cyan light
    pointLight2.position.set(-6, -6, 6);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x8b5cf6, 1.8, 20); // Violet fill
    pointLight3.position.set(0, 7, -3);
    scene.add(pointLight3);

    // Mouse Interaction with Smooth Inertia
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const clientX = event.clientX - rect.left;
      const clientY = event.clientY - rect.top;

      mouse.x = (clientX / rect.width) * 2 - 1;
      mouse.y = -(clientY / rect.height) * 2 + 1;

      targetRotationY = mouse.x * 0.45;
      targetRotationX = -mouse.y * 0.45;
    };

    container.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 800;
      const newHeight = container.clientHeight || 420;
      if (newWidth <= 0 || newHeight <= 0) return;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    let isVisible = true;
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined' && container) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry?.isIntersecting ?? true;
        },
        { threshold: 0.05 }
      );
      observer.observe(container);
    }

    const startTime = performance.now();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Continuous subtle orbital rotation with mouse tilt
      nodeGroup.rotation.y += 0.0025;
      nodeGroup.rotation.x += (targetRotationX - nodeGroup.rotation.x) * 0.04;
      nodeGroup.rotation.y += (targetRotationY - (nodeGroup.rotation.y % (Math.PI * 2))) * 0.02;

      // Pulse halos subtly
      meshes.forEach(({ halo }, idx) => {
        const pulse = 1 + Math.sin(elapsedTime * 2 + idx) * 0.12;
        halo.scale.set(pulse, pulse, pulse);
      });

      particleSystem.rotation.y = elapsedTime * 0.015;

      // Raycasting Hover Detection
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshes.map((m) => m.mesh));

      if (intersects.length > 0 && intersects[0]) {
        const firstObj = intersects[0].object;
        const found = meshes.find((m) => m.mesh === firstObj);
        if (found) {
          setHoveredNode(found.data);
          (found.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.6;
        }
      } else {
        setHoveredNode(null);
        meshes.forEach((m) => {
          (m.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      observer?.disconnect();
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
    <div className="relative w-full h-[420px] rounded-3xl overflow-hidden specular-card border border-white/[0.08]">
      {/* 3D Canvas Ref */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Status Overlay */}
      <div className="absolute top-5 left-5 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-2 rounded-xl bg-black/60 px-3.5 py-1.5 backdrop-blur-xl border border-white/10 text-xs font-mono">
          <span className="h-2 w-2 rounded-full bg-[#ff2247] animate-ping" />
          <span className="text-white font-semibold">pgvector 384-Dim Cluster Projection</span>
        </div>
        <div className="rounded-xl bg-black/60 px-3 py-1.5 backdrop-blur-xl border border-white/10 text-[11px] font-mono text-slate-400">
          Metric: Cosine Distance &lt;=&gt;
        </div>
      </div>

      {/* Top Right Spectrum Legend */}
      <div className="absolute top-5 right-5 z-10 flex flex-col gap-2 rounded-2xl bg-black/60 p-3.5 backdrop-blur-xl border border-white/10 text-[11px]">
        <div className="flex items-center gap-2 text-zinc-300 font-medium">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffb347] shadow-[0_0_8px_#ffb347]" />
          <span>AEM Content Core</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-300 font-medium">
          <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]" />
          <span>pgvector RAG Chunks</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-300 font-medium">
          <span className="h-2.5 w-2.5 rounded-full bg-[#3b82f6] shadow-[0_0_8px_#3b82f6]" />
          <span>Target Rules Engine</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-300 font-medium">
          <span className="h-2.5 w-2.5 rounded-full bg-[#e8380d] shadow-[0_0_8px_#e8380d]" />
          <span>Agent Publish Tools</span>
        </div>
      </div>

      {/* Floating Raycaster Tooltip Inspection */}
      {hoveredNode && (
        <div className="absolute bottom-5 left-5 z-10 max-w-sm rounded-2xl bg-black/85 p-4 backdrop-blur-2xl border border-[#ff2247]/40 shadow-2xl shadow-black/80 transition-all">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#ff2247] font-bold">
              {hoveredNode.category.replace('_', ' ')}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Cosine Similarity: {Math.round(hoveredNode.similarity * 100)}%
            </span>
          </div>
          <h4 className="mt-1.5 text-sm font-semibold text-white leading-snug">{hoveredNode.title}</h4>
          <p className="mt-1 text-[11px] text-slate-400 font-mono">
            Vector ID: {hoveredNode.id} • 3D Projection: ({hoveredNode.x.toFixed(2)}, {hoveredNode.y.toFixed(2)}, {hoveredNode.z.toFixed(2)})
          </p>
        </div>
      )}

      {/* Footer Details */}
      <div className="absolute bottom-5 right-5 z-10 pointer-events-none text-right">
        <span className="text-[10px] font-mono text-slate-500 tracking-wider">
          THREE.JS WEBGL • ORBIT CAMERA PARALLAX • {SAMPLE_NODES.length} ACTIVE EMBEDDINGS
        </span>
      </div>
    </div>
  );
}
