---
title: 'Paper Notes: Training Large Language Models to Reason in a Continuous Latent Space'
date: 2026-04-11
permalink: /posts/2026/04/coconut-paper-note/
tags:
  - llm
  - reasoning
  - latent-space
  - research-notes
draft: false
paper:
  title: 'Training Large Language Models to Reason in a Continuous Latent Space'
  authors: 'Shibo Hao et al.'
  venue: 'arXiv 2025'
  link: 'https://arxiv.org/abs/2412.06769'
---

## TL;DR
- This paper questions whether LLMs should reason in natural language and proposes reasoning directly in latent space.
- It introduces **Coconut (Chain of Continuous Thought)**, where hidden states are recursively reused instead of decoded tokens.
- The key insight is that latent reasoning enables **parallel exploration (BFS-like search)** and improves efficiency and accuracy on planning-heavy tasks.

## Bibliographic Snapshot
| Field | Detail |
| --- | --- |
| Citation | `Hao et al., arXiv 2025` |
| Keywords | latent reasoning, chain-of-thought, LLM, planning |
| Dataset / Benchmarks | GSM8K, ProntoQA, ProsQA |
| Code / Repo | https://github.com/facebookresearch/coconut |

## Problem Statement
Traditional LLM reasoning operates in **language space**, forcing models to express reasoning as token sequences (CoT). This introduces inefficiencies: most tokens are for fluency, not reasoning, and each token gets equal compute regardless of importance. Additionally, autoregressive decoding forces **greedy, single-path reasoning**, limiting planning ability. The paper explores whether reasoning can be done more effectively in **continuous latent space** instead.

## Core Idea
The paper proposes **Coconut (Chain of Continuous Thought)**:

1. **Latent reasoning mechanism**
   - Use the **last hidden state (h_t)** as a “continuous thought”
   - Feed it directly as the next input embedding instead of decoding into tokens

2. **Two modes**
   - Language mode: standard token generation
   - Latent mode: recursive hidden-state propagation

3. **Training strategy (multi-stage)**
   - Start with standard CoT supervision
   - Gradually replace reasoning tokens with latent thoughts
   - Optimize using standard next-token prediction loss

4. **Key emergent behavior**
   - Continuous thoughts encode **multiple candidate reasoning paths**
   - Enables **implicit breadth-first search (BFS)** instead of greedy decoding

## Visual / Diagram Notes
- **Figure 1 (page 2)**: Shows CoT vs Coconut. CoT outputs tokens, Coconut loops hidden states.
- **Figure 3 (page 6)**: Demonstrates improved accuracy and reduced hallucination with more latent steps.
- **Figure 5 (page 7)**: Visualizes latent reasoning as a **tree search with probabilities over branches**.
- **Figure 6 (page 8)**: Shows early-stage reasoning explores multiple paths, later stages converge.

## Key Results
- On **ProsQA (planning-heavy)**:
  - Coconut significantly outperforms CoT
  - Reduces hallucination and wrong-target reasoning
- On **GSM8K (math)**:
  - Slightly lower than CoT but more efficient
- **Efficiency**:
  - Fewer tokens generated → lower inference cost
- **Ablation**:
  - Removing curriculum training severely degrades performance

## Personal Analysis
**What worked**:
- The BFS interpretation is highly compelling — this reframes reasoning as **search in representation space**.
- Efficient trade-off between accuracy and token usage is practically important for deployment.

**What puzzled you**:
- Training complexity: multiple forward passes per latent step may hurt scalability.
- Interpretability: latent reasoning is harder to inspect than CoT.

## Connections & Related Work
- Extends **Chain-of-Thought (Wei et al., 2022)** beyond language space
- Related to:
  - Tree-of-Thoughts (explicit search)
  - iCoT (internalized reasoning)
- Conceptually similar to:
  - World models / planning (LeCun perspective)
  - Latent computation in transformers

## Implementation Sketch
- Base model: GPT-2 (or larger LLM)
- Add special tokens `<bot>` and `<eot>`
- Modify forward pass:
  - Replace embedding with hidden state in latent mode
- Training:
  - Multi-stage curriculum replacing CoT steps
  - Mask loss on latent tokens
- Inference:
  - Fix number of latent steps or learn termination

## Open Questions / Next Actions
- Can latent reasoning scale to GPT-4-level models?
- How to pretrain models directly for latent reasoning?
- Can we hybridize:
  - Language for structure
  - Latent for computation?
- How to interpret or visualize latent thoughts?

## Glossary
- **CoT (Chain-of-Thought)**: Step-by-step reasoning in language tokens
- **Latent space reasoning**: Reasoning using hidden states instead of tokens
- **Continuous thought**: Hidden state reused as next input
- **ProsQA**: Planning-heavy reasoning benchmark introduced in the paper
