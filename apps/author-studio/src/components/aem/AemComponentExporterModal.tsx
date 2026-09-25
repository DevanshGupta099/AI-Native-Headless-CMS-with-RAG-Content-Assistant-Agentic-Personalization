'use client';

import React, { useState } from 'react';
import {
  FileCode2,
  Copy,
  Check,
  Download,
  X,
  Layers,
  Sparkles,
  Code2,
  FileText,
} from 'lucide-react';

interface AemComponentExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentTitle?: string;
  contentSlug?: string;
}

export default function AemComponentExporterModal({
  isOpen,
  onClose,
  contentTitle = 'Enterprise Article Hero',
  contentSlug = 'enterprise-article-hero',
}: AemComponentExporterModalProps) {
  const [activeTab, setActiveTab] = useState<'htl' | 'dialog' | 'jcr' | 'sling'>('htl');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const componentName = contentSlug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');

  // 1. HTL Template (content.html)
  const htlCode = `<!--/*
    ContentPilot AI - AEM Core Component HTL Script
    Component: ${componentName}
    Auto-exported from ContentPilot AI Headless Engine
*/-->
<div data-sly-use.model="com.contentpilot.aem.core.models.${componentName}Model"
     class="cmp-contentpilot-${contentSlug} \${properties.personalizationEnabled ? 'cmp-contentpilot--personalized' : ''}"
     id="\${model.id}"
     data-cmp-data-layer="\${model.dataLayerJson}">

    <!--/* Personalization Edge Indicator */-->
    <sly data-sly-test="\${properties.enableTargetSync}">
        <meta name="cq:target-segment" content="\${model.targetSegment}" />
    </sly>

    <div class="cmp-contentpilot__container">
        <sly data-sly-test="\${model.badge}">
            <span class="cmp-contentpilot__badge">\${model.badge}</span>
        </sly>

        <h1 class="cmp-contentpilot__title">\${model.title || '${contentTitle}'}</h1>

        <sly data-sly-test="\${model.description}">
            <p class="cmp-contentpilot__description">\${model.description}</p>
        </sly>

        <sly data-sly-test="\${model.ctaLink}">
            <a href="\${model.ctaLink}" class="cmp-contentpilot__cta \${model.ctaStyleClass}">
                <span>\${model.ctaText || 'Learn More'}</span>
            </a>
        </sly>
    </div>
</div>`;

  // 2. Granite UI Dialog XML (_cq_dialog/.content.xml)
  const dialogXml = `<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
          xmlns:granite="http://www.adobe.com/jcr/granite/1.0"
          xmlns:cq="http://www.day.com/jcr/cq/1.0"
          xmlns:jcr="http://www.jcp.org/jcr/1.0"
          xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
          jcr:primaryType="nt:unstructured"
          jcr:title="${contentTitle} Dialog"
          sling:resourceType="cq/gui/components/coral/common/tabs">
    <items jcr:primaryType="nt:unstructured">
        <tabs jcr:primaryType="nt:unstructured"
              sling:resourceType="granite/ui/components/coral/foundation/tabs"
              maximized="{Boolean}true">
            <items jcr:primaryType="nt:unstructured">
                <!-- Properties Tab -->
                <properties jcr:primaryType="nt:unstructured"
                            jcr:title="Properties"
                            sling:resourceType="granite/ui/components/coral/foundation/container">
                    <items jcr:primaryType="nt:unstructured">
                        <title jcr:primaryType="nt:unstructured"
                               sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
                               name="./title"
                               fieldLabel="Title"
                               required="{Boolean}true" />
                        <description jcr:primaryType="nt:unstructured"
                                     sling:resourceType="granite/ui/components/coral/foundation/form/textarea"
                                     name="./description"
                                     fieldLabel="Description" />
                        <ctaLink jcr:primaryType="nt:unstructured"
                                 sling:resourceType="granite/ui/components/coral/foundation/form/pathfield"
                                 name="./ctaLink"
                                 fieldLabel="CTA Target Path"
                                 rootPath="/content" />
                    </items>
                </properties>
                <!-- GenAI & Personalization Tab -->
                <genai jcr:primaryType="nt:unstructured"
                       jcr:title="ContentPilot AI & Target"
                       sling:resourceType="granite/ui/components/coral/foundation/container">
                    <items jcr:primaryType="nt:unstructured">
                        <enableTargetSync jcr:primaryType="nt:unstructured"
                                          sling:resourceType="granite/ui/components/coral/foundation/form/checkbox"
                                          name="./enableTargetSync"
                                          text="Sync with Adobe Target Edge"
                                          value="true" />
                        <ragVectorEmbeddingId jcr:primaryType="nt:unstructured"
                                              sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
                                              name="./vectorEmbeddingId"
                                              fieldLabel="pgvector Chunk ID"
                                              readOnly="{Boolean}true" />
                    </items>
                </genai>
            </items>
        </tabs>
    </items>
</jcr:root>`;

  // 3. JCR Component Definition (.content.xml)
  const jcrXml = `<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0"
          xmlns:jcr="http://www.jcp.org/jcr/1.0"
          jcr:primaryType="cq:Component"
          jcr:title="${contentTitle}"
          jcr:description="ContentPilot AI generated component with automated AEM & Target bindings"
          componentGroup="ContentPilot AI - Core Experience"/>`;

  // 4. Apache Sling Model Java Interface
  const slingJava = `package com.contentpilot.aem.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

/**
 * Sling Model for ${componentName}
 * Implements Adobe Core Component architecture with GenAI vector bindings.
 */
@Model(adaptables = Resource.class,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL,
       resourceType = "contentpilot/components/content/${contentSlug}")
public interface ${componentName}Model {

    @ValueMapValue
    String getTitle();

    @ValueMapValue
    String getDescription();

    @ValueMapValue
    String getBadge();

    @ValueMapValue
    String getCtaLink();

    @ValueMapValue
    String getCtaText();

    @ValueMapValue
    boolean isEnableTargetSync();

    @ValueMapValue
    String getVectorEmbeddingId();
}`;

  const currentCode =
    activeTab === 'htl'
      ? htlCode
      : activeTab === 'dialog'
      ? dialogXml
      : activeTab === 'jcr'
      ? jcrXml
      : slingJava;

  const currentFilename =
    activeTab === 'htl'
      ? `${contentSlug}.html`
      : activeTab === 'dialog'
      ? '_cq_dialog/.content.xml'
      : activeTab === 'jcr'
      ? '.content.xml'
      : `${componentName}Model.java`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFilename.replace('/', '_');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl surface-overlay border border-white/15 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#E8380D] to-[#FFB347] flex items-center justify-center shadow-md shadow-[#E8380D]/30">
              <FileCode2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Export to Adobe Experience Manager (AEM)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E8380D]/20 text-[#FFB347] border border-[#E8380D]/30 font-semibold">
                  AEM 6.5 & AEMaaCS
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Generated production-ready HTL scripts, Coral 3 Dialog XML, and Apache Sling Models.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close export modal"
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* File Tabs & Actions */}
        <div className="px-6 py-3 bg-black/40 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#09090b] border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('htl')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'htl'
                  ? 'bg-gradient-to-r from-[#E8380D] to-[#F56E40] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>HTL Script (HTML)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dialog')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'dialog'
                  ? 'bg-gradient-to-r from-[#E8380D] to-[#F56E40] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Touch UI Dialog (XML)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('jcr')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'jcr'
                  ? 'bg-gradient-to-r from-[#E8380D] to-[#F56E40] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>JCR Component</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sling')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'sling'
                  ? 'bg-gradient-to-r from-[#E8380D] to-[#F56E40] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Sling Model (Java)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white transition"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl btn-firefly text-xs font-semibold transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Code Content Viewer */}
        <div className="p-6 flex-1 overflow-auto bg-[#08090d]">
          <pre className="font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap select-all">
            {currentCode}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-[#09090b]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Target Framework: AEM Core WCM Components v2.24+</span>
          </div>
          <p className="text-zinc-500">Deploy directly into ui.apps / ui.content Maven packages</p>
        </div>
      </div>
    </div>
  );
}
