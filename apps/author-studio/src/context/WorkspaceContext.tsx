'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Workspace {
  id: string;
  slug: string;
  name: string;
  industry: string;
  vectorNamespace: string;
  slaTarget: string;
  accentColor: string;
}

export const WORKSPACES: Workspace[] = [
  {
    id: 'ws-1',
    slug: 'adobe-experience-store',
    name: 'Adobe Experience Store',
    industry: 'Retail & Digital Commerce',
    vectorNamespace: 'ns-adobe-retail',
    slaTarget: '< 12ms',
    accentColor: '#E8380D',
  },
  {
    id: 'ws-2',
    slug: 'financial-services',
    name: 'Enterprise Financial Cloud',
    industry: 'FinTech, Banking & Compliance',
    vectorNamespace: 'ns-fintech-secure',
    slaTarget: '< 8ms',
    accentColor: '#3B82F6',
  },
  {
    id: 'ws-3',
    slug: 'media-entertainment',
    name: 'Global Media & Streaming',
    industry: 'Broadcasting, Press & Video',
    vectorNamespace: 'ns-media-stream',
    slaTarget: '< 15ms',
    accentColor: '#10B981',
  },
];

interface WorkspaceContextType {
  currentWorkspace: Workspace;
  setWorkspaceById: (id: string) => void;
  workspaces: Workspace[];
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>(WORKSPACES[0]!);

  useEffect(() => {
    const saved = localStorage.getItem('cp_workspace_id');
    if (saved) {
      const found = WORKSPACES.find((w) => w.id === saved || w.slug === saved);
      if (found) {
        setCurrentWorkspace(found);
      }
    }
  }, []);

  const setWorkspaceById = (id: string) => {
    const target = WORKSPACES.find((w) => w.id === id || w.slug === id);
    if (target) {
      setCurrentWorkspace(target);
      localStorage.setItem('cp_workspace_id', target.id);
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        setWorkspaceById,
        workspaces: WORKSPACES,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
