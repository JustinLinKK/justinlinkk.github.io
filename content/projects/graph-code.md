---
title: "GraphCode: Graph-Native Architecture IDE"
date: 2026-06-30
excerpt: "Active prototype for a graph-native, human-in-the-loop architecture IDE that turns repository structure into an inspectable graph workspace for planning, scoped AI proposals, and code review.<br/><img src='/images/projects/graph-code/system-architecture-overview.png'>"
collection: projects
---

# Project Title: GraphCode: Graph-Native Architecture IDE

## Project Overview
GraphCode is an active prototype for a **graph-native, human-in-the-loop architecture IDE** for large multi-file software systems. The core idea is to make a repository's structure visible, editable, and reviewable through graph nodes that stay linked to real source code.

- **GitHub Repository:** [JustinLinKK/graph-code](https://github.com/JustinLinKK/graph-code)

Instead of treating the codebase as a pile of files or handing the whole repository to an opaque agent, GraphCode uses the graph as the working surface. Modules, files, functions, workflow blocks, dependencies, source ranges, and AI proposals become explicit objects that a developer can inspect before making changes.

<div class="project-image-grid">
  <figure>
    <img src="/images/projects/graph-code/system-architecture-overview.png" alt="GraphCode architecture overview showing frontend, backend, shared model, tooling, and module boundaries" loading="lazy" class="project-image-grid__contain">
    <figcaption>Repository-level architecture canvas for the GraphCode self workspace.</figcaption>
  </figure>
  <figure>
    <img src="/images/projects/graph-code/hashpath-workflow-canvas.png" alt="GraphCode function workflow canvas showing input, process, output, and format nodes for hashPath" loading="lazy" class="project-image-grid__contain">
    <figcaption>Function-level workflow view with typed data-flow blocks and generated edges.</figcaption>
  </figure>
  <figure>
    <img src="/images/projects/graph-code/structure-sidebar.png" alt="GraphCode structure sidebar with nested modules, objects, and graph contract entities" loading="lazy" class="project-image-grid__contain">
    <figcaption>Structure sidebar for navigating modules, objects, and shared graph-model entities.</figcaption>
  </figure>
</div>

## Product Thesis
Modern repository-scale engineering sits between two uncomfortable extremes:

- manual file-by-file navigation, where architecture and impact are hard to keep in mind;
- autonomous coding agents, where the reasoning and blast radius can be hard to inspect.

GraphCode explores a middle path. The graph is not just a diagram; it is a control surface for understanding, planning, editing, reviewing, and refreshing a codebase.

The design principles are:

- **Real code objects:** graph nodes represent concrete repository entities, not decorative boxes.
- **Stable identity:** nodes keep deterministic IDs, source paths, line ranges, summaries, dependencies, and state.
- **Scoped AI work:** coding agents should propose changes for a selected node or subgraph instead of silently mutating the whole repo.
- **Review-first workflow:** generated diffs, tests, and impact hints should be inspected before acceptance.
- **Progressive views:** dense graphs need search, grouping, collapse, filters, and task-specific canvases.

## Core Workflow
The prototype is organized around a repository-to-graph loop:

```text
Target repository
  -> parser scan
  -> graph snapshot
  -> local SQLite workspace
  -> React Flow canvas
  -> node inspection and scoped agent prompt
  -> proposed diff or graph patch
  -> human review
  -> graph refresh
```

This makes GraphCode a software-engineering workspace rather than a pure visualization tool. The graph is meant to help answer practical questions: what owns this function, what depends on it, what workflow blocks are inside it, and how large is the impact if I ask an agent to change it?

## System Architecture
The current prototype is a TypeScript monorepo with a local-first design:

- **Web Workspace:** React, Vite, HeroUI, and React Flow render the interactive graph canvas, structure tree, inspectors, settings, and editor dialogs.
- **Local Server:** Fastify serves project, hierarchy, canvas, node detail, layout, settings, scanning, and block-editing APIs.
- **Local Persistence:** SQLite stores generated graph state, node layouts, workspace metadata, settings, proposals, and runtime artifacts under `.graphcode/`.
- **Shared Graph Model:** Zod-backed DTOs define graph nodes, edges, workspaces, settings, agent runs, code proposals, hierarchy data, and canvas responses.
- **Parser Package:** the TypeScript parser scans `.ts`, `.tsx`, `.js`, and `.jsx` files into stable graph entities with source paths and line ranges.
- **Agent Runtime:** provider adapters produce reviewable outputs such as text, graph patches, scan JSON, or unified diffs.

## Implementation Details
The repository is split into focused apps and packages:

- **`apps/web`:** the browser workspace, including the architecture canvas, node cards, hierarchy tree, inspectors, settings page, and workspace dialogs.
- **`apps/local-server`:** the Fastify API boundary, SQLite repository layer, ELK layout integration, workspace initialization, and scan refresh flow.
- **`packages/graph-model`:** shared graph contracts for nodes, edges, hierarchy, workspace settings, agent configuration, runs, and proposals.
- **`packages/parser`:** repository scanner that emits deterministic software entities, nested ownership, local imports, lightweight call edges, and per-function workflow blocks.
- **`packages/agent-runtime`:** proposal-oriented agent orchestration with providers for fake/local demos, hosted chat providers, Codex CLI, and Claude Code.

The current development fixture is the GraphCode repository itself. Running `pnpm seed` rebuilds the self workspace, and `pnpm dev` starts the local server and web app together.

## Technical Highlights
- **Self-Repo Graph:** GraphCode can seed and visualize its own architecture as a working demo dataset.
- **Architecture and Workflow Views:** the UI supports repository-level module boundaries and lower-level function workflow canvases.
- **Typed Node System:** modules, objects, inputs, outputs, formats, processes, and boundaries have distinct visual treatment.
- **Source-Aware Parsing:** generated rows preserve source paths, line ranges, and parent ownership for scanned code entities.
- **Proposal-Based Agents:** agent providers are asked to return proposals, diffs, or scan data rather than directly editing the workspace.
- **CLI Provider Support:** Codex CLI and Claude Code can be configured as local account-based providers while GraphCode keeps changes reviewable.

## Current Status
GraphCode is an **active local prototype**, not a finished hosted product. The current repo includes:

- a working local server and SQLite workspace;
- a React graph workspace with screenshots from the self-repo demo;
- parser support for TypeScript-family repositories;
- local, medium, and global scanning concepts;
- settings and provider validation for agent workflows;
- tests around routes, graph models, parser output, and agent behavior.

## Limitations and Next Steps
- **Naming:** the project name is still a working title and may need to change before public launch.
- **Language Coverage:** the parser currently focuses on TypeScript-family repositories.
- **Graph Density:** large repositories need stronger filtering, clustering, and task-specific views to avoid unreadable canvases.
- **Agent Loop Maturity:** proposal generation, review cards, test execution, and accept/reject flows still need product hardening.
- **Deployment Model:** the prototype is local-first; hosted collaboration and multi-user workflows are future concerns.

## Why It Matters
GraphCode is my attempt to make AI-assisted software engineering more inspectable. The goal is not to replace the developer with an agent, but to give the developer a better interface for seeing system structure, choosing the right edit scope, and reviewing proposed changes with architectural context.

The long-term direction is a workspace where repository understanding, graph memory, scoped code generation, impact analysis, and human review all live in one loop.
