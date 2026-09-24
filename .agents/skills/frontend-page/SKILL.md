---
name: frontend-page
description: |
  Create a new page or component for the Author Studio (admin UI) or Delivery Site (public) 
  in ContentPilot AI. Use when adding new pages, components, or views to either Next.js app.
  Follows App Router conventions with Server Components by default.
---

# Frontend Page / Component Creation Skill

## Architecture Overview

### Author Studio (`apps/author-studio/`)
- Internal admin UI for content editors
- Next.js 15 App Router + TypeScript + Tailwind CSS
- Authentication required (JWT-based)
- Rich features: content editor, chat widget, agent trace viewer, analytics

### Delivery Site (`apps/delivery-site/`)
- Public-facing content rendering
- Next.js 15 SSR/ISR + TypeScript + Tailwind CSS
- No authentication
- Fast, SEO-optimized, personalization-aware

## Directory Structure (Both Apps)

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (fonts, providers, nav)
│   ├── page.tsx            # Home page
│   ├── (auth)/             # Auth routes (login, etc.)
│   └── (dashboard)/        # Protected routes (Author Studio)
│       ├── content/
│       │   ├── page.tsx    # Content list
│       │   ├── new/page.tsx # Create content
│       │   └── [id]/
│       │       ├── page.tsx    # View/edit content
│       │       └── versions/page.tsx # Version history
│       ├── assistant/
│       │   └── page.tsx    # Chat + search interface
│       └── settings/
│           └── page.tsx    # Settings, segments
├── components/
│   ├── ui/                 # Generic UI components (Button, Input, Card, etc.)
│   ├── content/            # Content-specific components
│   ├── chat/               # Chat widget components
│   ├── agent/              # Agent trace viewer components
│   └── layout/             # Layout components (Sidebar, Header, etc.)
├── hooks/
│   ├── useAuth.ts          # Authentication hook
│   ├── useSSE.ts           # SSE streaming hook
│   ├── useApi.ts           # API request hook
│   └── useDebounce.ts
├── lib/
│   ├── api.ts              # API client (fetch wrapper with auth)
│   └── utils.ts            # Utility functions
└── styles/
    └── globals.css         # Tailwind base + custom styles
```

## Creating a New Page

### Step 1: Create the page file

```typescript
// apps/author-studio/src/app/(dashboard)/content/page.tsx

// Server Component by default — fetches data on server
import { ContentList } from '@/components/content/ContentList';
import { apiServer } from '@/lib/api-server'; // server-side API client

export default async function ContentPage() {
  const content = await apiServer.get('/api/content');
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Content</h1>
        <Link href="/content/new">
          <Button>Create New</Button>
        </Link>
      </div>
      <ContentList initialData={content.data} />
    </div>
  );
}
```

### Step 2: Create client components (when interactivity needed)

```typescript
// apps/author-studio/src/components/content/ContentList.tsx
'use client';

import { useState } from 'react';
import { ContentItemResponse } from '@contentpilot/shared';
import { useApi } from '@/hooks/useApi';

interface ContentListProps {
  initialData: ContentItemResponse[];
}

export function ContentList({ initialData }: ContentListProps) {
  const [items, setItems] = useState(initialData);
  const [filter, setFilter] = useState<string>('all');
  
  // ... interactive list with filters, search, pagination
}
```

## API Client Pattern

```typescript
// apps/author-studio/src/lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<{ data: T }> {
    const url = new URL(path, BASE_URL);
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    
    const res = await fetch(url.toString(), {
      headers: {
        'Authorization': this.token ? `Bearer ${this.token}` : '',
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new ApiError(error.error.message, error.error.status, error.error.code);
    }
    
    return res.json();
  }

  async post<T>(path: string, body: unknown): Promise<{ data: T }> {
    // ... similar to get but with body
  }
  
  // ... put, delete methods
}

export const api = new ApiClient();
```

## SSE Hook for Chat

```typescript
// apps/author-studio/src/hooks/useSSE.ts
'use client';

import { useState, useCallback } from 'react';

interface SSEMessage {
  event: string;
  data: unknown;
}

export function useSSE() {
  const [messages, setMessages] = useState<SSEMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const stream = useCallback(async (url: string, body: unknown) => {
    setIsStreaming(true);
    setMessages([]);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.startsWith('event: ')) {
          // Parse SSE event
        }
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          setMessages(prev => [...prev, { event: currentEvent, data }]);
        }
      }
    }
    
    setIsStreaming(false);
  }, []);

  return { messages, isStreaming, stream };
}
```

## Design System

Use these Tailwind tokens consistently:

```css
/* apps/author-studio/src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --accent: 210 40% 96.1%;
    --muted: 210 40% 96.1%;
    --destructive: 0 84.2% 60.2%;
    --border: 214.3 31.8% 91.4%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode tokens */
  }
}
```

## Component Guidelines

1. **Server Components by default** — add `'use client'` only for interactivity
2. **Props over global state** — pass data down, use context only for truly global state (auth, theme)
3. **Shared types from `@contentpilot/shared`** — never redefine types locally
4. **Loading states** — every async operation shows a skeleton or spinner
5. **Error boundaries** — wrap page sections in error boundaries
6. **Accessibility** — proper ARIA labels, keyboard navigation, semantic HTML
