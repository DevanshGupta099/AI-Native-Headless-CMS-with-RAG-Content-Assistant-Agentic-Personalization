'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Building2, ChevronDown, Check, ShieldCheck, Database } from 'lucide-react';
import { useWorkspace } from '@/context/WorkspaceContext';

export default function WorkspaceSwitcher() {
  const { currentWorkspace, setWorkspaceById, workspaces } = useWorkspace();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 transition text-left group"
        aria-label="Switch organizational workspace"
      >
        <div
          className="h-6 w-6 rounded-lg flex items-center justify-center shrink-0 border border-white/10 shadow-sm"
          style={{ backgroundColor: `${currentWorkspace.accentColor}25` }}
        >
          <Building2 className="h-3.5 w-3.5" style={{ color: currentWorkspace.accentColor }} />
        </div>
        <div className="hidden sm:block min-w-0">
          <p className="text-xs font-semibold text-zinc-200 truncate group-hover:text-white transition">
            {currentWorkspace.name}
          </p>
          <p className="text-[10px] font-mono text-zinc-400 truncate">{currentWorkspace.industry}</p>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300 transition shrink-0 ml-0.5" />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-72 surface-overlay rounded-2xl border border-white/15 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-white/[0.08] mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Select Tenant Workspace
            </span>
          </div>

          <div className="space-y-1">
            {workspaces.map((w) => {
              const isSelected = w.id === currentWorkspace.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => {
                    setWorkspaceById(w.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition ${
                    isSelected
                      ? 'bg-gradient-to-r from-white/[0.08] to-white/[0.03] border border-white/15'
                      : 'hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <div
                    className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border border-white/10 mt-0.5"
                    style={{ backgroundColor: `${w.accentColor}25` }}
                  >
                    <Building2 className="h-4 w-4" style={{ color: w.accentColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-zinc-200 truncate">{w.name}</p>
                      {isSelected && <Check className="h-3.5 w-3.5 text-[#FFB347] shrink-0" />}
                    </div>
                    <p className="text-[11px] text-zinc-400">{w.industry}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Database className="h-2.5 w-2.5 text-blue-400" />
                        <span>{w.vectorNamespace}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="h-2.5 w-2.5 text-emerald-400" />
                        <span>{w.slaTarget}</span>
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
