---
title: 'Paper Notes: DeepSeek-R1'
date: 2026-04-05
permalink: /posts/2026/04/deepseek-r1-notes/
tags:
  - research-notes
  - reasoning-models
  - reinforcement-learning
  - llm
draft: false
paper:
  title: 'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning'
  authors: 'DeepSeek-AI'
  venue: 'arXiv, 2026'
  link: 'https://arxiv.org/abs/2501.12948'
---

## TL;DR
- This paper argues that strong reasoning can emerge from reinforcement learning with verifiable rewards, even without starting from human-written chain-of-thought traces.
- The core contribution is a two-part story: **DeepSeek-R1-Zero** shows that pure RL can induce long reasoning behaviors, while **DeepSeek-R1** adds cold-start SFT, rejection sampling, and broader preference alignment to make that reasoning more readable and useful.
- My biggest takeaway is that this paper treats reasoning as an optimization target under verifier-based RL, not just as imitation of human explanations.

## Bibliographic Snapshot
| Field | Detail |
| --- | --- |
| Citation | `DeepSeek-AI, arXiv 2026` |
| Keywords | reasoning, GRPO, RL, verifier rewards, distillation, long CoT |
| Dataset / Benchmarks | AIME 2024, MATH-500, CNMO 2024, LiveCodeBench, Codeforces, GPQA Diamond, MMLU, MMLU-Pro, AlpacaEval 2.0, ArenaHard |
| Code / Repo | https://github.com/deepseek-ai/DeepSeek-R1 |

## Problem Statement
The paper studies whether LLM reasoning ability can be improved through reinforcement learning rather than by imitating large collections of human-annotated reasoning traces. The authors argue that supervised reasoning data limits exploration because it locks models into human-style trajectories. Their goal is to let the model discover better reasoning policies on its own, especially on tasks with verifiable answers such as math, code, STEM, and logic. The broader product problem is that pure reasoning models can be strong but unreadable, so the final system must also be usable and aligned.

## Core Idea
The paper has two major system variants:

1. **DeepSeek-R1-Zero**
   - Starts from DeepSeek-V3-Base.
   - Skips the usual SFT warm-start.
   - Uses **Group Relative Policy Optimization (GRPO)** with rule-based rewards only.
   - Reward components:
     - answer correctness,
     - output format.
   - Result: strong reasoning behavior emerges, including reflection, verification, and longer thought chains.

2. **DeepSeek-R1**
   - Adds a multi-stage pipeline to fix readability and language-mixing problems:
     - cold-start long-CoT SFT,
     - reasoning-focused RL,
     - rejection sampling + second SFT,
     - final RL with reasoning rewards plus helpfulness/harmlessness reward models.
   - This keeps the reasoning gains while making outputs more product-ready.

Important technical points:
- **GRPO** replaces PPO’s value-function-heavy setup with group-relative advantages.
- Rule-based rewards are preferred for verifiable tasks to reduce reward-model gaming.
- A language consistency reward is used to reduce Chinese/English mixing.
- Distillation transfers the reasoning style to smaller models.

## Visual / Diagram Notes
- **Figure 1** is the most memorable early-training plot: AIME accuracy rises sharply during RL, and average response length grows with training. The visual message is that more reasoning tokens are not manually prescribed; they emerge.
- **Table 2** (“aha moment”) is conceptually important. The model begins to explicitly revise itself with “Wait, wait...” style self-correction, which the authors interpret as visible emergence of reflective reasoning.
- **Figure 2** is the full training pipeline for DeepSeek-R1. It shows how the project moved from pure RL emergence to a more production-aligned hybrid pipeline.
- **Figure 3** comparing PPO and GRPO is useful if I ever need to explain why DeepSeek emphasizes GRPO as a practical RL algorithm for long-CoT training.

## Key Results
Headline reasoning results:
- **DeepSeek-R1-Zero** improves AIME 2024 pass@1 from **15.6% to 77.9%** during training, and reaches **86.7%** with self-consistency.
- Final **DeepSeek-R1** reaches:
  - **79.8 pass@1 on AIME 2024**
  - **97.3 on MATH-500**
  - **96.3 percentile on Codeforces**
  - **65.9 pass@1 on LiveCodeBench**
  - **84.0 EM on MMLU-Pro**
  - **87.6 LC-winrate on AlpacaEval 2.0**
  - **92.3 on ArenaHard**

Other important findings:
- Pure RL improves verifiable reasoning tasks most strongly.
- Later SFT + general RL stages improve instruction following and open-ended quality.
- Distilled smaller models inherit substantial reasoning ability and outperform many instruction-tuned baselines.

Limitations the paper explicitly discusses:
- Poor structure/output formatting compared with mature assistant models.
- No strong tool use yet.
- Some overthinking and token inefficiency.
- Language mixing outside Chinese/English.
- Prompt sensitivity.
- Reward hacking remains a core danger when reward quality is weak.

## Personal Analysis
**What worked**:  
This paper is one of the clearest demonstrations that reasoning traces do not have to begin as human demonstrations. The strongest idea is not merely “RL improves math,” but that RL can cause a model to search longer, revise itself, and discover useful internal behaviors under outcome-based incentives. The distillation story is also strategically smart because it turns a very expensive teacher into something more deployable.

**What puzzled you**:  
The paper uses “emergent reasoning” language quite confidently, but the causal interpretation is still tricky. Longer outputs and more self-correction are suggestive, not definitive evidence of deeper internal reasoning. Also, verifier-friendly domains are exactly the domains where pure RL is easiest, so the generalization to writing, open-ended analysis, or ambiguous real-world reasoning is still unresolved.

## Connections & Related Work
- Compared with **InstructGPT**, this work shifts the emphasis from human preference data to verifier-based RL on reasoning-heavy tasks.
- Compared with the original **GPT (2018)** paper, this work is almost the opposite stage of the stack: GPT studies representation transfer from pretraining, while DeepSeek-R1 studies reasoning emergence during post-training.
- The paper sits near work on CoT prompting, self-consistency, process rewards, and test-time scaling, but its strongest claim is that policy optimization can produce useful long-CoT behavior directly.
- It also connects to later debates about whether reasoning is better improved by:
  - larger pretraining,
  - better post-training,
  - stronger inference-time search,
  - or some hybrid.

## Implementation Sketch
If reproducing a smaller-scale version:
- Start with a strong pretrained base model with some math/code exposure.
- Build verifier-friendly RL datasets:
  - math with boxed or parseable answers,
  - code with executable test cases,
  - logic/STEM multiple-choice tasks.
- Use GRPO or PPO-style RL on sampled groups of candidate answers.
- Reward components:
  - correctness,
  - format compliance,
  - optionally language consistency.
- For a production-oriented version:
  - add cold-start readable reasoning traces,
  - rejection-sample good RL trajectories,
  - run a broader SFT stage,
  - add helpfulness/harmlessness reward models for general prompts.
- Distill final reasoning traces into smaller dense models.

Dependencies to revisit:
- scalable rollout + inference infra
- code execution sandbox
- symbolic answer checking (e.g. SymPy)
- pairwise helpfulness/safety reward models
- efficient distributed RL training

## Open Questions / Next Actions
- How far can verifier-based RL go outside math/code/STEM?
- Is the main gain from policy optimization itself, or from longer token budgets plus strong filtering?
- Can GRPO-like training be combined with tool use earlier in the pipeline?
- I would also compare this with OpenAI’s o1-style reasoning systems and later tool-using agentic reasoners.

## Glossary
- **GRPO**: Group Relative Policy Optimization, DeepSeek’s RL algorithm for training reasoning models.
- **DeepSeek-R1-Zero**: Pure RL reasoning model without initial supervised fine-tuning.
- **Verifier-based reward**: Reward derived from correctness checks, test cases, or deterministic matching.
- **Cold start SFT**: Small supervised stage used to make outputs more readable and aligned.
- **Reward hacking**: Optimizing the reward function without genuinely improving the intended behavior.
