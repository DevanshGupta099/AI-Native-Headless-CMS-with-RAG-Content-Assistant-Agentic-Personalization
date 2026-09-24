# Author Studio Frontend Documentation

## Overview

**Author Studio** (`apps/author-studio/`) is an internal administrative single-page experience designed for content authors, SEO strategists, and marketing managers. It provides a visual authoring environment combined with AI-native copiloting.

## Key Views

1. **Content Hub (`/content`)**:
   - Filterable datagrid across content types (`BLOG_POST`, `LANDING_PAGE`, `PRODUCT_PAGE`) and statuses (`DRAFT`, `PUBLISHED`, `ARCHIVED`).
   - Quick search and batch status actions.
2. **Editor Workspace (`/content/[id]`)**:
   - Structured JSON/rich block editor.
   - Version history timeline allowing side-by-side visual diffs.
   - "Prep for Publish" action bar triggering the multi-step agent flow.
3. **Agent Trace Inspector**:
   - Interactive waterfall timeline rendering tool execution durations, input parameters, and generated recommendations with one-click editor approvals.
4. **Embedded RAG Chat Assistant**:
   - Persistent slide-out drawer providing grounded chat over the entire content corpus with clickable source badges.

## Component Hierarchy

```
AppLayout
├── GlobalHeader (User profile, quick actions, environment indicator)
├── SidebarNav (Content, AI Assistant, Personalization Segments, Evaluation)
└── MainContainer
    ├── ContentListView
    │   ├── FilterBar
    │   └── ContentTable
    └── ContentEditorView
        ├── EditorHeader (Status badge, Version selector, Publish button)
        ├── BlockEditor (Structured JSON fields)
        ├── AgentTracePanel (Execution timeline & Human-in-the-loop checklist)
        └── VersionHistoryDrawer
```
