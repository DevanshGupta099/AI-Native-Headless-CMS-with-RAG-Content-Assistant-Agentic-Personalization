# Delivery Site Frontend Documentation

## Overview

**Delivery Site** (`apps/delivery-site/`) is the public, customer-facing web application. Built on Next.js 15, it leverages Server-Side Rendering (SSR) and Incremental Static Regeneration (ISR) to deliver personalized, SEO-optimized web experiences with low latency.

## Architecture

- **Rendering Strategy**:
  - Dynamic route matching: `/[type]/[slug]` (e.g. `/blog/getting-started`).
  - Next.js Server Components query `/api/personalize/deliver` on every incoming visitor request, passing cookie/session context.
  - If a matched segment variant exists, the page renders the personalized variant body; otherwise, it renders the canonical published draft.
- **Client Footprint**:
  - Zero heavy client-side JavaScript for content rendering.
  - Lightweight impression tracking beacons asynchronously ping `/api/personalize/deliver` telemetry.
