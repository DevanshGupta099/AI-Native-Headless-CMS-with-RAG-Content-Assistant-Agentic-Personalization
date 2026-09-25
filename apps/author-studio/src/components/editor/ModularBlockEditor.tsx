'use client';

import React, { useState } from 'react';
import {
  Heading1,
  Pilcrow,
  Sparkles,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Code2,
  TrendingUp,
  Copy,
  Check,
  Wand2,
  FileCode,
  Layers,
} from 'lucide-react';

export interface ContentBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'callout' | 'metric' | 'code' | 'quote';
  content: string;
  meta?: {
    level?: 1 | 2 | 3;
    metricValue?: string;
    metricLabel?: string;
    language?: string;
  };
}

interface ModularBlockEditorProps {
  initialBlocks?: ContentBlock[];
  initialText?: string;
  onChange: (blocks: ContentBlock[], plainText: string) => void;
  onAiAssistedEdit?: (prompt: string, currentContent: string) => Promise<string>;
}

export default function ModularBlockEditor({
  initialBlocks,
  initialText,
  onChange,
  onAiAssistedEdit,
}: ModularBlockEditorProps) {
  // Convert initialText into default blocks if no initialBlocks provided
  const parseInitialBlocks = (): ContentBlock[] => {
    if (initialBlocks && initialBlocks.length > 0) return initialBlocks;
    if (!initialText || !initialText.trim()) {
      return [
        { id: 'b-1', type: 'heading', content: 'Modern Enterprise Architecture', meta: { level: 1 } },
        { id: 'b-2', type: 'paragraph', content: 'Decoupling presentation from content delivery enables ultra-low latency edge performance and AI-driven personalization.' },
      ];
    }

    const lines = initialText.split('\n\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) {
        return { id: `b-${idx}`, type: 'heading', content: trimmed.replace(/^#\s+/, ''), meta: { level: 1 } };
      } else if (trimmed.startsWith('## ')) {
        return { id: `b-${idx}`, type: 'heading', content: trimmed.replace(/^##\s+/, ''), meta: { level: 2 } };
      } else if (trimmed.startsWith('> ')) {
        return { id: `b-${idx}`, type: 'callout', content: trimmed.replace(/^>\s+/, '') };
      } else {
        return { id: `b-${idx}`, type: 'paragraph', content: trimmed };
      }
    });
  };

  const [blocks, setBlocks] = useState<ContentBlock[]>(parseInitialBlocks);
  const [viewMode, setViewMode] = useState<'visual' | 'raw'>('visual');
  const [aiLoadingBlockId, setAiLoadingBlockId] = useState<string | null>(null);
  const [copiedRaw, setCopiedRaw] = useState(false);

  const blocksToText = (bList: ContentBlock[]): string => {
    return bList
      .map((b) => {
        if (b.type === 'heading') {
          const hashes = '#'.repeat(b.meta?.level || 1);
          return `${hashes} ${b.content}`;
        }
        if (b.type === 'callout') return `> [!NOTE]\n> ${b.content}`;
        if (b.type === 'quote') return `> "${b.content}"`;
        if (b.type === 'metric') return `[METRIC: ${b.meta?.metricValue || '0'} | ${b.meta?.metricLabel || b.content}]`;
        if (b.type === 'code') return `\`\`\`${b.meta?.language || 'typescript'}\n${b.content}\n\`\`\``;
        return b.content;
      })
      .join('\n\n');
  };

  const notifyChange = (updated: ContentBlock[]) => {
    setBlocks(updated);
    onChange(updated, blocksToText(updated));
  };

  const handleUpdateBlockContent = (id: string, newContent: string) => {
    const updated = blocks.map((b) => (b.id === id ? { ...b, content: newContent } : b));
    notifyChange(updated);
  };

  const handleUpdateBlockMeta = (id: string, metaPatch: Partial<NonNullable<ContentBlock['meta']>>) => {
    const updated = blocks.map((b) =>
      b.id === id ? { ...b, meta: { ...(b.meta || {}), ...metaPatch } } : b
    );
    notifyChange(updated);
  };

  const handleAddBlock = (type: ContentBlock['type']) => {
    const newId = `b-${Date.now()}`;
    const newBlock: ContentBlock = {
      id: newId,
      type,
      content:
        type === 'heading'
          ? 'New Section Heading'
          : type === 'callout'
          ? 'AI-suggested highlight or key executive takeaway.'
          : type === 'metric'
          ? 'Sub-15ms Latency'
          : type === 'code'
          ? 'export const config = { edgeDelivery: true };'
          : 'Write clear, impactful editorial content for this section...',
      meta:
        type === 'heading'
          ? { level: 2 }
          : type === 'metric'
          ? { metricValue: '99.9%', metricLabel: 'Delivery SLA' }
          : type === 'code'
          ? { language: 'typescript' }
          : undefined,
    };

    notifyChange([...blocks, newBlock]);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const copy = [...blocks];
    const item = copy[index];
    if (!item) return;
    copy.splice(index, 1);
    copy.splice(targetIdx, 0, item);
    notifyChange(copy);
  };

  const handleDelete = (id: string) => {
    if (blocks.length <= 1) return; // Keep at least one block
    const updated = blocks.filter((b) => b.id !== id);
    notifyChange(updated);
  };

  const handleAiEnhance = async (block: ContentBlock) => {
    if (!onAiAssistedEdit) return;
    setAiLoadingBlockId(block.id);
    try {
      const prompt = `Rewrite and polish this content for an enterprise digital publication. Enhance clarity, active voice, and professional authority without being verbose:\n\n"${block.content}"`;
      const result = await onAiAssistedEdit(prompt, block.content);
      if (result) {
        handleUpdateBlockContent(block.id, result.trim());
      }
    } finally {
      setAiLoadingBlockId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Editor Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('visual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              viewMode === 'visual'
                ? 'bg-gradient-to-r from-[#E8380D] to-[#F56E40] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Modular Blocks ({blocks.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('raw')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              viewMode === 'raw'
                ? 'bg-gradient-to-r from-[#E8380D] to-[#F56E40] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>Raw Markdown</span>
          </button>
        </div>

        {/* Quick Add Toolbar */}
        {viewMode === 'visual' && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider pr-1">Add Block:</span>
            <button
              type="button"
              onClick={() => handleAddBlock('heading')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-xs font-medium text-zinc-300 hover:text-white hover:border-[#E8380D]/40 transition"
              title="Add Heading"
            >
              <Heading1 className="h-3.5 w-3.5 text-[#FFB347]" />
              <span>Heading</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock('paragraph')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-xs font-medium text-zinc-300 hover:text-white hover:border-[#E8380D]/40 transition"
              title="Add Paragraph"
            >
              <Pilcrow className="h-3.5 w-3.5 text-zinc-400" />
              <span>Paragraph</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock('callout')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-xs font-medium text-zinc-300 hover:text-white hover:border-[#E8380D]/40 transition"
              title="Add AI Callout Banner"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#F56E40]" />
              <span>Callout</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock('metric')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-xs font-medium text-zinc-300 hover:text-white hover:border-[#E8380D]/40 transition"
              title="Add Metric Card"
            >
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              <span>Metric</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock('code')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-xs font-medium text-zinc-300 hover:text-white hover:border-[#E8380D]/40 transition"
              title="Add Code Snippet"
            >
              <Code2 className="h-3.5 w-3.5 text-blue-400" />
              <span>Code</span>
            </button>
          </div>
        )}
      </div>

      {/* Visual Blocks Render */}
      {viewMode === 'visual' ? (
        <div className="space-y-3">
          {blocks.map((block, idx) => {
            const isLoadingAi = aiLoadingBlockId === block.id;

            return (
              <div
                key={block.id}
                className="group relative rounded-2xl border border-white/[0.08] bg-[#0c0e14]/90 p-4 transition-all hover:border-[#E8380D]/30 hover:shadow-lg hover:shadow-black/40"
              >
                {/* Block Header & Action Strip */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-400 uppercase tracking-wider font-semibold">
                      {block.type === 'heading'
                        ? `H${block.meta?.level || 2} Heading`
                        : block.type === 'callout'
                        ? 'AI Highlight'
                        : block.type === 'metric'
                        ? 'Metric Card'
                        : block.type === 'code'
                        ? `Code (${block.meta?.language || 'ts'})`
                        : 'Paragraph'}
                    </span>

                    {/* Heading Level Toggles */}
                    {block.type === 'heading' && (
                      <div className="flex items-center gap-1 pl-1">
                        {[1, 2, 3].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => handleUpdateBlockMeta(block.id, { level: lvl as 1 | 2 | 3 })}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition ${
                              (block.meta?.level || 2) === lvl
                                ? 'bg-[#E8380D] text-white'
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            H{lvl}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Move, AI, and Delete Controls */}
                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    {onAiAssistedEdit && (
                      <button
                        type="button"
                        onClick={() => handleAiEnhance(block)}
                        disabled={isLoadingAi}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-[#FFB347] bg-[#E8380D]/10 border border-[#E8380D]/25 hover:bg-[#E8380D]/20 transition disabled:opacity-50"
                        title="AI Polish this block"
                      >
                        <Wand2 className={`h-3 w-3 ${isLoadingAi ? 'animate-spin' : ''}`} />
                        <span>{isLoadingAi ? 'Polishing...' : 'AI Enhance'}</span>
                      </button>
                    )}

                    <div className="h-3 w-px bg-white/10 mx-1" />

                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition"
                      title="Move up"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === blocks.length - 1}
                      className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition"
                      title="Move down"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(block.id)}
                      disabled={blocks.length <= 1}
                      className="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-30 transition"
                      title="Delete block"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Specific Block Inputs */}
                {block.type === 'heading' ? (
                  <input
                    type="text"
                    value={block.content}
                    onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                    className="w-full bg-transparent text-lg font-bold tracking-tight text-white placeholder-zinc-600 focus:outline-none focus:ring-0"
                    placeholder="Heading title..."
                  />
                ) : block.type === 'callout' ? (
                  <div className="flex gap-3 p-3.5 rounded-xl bg-gradient-to-r from-[#E8380D]/10 to-[#FFB347]/05 border-l-2 border-[#E8380D]">
                    <Sparkles className="h-4 w-4 text-[#F56E40] shrink-0 mt-0.5" />
                    <textarea
                      value={block.content}
                      onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                      rows={2}
                      className="w-full bg-transparent text-sm text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none"
                      placeholder="Enter key AI takeaway or callout banner content..."
                    />
                  </div>
                ) : block.type === 'metric' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/20">
                    <div>
                      <label className="text-[10px] font-mono text-emerald-400 uppercase font-semibold block mb-1">
                        Stat Value
                      </label>
                      <input
                        type="text"
                        value={block.meta?.metricValue || ''}
                        onChange={(e) => handleUpdateBlockMeta(block.id, { metricValue: e.target.value })}
                        className="w-full bg-black/40 border border-emerald-500/30 rounded-lg px-2.5 py-1 text-sm font-mono font-bold text-white focus:outline-none"
                        placeholder="e.g. < 15ms"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-emerald-400 uppercase font-semibold block mb-1">
                        Metric Label / Description
                      </label>
                      <input
                        type="text"
                        value={block.content}
                        onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                        className="w-full bg-black/40 border border-emerald-500/30 rounded-lg px-2.5 py-1 text-sm text-white focus:outline-none"
                        placeholder="e.g. Edge Delivery SLA"
                      />
                    </div>
                  </div>
                ) : block.type === 'code' ? (
                  <div className="rounded-xl overflow-hidden border border-white/10 bg-black/80 font-mono text-xs">
                    <div className="px-3 py-1.5 bg-white/[0.04] border-b border-white/10 flex items-center justify-between text-zinc-400 text-[11px]">
                      <span>{block.meta?.language || 'typescript'}</span>
                      <span className="text-[10px] text-zinc-500">Syntax Highlighted Component</span>
                    </div>
                    <textarea
                      value={block.content}
                      onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                      rows={4}
                      className="w-full p-3 bg-transparent text-emerald-300 font-mono text-xs resize-y focus:outline-none"
                      placeholder="Insert code or JSON schema..."
                    />
                  </div>
                ) : (
                  <textarea
                    value={block.content}
                    onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                    rows={3}
                    className="w-full bg-transparent text-sm leading-relaxed text-zinc-200 placeholder-zinc-600 resize-y focus:outline-none"
                    placeholder="Type content paragraph..."
                  />
                )}
              </div>
            );
          })}

          {/* Bottom Add Block Banner */}
          <button
            type="button"
            onClick={() => handleAddBlock('paragraph')}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-white/10 hover:border-[#E8380D]/40 text-xs font-medium text-zinc-400 hover:text-white flex items-center justify-center gap-2 transition bg-white/[0.01] hover:bg-white/[0.03]"
          >
            <Plus className="h-4 w-4 text-[#F56E40]" />
            <span>Add Next Content Block</span>
          </button>
        </div>
      ) : (
        /* Raw Markdown View */
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 pb-1">
            <span>Raw Markdown & JSON Representation</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(blocksToText(blocks));
                setCopiedRaw(true);
                setTimeout(() => setCopiedRaw(false), 2000);
              }}
              className="flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white"
            >
              {copiedRaw ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedRaw ? 'Copied' : 'Copy All'}</span>
            </button>
          </div>
          <textarea
            value={blocksToText(blocks)}
            readOnly
            rows={14}
            className="w-full rounded-2xl border border-white/10 bg-black/60 p-4 font-mono text-xs leading-relaxed text-zinc-200 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
