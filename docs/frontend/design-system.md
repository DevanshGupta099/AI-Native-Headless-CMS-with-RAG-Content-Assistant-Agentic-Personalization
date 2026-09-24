# Design System & Creative Technology

## Overview
ContentPilot AI adopts an **Adobe Enterprise Cloud** dark-luxury design architecture (AEM + Target + Sensei GenAI). It eliminates emojis, generic templates, and AI slop in favor of:
- **WebGL / Three.js 3D Visualizations**: Interactive real-time vector constellations and particle wave surfaces.
- **Framer Motion Micro-Interactions**: Dynamic layout-id transitions, staggered table entries, and hover physics.
- **Precision Lucide SVG Icons**: Crisp vector typography across all modules.
- **Glassmorphic Surface Hierarchy**: Zinc/slate-950 canvas with hairline borders (`border-white/[0.08]`) and radial glow meshes.

---

## 3D WebGL / Three.js Visual Canvases

### 1. VectorSpaceCanvas (`apps/author-studio/src/components/canvas/VectorSpaceCanvas.tsx`)
- **Technology**: Three.js WebGL Perspective Camera with fog and StandardMaterials.
- **Purpose**: Real-time 3D projection of 384-dimensional pgvector semantic embeddings.
- **Features**:
  - Interactive mouse parallax & orbit camera rotation.
  - Multi-cluster color encoding:
    - **Indigo**: AEM Content Core
    - **Emerald**: RAG Vector Chunks
    - **Cyan**: Adobe Target Personalization Rules
    - **Rose**: Autonomous Agent Publish Tools
  - Dynamic neural similarity lines connecting close cosine distance nodes (`< 2.5` units).
  - Raycaster ray collision detection on mouse hover displaying title, category, chunk ID, and similarity percentage.

### 2. NeuralFlowCanvas (`apps/delivery-site/src/components/canvas/NeuralFlowCanvas.tsx`)
- **Technology**: Three.js BufferGeometry with dynamic vertex wave calculation.
- **Purpose**: Visual representation of real-time edge personalization streaming.
- **Features**:
  - 65x45 particle wave mesh evaluated via combined sine/cosine displacement equations.
  - Color gradient interpolated across cyan, indigo, and purple spectrums.
  - Parallax tilt responding to cursor movement.

---

## Iconography & Typography

- **Zero Emojis Policy**: No emoji glyphs are permitted in platform code. All icons are rendered as accessible, semantic Lucide SVG components (`Sparkles`, `Cpu`, `Layers`, `FileText`, `Target`, `Activity`, `Database`, `ShieldCheck`, etc.).
- **Typography Tokens**: Monospace data indicators for embedding dimensions (`384-dim`), version numbers (`v2`), and latency metrics (`14ms SLA`).

---

## Color Tokens & Glassmorphic Utilities

```css
/* Dark Luxury Theme */
--background: #080b11;
--surface-glass: rgba(13, 17, 28, 0.75);
--surface-border: rgba(255, 255, 255, 0.08);
--accent-indigo: #6366f1;
--accent-cyan: #06b6d4;
--accent-emerald: #10b981;
```
