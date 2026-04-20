---
title: 'Paper Notes: ReAct'
date: 2026-04-20
permalink: /posts/2026/04/react/
tags:
  - research-notes
  - agents
  - llm
draft: false
paper:
  title: 'ReAct: Synergizing Reasoning and Acting in Language Models'
  authors: 'Yao et al.'
  venue: 'ICLR 2023'
  link: 'https://arxiv.org/abs/2210.03629'
---

## TL;DR
- LLMs either reason (CoT) or act (tools), but not both effectively.
- ReAct interleaves reasoning steps and actions in a loop.
- Key takeaway: reasoning + environment interaction improves accuracy and reduces hallucination.

## Bibliographic Snapshot
| Field | Detail |
| --- | --- |
| Citation | `Yao et al., ICLR 2023` |
| Keywords | agents, reasoning, tool use |
| Dataset / Benchmarks | HotpotQA, FEVER, ALFWorld |
| Code / Repo | https://react-lm.github.io |

## Problem Statement
Chain-of-thought reasoning is static and hallucination-prone, while action-based systems lack reasoning. There is no unified framework combining reasoning and interaction with external environments.

## Core Idea
1. Introduce **ReAct loop**:
   - Thought → Action → Observation
2. Thought:
   - reasoning trace
3. Action:
   - interact with environment (search, lookup)
4. Observation:
   - feedback from environment
5. Iterate until answer

## Visual / Diagram Notes
- Figure 1 (page 2):
  - Comparison:
    - CoT (reason only)
    - Act (action only)
    - ReAct (combined)
- Shows reasoning guiding search, and search grounding reasoning

## Key Results
- Improves QA and fact verification over CoT
- Reduces hallucination via external grounding
- Strong gains in interactive tasks (ALFWorld +34%)
- Limitation: requires careful prompt design

## Personal Analysis
**What worked**:
- Very intuitive “agent loop”
- Strong improvement in interpretability
- Flexible across tasks

**What puzzled you**:
- Prompt-based → brittle
- Scaling to long tasks is unclear

## Connections & Related Work
- Precursor to modern LLM agents (LangGraph, AutoGPT)
- Complementary to RAG (retrieval as action)
- Related to SELF-RAG (self-reflection vs action loop)

## Implementation Sketch
- Prompt template:
  Thought:
  Action:
  Observation:
- Use external tools:
  - Search API
  - DB queries
- Loop until Finish[]

## Open Questions / Next Actions
- How to train instead of prompt?
- Combine with memory (MemGPT)?
- Optimize action selection?

## Glossary
- Thought: reasoning step
- Action: tool/environment call
- Observation: returned info