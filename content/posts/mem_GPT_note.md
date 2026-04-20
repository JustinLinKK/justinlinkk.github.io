---
title: 'Paper Notes: MemGPT: Towards LLMs as Operating Systems'
date: 2026-04-20
permalink: /posts/2026/04/memgpt/
tags:
  - research-notes
  - llm
  - systems
draft: false
paper:
  title: 'MemGPT: Towards LLMs as Operating Systems'
  authors: 'Packer et al.'
  venue: 'arXiv 2024'
  link: 'https://arxiv.org/abs/2310.08560'
---

## TL;DR
- LLMs are limited by fixed context windows, restricting long-term reasoning.
- MemGPT introduces an OS-inspired memory hierarchy with paging between context and external storage.
- Key takeaway: treat LLMs like systems with memory management rather than scaling context size.

## Bibliographic Snapshot
| Field | Detail |
| --- | --- |
| Citation | `Packer et al., 2024` |
| Keywords | memory, agents, LLM systems |
| Dataset / Benchmarks | MSC, document QA, KV retrieval |
| Code / Repo | https://research.memgpt.ai |

## Problem Statement
LLMs suffer from limited context windows, making long conversations and document reasoning difficult. Scaling context is computationally expensive and inefficient. The paper aims to provide “infinite context” illusion without modifying the underlying model.

## Core Idea
1. Treat LLM as OS with **memory hierarchy**
2. Two memory types:
   - Main context (prompt tokens)
   - External storage (recall + archival)
3. Key mechanisms:
   - Paging (move data in/out of context)
   - Function calls for memory ops
   - FIFO queue + summarization
4. Control flow:
   - LLM decides when to retrieve, store, or evict

## Visual / Diagram Notes
- Figure 3 (page 3) shows architecture:
  - System instructions + working context + FIFO queue
  - External storage accessed via functions
- Figure 1–2 (page 2): shows memory pressure → paging behavior

## Key Results
- Deep memory retrieval improves accuracy significantly (e.g., +GPT-4 from ~32% → 92% accuracy)
- Handles long conversations with better consistency
- Enables multi-hop retrieval (nested KV task)
- Limitation: depends heavily on retrieval quality and function-calling reliability

## Personal Analysis
**What worked**:
- Strong systems analogy (virtual memory → LLM memory)
- Practical workaround vs scaling transformers
- Works well for long-context tasks

**What puzzled you**:
- Overhead of repeated function calls
- Latency and cost concerns in real deployment

## Connections & Related Work
- Extends RAG → but adds control + memory hierarchy
- Related to LLM agents and tool use
- Bridges systems + ML (OS abstraction)

## Implementation Sketch
- Use LLM with function calling (GPT-4 style)
- Build:
  - Working memory buffer
  - External DB (vector + storage)
- Implement:
  - Retrieval
  - Summarization
  - Memory eviction policy

## Open Questions / Next Actions
- How to optimize retrieval latency?
- Can memory policies be learned instead of prompted?
- How does it compare to long-context transformers?

## Glossary
- Working context: active prompt memory
- Recall storage: searchable history
- Archival storage: long-term memory