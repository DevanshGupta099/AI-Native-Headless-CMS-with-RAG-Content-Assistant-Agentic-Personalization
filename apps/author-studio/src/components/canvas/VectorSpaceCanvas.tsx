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
  { id: 'vec-1', title: 'Headless CMS Architecture', category: 'AEM_CORE', x: 2.2, y: 1.5, z: -1.2, similarity: 0.96 },
  { id: 'vec-2', title: 'GraphQL Experience Query API', category: 'AEM_CORE', x: 1.8, y: 2.2, z: -0.6, similarity: 0.91 },
  { id: 'vec-3', title: 'pgvector Cosine Distance Index', category: 'RAG_CHUNK', x: -1.5, y: 1.8, z: 2.0, similarity: 0.94 },
  { id: 'vec-4', title: 'Dense Embedding 384-dim Space', category: 'RAG_CHUNK', x: -2.1, y: 1.1, z: 1.6, similarity: 0.89 },
  { id: 'vec-5', title: 'First-time Visitor Persona Rule', category: 'PERSONALIZATION', x: 2.5, y: -1.6, z: 1.2, similarity: 0.93 },
  { id: 'vec-6', title: 'Dynamic Hero Variant Matrix', category: 'PERSONALIZATION', x: 1.9, y: -2.2, z: 0.8, similarity: 0.88 },
  { id: 'vec-7', title: 'Agent Tool: SEO Score Check', category: 'AGENT_TOOL', x: -1.2, y: -1.8, z: -2.1, similarity: 0.97 },
  { id: 'vec-8', title: 'Agent Tool: Meta Generator', category: 'AGENT_TOOL', x: -1.9, y: -1.2, z: -1.8, similarity: 0.95 },
  { id: 'vec-9', title: 'AEM Edge Delivery Pipeline', category: 'AEM_CORE', x: 0.5, y: 2.8, z: -1.5, similarity: 0.92 },
  { id: 'vec-10', title: 'HuggingFace BGE Semantic Vectors', category: 'RAG_CHUNK', x: -0.8, y: 2.4, z: 2.2, similarity: 0.91 },
  { id: 'vec-11', title: 'Enterprise Audience Segmentation', category: 'PERSONALIZATION', x: 3.1, y: -0.7, z: 1.5, similarity: 0.87 },
  { id: 'vec-12', title: 'Human-in-the-Loop Approval Trace', category: 'AGENT_TOOL', x: -2.4, y: -2.0, z: -0.9, similarity: 0.94 },
  { id: 'vec-13', title: 'Real-time SSE Streaming RAG', category: 'RAG_CHUNK', x: -1.1, y: 0.6, z: 2.6, similarity: 0.95 },
  { id: 'vec-14', title: 'Multi-Tenant Content Delivery', category: 'AEM_CORE', x: 2.8, y: 0.8, z: -2.0, similarity: 0.89 },
  { id: 'vec-15', title: 'Personalized CTA Edge Resolver', category: 'PERSONALIZATION', x: 1.4, y: -2.8, z: 1.8, similarity: 0.91 },
];

export default function VectorSpaceCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<NodeData | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 400;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080b11, 0.08);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Color mapper
    const getColor = (category: string) => {
      switch (category) {
        case 'AEM_CORE':
          return 0x6366f1; // Indigo
        case 'RAG_CHUNK':
          return 0x10b981; // Emerald
        case 'PERSONALIZATION':
          return 0x06b6d4; // Cyan
        case 'AGENT_TOOL':
          return 0xf43f5e; // Rose
        default:
          return 0x8b5cf6;
      }
    };

    // Node objects group
    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);

    const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const meshes: { mesh: THREE.Mesh; data: NodeData }[] = [];

    SAMPLE_NODES.forEach((node) => {
      const color = getColor(node.category);
      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8,
      });

      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(node.x, node.y, node.z);
      nodeGroup.add(mesh);
      meshes.push({ mesh, data: node });

      // Add a subtle outer glow halo for each node
      const haloGeo = new THREE.SphereGeometry(0.2, 12, 12);
      const haloMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.25,
        wireframe: true,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(mesh.position);
      nodeGroup.add(halo);
    });

    // Connecting semantic vector lines (connecting nearby nodes)
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.35,
    });

    for (let i = 0; i < SAMPLE_NODES.length; i++) {
      for (let j = i + 1; j < SAMPLE_NODES.length; j++) {
        const a = SAMPLE_NODES[i];
        const b = SAMPLE_NODES[j];
        if (!a || !b) continue;
        const dist = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
        if (dist < 2.5) {
          const points = [new THREE.Vector3(a.x, a.y, a.z), new THREE.Vector3(b.x, b.y, b.z)];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(lineGeo, lineMat);
          nodeGroup.add(line);
        }
      }
    }

    // Ambient floating dust particles
    const particleCount = 180;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      particlePositions[i] = (Math.random() - 0.5) * 14;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x64748b,
      size: 0.035,
      transparent: true,
      opacity: 0.6,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x6366f1, 2, 20);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x10b981, 1.5, 20);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Raycaster for mouse interaction
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

      targetRotationY = mouse.x * 0.4;
      targetRotationX = -mouse.y * 0.4;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 800;
      const newHeight = container.clientHeight || 400;
      if (newWidth <= 0 || newHeight <= 0) return;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Render loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera / group rotation
      nodeGroup.rotation.y += 0.003;
      nodeGroup.rotation.x += (targetRotationX - nodeGroup.rotation.x) * 0.05;
      nodeGroup.rotation.y += (targetRotationY - (nodeGroup.rotation.y % (Math.PI * 2))) * 0.02;

      // Particle gentle sway
      particleSystem.rotation.y = elapsedTime * 0.02;

      // Raycasting
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshes.map((m) => m.mesh));

      if (intersects.length > 0 && intersects[0]) {
        const firstObj = intersects[0].object;
        const found = meshes.find((m) => m.mesh === firstObj);
        if (found) {
          setHoveredNode(found.data);
          (found.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.2;
        }
      } else {
        setHoveredNode(null);
        meshes.forEach((m) => {
          (m.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6;
        });
      }

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
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden glass-panel border border-white/[0.08] bg-[#090d16]">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Overlay Badge */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-md border border-white/10 text-xs font-mono">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-300 font-semibold">pgvector 384-Dim Cluster Projection</span>
        </div>
        <div className="rounded-lg bg-black/60 px-2.5 py-1.5 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-400">
          Cosine Distance &lt;=&gt;
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 rounded-xl bg-black/60 p-3 backdrop-blur-md border border-white/10 text-[11px]">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
          <span>AEM Content Core</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>RAG Vector Chunks</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          <span>Adobe Target Rules</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          <span>Agent Publish Tools</span>
        </div>
      </div>

      {/* Interactive Tooltip Hover */}
      {hoveredNode && (
        <div className="absolute bottom-4 left-4 z-10 max-w-sm rounded-xl bg-slate-900/90 p-3.5 backdrop-blur-lg border border-indigo-500/40 shadow-xl transition-all">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
              {hoveredNode.category.replace('_', ' ')}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">
              Similarity: {Math.round(hoveredNode.similarity * 100)}%
            </span>
          </div>
          <h4 className="mt-1 text-sm font-semibold text-white">{hoveredNode.title}</h4>
          <p className="mt-1 text-[11px] text-slate-400 font-mono">
            ID: {hoveredNode.id} • Dimension coords: ({hoveredNode.x.toFixed(2)}, {hoveredNode.y.toFixed(2)}, {hoveredNode.z.toFixed(2)})
          </p>
        </div>
      )}

      {/* Footer Info */}
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none text-right">
        <span className="text-[10px] font-mono text-slate-500">
          WebGL • Orbit Parallax Enabled • {SAMPLE_NODES.length} Active Embeddings
        </span>
      </div>
    </div>
  );
}
