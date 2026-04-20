---
title: 'Paper Notes: SELF-RAG'
date: 2026-04-20
permalink: /posts/2026/04/self-rag/
tags:
  - research-notes
  - llm
  - rag
draft: false
paper:
  title: 'Self-RAG: Learning to Retrieve, Generate, and Critique'
  authors: 'Asai et al.'
  venue: 'arXiv 2023'
  link: 'https://arxiv.org/abs/2310.11511'
---

## TL;DR
- Standard RAG retrieves blindly and may hurt generation quality.
- SELF-RAG introduces on-demand retrieval + self-reflection using special tokens.
- Key takeaway: LLM learns when to retrieve and how to critique its own outputs.

## Bibliographic Snapshot
| Field | Detail |
| --- | --- |
| Citation | `Asai et al., 2023` |
| Keywords | RAG, self-reflection, retrieval |
| Dataset / Benchmarks | PopQA, TriviaQA, ARC, ASQA |
| Code / Repo | https://selfrag.github.io |

## Problem Statement
RAG improves factuality but retrieves information indiscriminately, leading to noise and inefficiency. Additionally, LLMs are not trained to verify whether outputs are supported by retrieved data. The paper aims to make retrieval adaptive and self-aware.

## Core Idea
1. Introduce **reflection tokens**:
   - Retrieve (when to retrieve)
   - ISREL (relevance)
   - ISSUP (support)
   - ISUSE (utility)
2. Pipeline:
   - Decide → Retrieve → Generate → Critique
3. Train LLM to:
   - Retrieve on demand
   - Evaluate its own outputs
4. Inference:
   - Beam search with critique scoring

## Visual / Diagram Notes
- Figure 1 (page 2):
  - RAG vs SELF-RAG comparison
  - Shows adaptive retrieval + critique loop
- Training pipeline (page 5):
  - Reflection tokens inserted into training data

## Key Results
- Outperforms ChatGPT and RAG baselines on multiple tasks
- Improves factuality + citation accuracy
- Better long-form generation quality
- Limitation: higher inference complexity

## Personal Analysis
**What worked**:
- Elegant integration of retrieval + reasoning + evaluation
- Reflection tokens = very powerful abstraction
- Improves controllability at inference

**What puzzled you**:
- Complex training pipeline (critic + generator)
- Increased inference cost due to multi-pass reasoning

## Connections & Related Work
- Extends RAG → makes it adaptive
- Related to RLHF (self-critique)
- Similar to agent-style reasoning loops

## Implementation Sketch
- Train:
  - Critic model (generate reflection labels)
  - Generator model (predict tokens + reflections)
- Inference:
  - Conditional retrieval
  - Multi-candidate generation
  - Rank with critique scores

## Open Questions / Next Actions
- Can reflection tokens generalize to other tasks?
- How to reduce inference cost?
- Combine with MemGPT-style memory?

## Glossary
- Reflection tokens: special tokens for self-evaluation
- ISREL: relevance score
- ISSUP: factual support score
- ISUSE: usefulness score