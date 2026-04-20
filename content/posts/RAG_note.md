---
title: 'Paper Notes: Retrieval-Augmented Generation (RAG)'
date: 2026-04-20
permalink: /posts/2026/04/rag/
tags:
  - research-notes
  - rag
  - llm
draft: false
paper:
  title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks'
  authors: 'Lewis et al.'
  venue: 'NeurIPS 2020'
  link: 'https://arxiv.org/abs/2005.11401'
---

## TL;DR 
- Pure LLMs store knowledge in parameters but struggle with factual accuracy and updates.
- RAG combines parametric models with external retrieval memory.
- Key takeaway: hybrid parametric + non-parametric memory improves factuality and flexibility.

## Bibliographic Snapshot
| Field | Detail |
| --- | --- |
| Citation | `Lewis et al., NeurIPS 2020` |
| Keywords | retrieval, hybrid memory, QA |
| Dataset / Benchmarks | NQ, TriviaQA, WebQuestions |
| Code / Repo | HuggingFace RAG |

## Problem Statement
LLMs encode knowledge in parameters but cannot update or verify it easily. This leads to hallucination and poor performance on knowledge-intensive tasks. The goal is to augment LLMs with external, updatable memory.

## Core Idea
1. Combine:
   - Parametric memory (seq2seq model like BART)
   - Non-parametric memory (retrieved documents)
2. Pipeline:
   - Retrieve top-K docs via DPR
   - Generate conditioned on docs
3. Two variants:
   - RAG-Sequence: same doc for whole output
   - RAG-Token: different docs per token
4. Training:
   - End-to-end with latent document marginalization

## Visual / Diagram Notes
- Figure 1 (page 2):
  - Shows retriever + generator pipeline
  - Retrieval treated as latent variable
- Key insight: marginalize over documents rather than pick one

## Key Results
- SOTA on open-domain QA tasks
- More factual and diverse generation than BART
- Can update knowledge by swapping document index
- Limitation: retrieval quality is bottleneck

## Personal Analysis
**What worked**:
- Clean probabilistic formulation
- First scalable hybrid memory architecture
- Strong empirical results

**What puzzled you**:
- Fixed top-K retrieval is naive
- No mechanism to decide *when* to retrieve

## Connections & Related Work
- Foundation of all modern RAG systems
- Extended by SELF-RAG (adaptive retrieval)
- Used in production LLM systems

## Implementation Sketch
- Retriever: DPR (BERT-based)
- Generator: BART
- Pipeline:
  1. Encode query
  2. Retrieve top-K docs
  3. Concatenate input + docs
  4. Generate output

## Open Questions / Next Actions
- How to improve retrieval relevance?
- Can retrieval be dynamic?
- How to reduce latency?

## Glossary
- Parametric memory: model weights
- Non-parametric memory: external DB
- DPR: Dense Passage Retriever