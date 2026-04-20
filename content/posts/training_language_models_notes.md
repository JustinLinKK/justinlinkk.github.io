---
title: 'Paper Notes: Training Language Models to Follow Instructions with Human Feedback'
date: 2026-04-05
permalink: /posts/2026/04/instructgpt-notes/
tags:
  - research-notes
  - llm-alignment
  - rlhf
  - instructgpt
draft: false
paper:
  title: 'Training language models to follow instructions with human feedback'
  authors: 'Long Ouyang et al.'
  venue: 'NeurIPS 2022'
  link: 'https://arxiv.org/abs/2203.02155'
---

## TL;DR
- This paper studies how to align GPT-3 with user intent by replacing pure next-token pretraining objectives with supervised fine-tuning plus reinforcement learning from human feedback (RLHF).
- The central result is that a much smaller 1.3B InstructGPT model was preferred by human raters over a 175B plain GPT-3 model, which showed that alignment data and reward shaping can matter more than raw parameter count.
- My biggest takeaway is that this paper turned “instruction-following” from an ad hoc prompting trick into a reproducible post-training pipeline: demonstrations → reward model → PPO.

## Bibliographic Snapshot
| Field | Detail |
| --- | --- |
| Citation | `Ouyang et al., NeurIPS 2022` |
| Keywords | RLHF, alignment, instruction tuning, reward modeling, PPO |
| Dataset / Benchmarks | API prompt distribution, TruthfulQA, RealToxicityPrompts, Winogender, CrowS-Pairs, SQuAD, DROP, HellaSwag, WMT |
| Code / Repo | https://github.com/openai/following-instructions-human-feedback |

## Problem Statement
Scaling language models alone does not guarantee that they will follow user intent. The authors argue that next-token prediction is misaligned with the practical goal of being helpful, honest, and harmless. Their research question is whether human demonstrations and preference rankings can be used to post-train GPT-3 into a model that users actually prefer across a broad, messy real-world prompt distribution. The paper also treats this as an alignment study, not just a product optimization study.

## Core Idea
The method has three stages:

1. **Supervised fine-tuning (SFT)**  
   Human labelers write demonstrations for prompts. GPT-3 is fine-tuned on these examples to create an instruction-following supervised policy.

2. **Reward model (RM) training**  
   Labelers rank multiple model outputs for the same prompt. A reward model is trained to predict which completion humans would prefer.

3. **Reinforcement learning with PPO**  
   The SFT model is optimized against the reward model using PPO. The strongest version, **PPO-ptx**, mixes RL gradients with pretraining-distribution gradients to reduce the “alignment tax.”

Important technical choices worth remembering:
- Prompt data came mostly from the OpenAI Playground, not generic benchmark corpora.
- The RM is trained from ranked completions rather than direct scalar human scores.
- PPO uses a KL penalty against the SFT policy to avoid drifting too far into reward hacking.
- Mixing pretraining gradients into PPO was important for reducing regressions on standard NLP benchmarks.

Useful equations / concepts to revisit:
- RM objective based on pairwise preference ranking.
- PPO objective with KL regularization and optional pretraining-mix term.
- Alignment framing: **helpful, honest, harmless**.

## Visual / Diagram Notes
- **Figure 2** is the key system diagram: SFT → reward model → PPO. It is probably the cleanest high-level visualization of classical RLHF.
- **Figure 1** is the headline result: model preference win-rate versus the 175B SFT baseline. The striking point is that the 1.3B PPO-ptx model beats 175B GPT-3 in human preference.
- **Figures 4–7** are important because they show the method is not only about subjective preference; it also reduces hallucination and toxic generations in some settings, though not uniformly.

## Key Results
- **1.3B InstructGPT > 175B GPT-3 in human preference.**
- **175B InstructGPT** is preferred to plain 175B GPT-3 **85% ± 3%** of the time and to few-shot GPT-3 **71% ± 4%** of the time.
- On **TruthfulQA**, InstructGPT is more truthful and informative than GPT-3.
- On closed-domain tasks from the API distribution, hallucination drops from **41% to 21%**.
- Toxicity improves modestly, especially when the model is prompted to be respectful.
- Bias metrics do **not** improve much.
- Mixing in pretraining updates helps recover benchmark performance on datasets like **SQuAD**, **DROP**, and **HellaSwag**, which the authors call reducing the **alignment tax**.

Limitations the authors acknowledged:
- The model still makes simple mistakes.
- The learned behavior reflects the preferences of a narrow group of labelers plus the researchers’ instructions.
- The system can still follow harmful instructions in many cases.
- Alignment to one group’s preferences is not the same as alignment to society.

## Personal Analysis
**What worked**:  
This paper is historically important because it made RLHF concrete and operational. I especially like that the authors evaluate on a real prompt distribution rather than pretending public NLP benchmarks are enough. The preference result is also a very strong conceptual point: better post-training can dominate brute-force scale.

**What puzzled you**:  
The reward model is both the engine and the weak point. Once performance is funneled through human rankings, everything depends on labeler instructions, interface design, and the distribution of prompts. Also, the “helpful, honest, harmless” framing is intuitive, but it still compresses many unresolved normative questions into one pipeline.

## Connections & Related Work
- This paper directly builds on earlier RLHF work for summarization and stylistic continuation.
- It is a major bridge between the original GPT paradigm and modern assistant-style LLMs.
- Relative to the 2018 GPT paper, this work shifts the center of gravity from **pretraining transfer** to **post-training alignment**.
- Relative to DeepSeek-R1, this paper depends much more on human feedback and much less on verifier-driven RL.
- It also foreshadows later work on constitutional methods, DPO-style preference optimization, tool-augmented truthfulness, and safety post-training.

## Implementation Sketch
If reproducing the paper at smaller scale:
- Start with a pretrained decoder-only LM.
- Build a prompt dataset with real instruction-style requests.
- Collect:
  - human demonstrations,
  - ranked model outputs,
  - unlabeled prompts for RL rollouts.
- Train an SFT policy.
- Train a pairwise reward model on ranked outputs.
- Run PPO with:
  - KL penalty to the SFT model,
  - reward model score,
  - optional pretraining-mix objective.
- Evaluate on:
  - human preference comparisons,
  - truthfulness,
  - toxicity,
  - benchmark regression checks.

Practical dependencies:
- Transformer LM
- preference-data collection UI
- reward-model training pipeline
- PPO infrastructure
- automatic and human evaluation loops

## Open Questions / Next Actions
- How much of the gain comes from the reward model versus just better curated instruction data?
- Can preference optimization avoid reward-model fragility without losing performance?
- How should “who are we aligning to?” be operationalized in future systems?
- I would also compare this paper against later DPO-style methods and verifier-based RL systems like DeepSeek-R1.

## Glossary
- **RLHF**: Reinforcement Learning from Human Feedback.
- **SFT**: Supervised Fine-Tuning using human demonstrations.
- **Reward Model (RM)**: A model trained to score outputs according to human preferences.
- **PPO**: Proximal Policy Optimization, the RL algorithm used here.
- **Alignment tax**: Performance regressions on capability benchmarks caused by alignment training.
