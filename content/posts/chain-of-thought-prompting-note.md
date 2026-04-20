---
title: 'Paper Notes: Chain-of-Thought Prompting Elicits Reasoning in Large Language Models'
date: 2026-04-11
permalink: /posts/2026/04/chain-of-thought-prompting-note/
tags:
  - research-notes
  - reading-list
  - knowledge-base
  - llms
  - prompting
  - reasoning
draft: true
paper:
  title: 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models'
  authors: 'Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten Bosma, Brian Ichter, Fei Xia, Ed H. Chi, Quoc V. Le, Denny Zhou'
  venue: 'NeurIPS 2022'
  link: 'https://arxiv.org/abs/2201.11903'
---

## TL;DR
- The paper asks whether large language models can be made better at multi-step reasoning simply by changing the prompt format, without finetuning.
- Their answer is yes: adding few-shot exemplars that include intermediate natural-language reasoning steps (“chain of thought”) unlocks large gains on arithmetic, commonsense, and symbolic reasoning tasks.
- My biggest takeaway is that the improvement is not just “more tokens”: the ablations suggest that sequential natural-language reasoning matters, and the effect emerges mainly at very large model scales.

## Bibliographic Snapshot
| Field | Detail |
| --- | --- |
| Citation | `Wei et al., NeurIPS 2022` |
| Keywords | chain-of-thought prompting, few-shot learning, reasoning, scaling, interpretability |
| Dataset / Benchmarks | GSM8K, SVAMP, ASDiv, AQuA, MAWPS, CSQA, StrategyQA, Date Understanding, Sports Understanding, SayCan, Last Letter Concatenation, Coin Flip |
| Code / Repo | No official public repo linked in the paper; Appendix G includes full prompts and Appendix E.1 describes supplementary materials for reproducibility |

## Problem Statement
Standard few-shot prompting works well for many direct question-answering tasks, but it struggles on problems that require multi-step reasoning. Prior approaches that use rationales or intermediate steps usually require task-specific training or finetuning, which is expensive because high-quality rationale annotations are harder to obtain than plain input-output pairs. This paper asks whether an off-the-shelf large language model can be prompted to reason better in-context by seeing examples formatted as `(input, chain of thought, output)` rather than just `(input, output)`. A core constraint is that the method should remain purely prompting-based, so one model checkpoint can be reused across many tasks.

## Core Idea
1. **Prompt format**
   - Replace standard few-shot exemplars with exemplars that include intermediate natural-language reasoning steps before the final answer.
   - The authors call this **chain-of-thought prompting**.

2. **How it is applied**
   - For arithmetic tasks, they manually write a small set of chain-of-thought exemplars and reuse them across multiple benchmarks.
   - For commonsense and symbolic tasks, they again provide a few manually written demonstrations showing the reasoning pattern before the answer.
   - In the main experiments, the method is purely inference-time prompting; no finetuning is performed.

3. **Why it might work**
   - It decomposes hard problems into intermediate steps.
   - It provides a more interpretable trace of how the model arrived at an answer.
   - It gives the model a language-based scaffold for reasoning across different task families.

4. **Ablations worth remembering**
   - **Equation-only prompting** helps somewhat on easier arithmetic tasks, but it is not enough for harder semantic problems like GSM8K.
   - **Variable compute only** (forcing extra tokens without meaningful reasoning) performs roughly like the baseline.
   - **Reasoning after answer** also performs roughly like the baseline, suggesting the intermediate reasoning is useful because it happens *before* the answer.

## Visual / Diagram Notes
- **Figure 1 (page 1):** The most memorable figure in the paper. Standard prompting answers a simple apple-counting problem incorrectly, while chain-of-thought prompting solves it by verbalizing the subtraction and addition steps. This figure is the cleanest intuition pump for the paper.
- **Figure 4 (page 5):** Scaling curves on GSM8K, SVAMP, and MAWPS. The important pattern is that chain-of-thought prompting barely helps small models, then produces a sharp jump at larger scales. This is the visual evidence for the “emergent ability” claim.
- **Figure 5 (page 6):** Ablation chart comparing standard prompting, equation-only, variable-compute-only, reasoning-after-answer, and full chain-of-thought prompting. It supports the claim that the win is not just longer outputs.
- **Figure 6 (page 6):** Robustness plot across annotators and alternate exemplar sets. Performance varies, but chain-of-thought prompting consistently stays above standard prompting.
- **Figure 8 (page 8):** Symbolic reasoning plots for last-letter concatenation and coin-flip state tracking, including out-of-domain longer sequences. This figure is useful because it shows some length generalization, not just memorization of fixed templates.

## Key Results
- **Arithmetic reasoning:**
  - PaLM 540B on **GSM8K** improves from **17.9%** with standard prompting to **56.9%** with chain-of-thought prompting.
  - On **SVAMP**, PaLM 540B improves from **69.4%** to **79.0%**.
  - On **MAWPS**, PaLM 540B improves from **79.2%** to **93.3%**.
  - The paper highlights GSM8K as especially important because chain-of-thought prompting reaches a new state of the art relative to prior reported systems at the time.

- **Commonsense reasoning:**
  - With PaLM 540B, **StrategyQA** improves from **68.6%** to **77.8%**.
  - **Date Understanding** improves from **49.0%** to **65.3%**.
  - **Sports Understanding** improves from **80.5%** to **95.4%**, exceeding the “unaided sports enthusiast” reference reported by the authors.
  - Gains on **CSQA** are much smaller, which is a good reminder that chain-of-thought is not uniformly transformative.

- **Symbolic reasoning and OOD length generalization:**
  - For PaLM 540B on **Last Letter Concatenation**, in-domain performance jumps from **7.6%** to **99.4%**.
  - On the harder OOD 4-word version, it goes from **0.0%** to **63.0%**.
  - For **Coin Flip**, PaLM 540B is already strong in-domain (**98.1%** to **100.0%**), but chain-of-thought helps much more on the OOD 4-step setting (**54.8%** to **90.2%**).

- **Ablations / sensitivity:**
  - On LaMDA 137B for GSM8K, standard prompting is **6.5%**, equation-only is **5.4%**, and full chain-of-thought is **14.3%**.
  - “Variable compute only” and “reasoning after answer” stay near the baseline, which strengthens the paper’s causal story.
  - Alternate annotators and alternative exemplar sets still outperform standard prompting, though prompt engineering clearly still matters.

- **Limitations acknowledged by the authors:**
  - The effect mainly appears in very large models (roughly the 100B+ regime in their experiments).
  - Generated reasoning traces are not guaranteed to be correct or faithful.
  - Manual rationale creation is cheap in few-shot prompting but could become expensive in finetuning settings.
  - Using very large models for reasoning is costly in practice.

## Personal Analysis
**What worked**: The paper is compelling because it isolates a very simple intervention—changing the demonstration format—and then tests it across three qualitatively different reasoning families. The ablation section is especially strong: it argues that the benefit is not just extra verbosity, but useful intermediate structure. I also like that the paper shows both strong headline wins (GSM8K) and weaker cases (CSQA), which makes the empirical story feel less cherry-picked.

**What puzzled you**: The paper uses the phrase “elicits reasoning,” but it is careful not to claim that the model is literally reasoning in a human-like mechanistic sense. That distinction is important, and I still think the paper leaves open how much of the gain comes from better decomposition versus pattern completion over rationale-like text seen in pretraining. I also wonder how much the results depend on benchmark style: many tasks here have answers that naturally admit short verbal decompositions.

## Connections & Related Work
This paper sits at the intersection of three lines of work:
- **Few-shot prompting** in the GPT-3 tradition, where tasks are specified in-context rather than through finetuning.
- **Rationale / explanation supervision**, such as prior work on math word problems that trains models using intermediate natural-language solutions.
- **Scratchpads and intermediate computation**, where models are encouraged to externalize partial reasoning before final prediction.

My mental model is that this paper’s contribution is not “intermediate reasoning exists,” but rather: **you can often unlock it with prompt design alone, without updating model weights**.

## Implementation Sketch
If I were reproducing the core idea, I would do it in the following order:
- Build a standard few-shot prompting baseline for one benchmark, ideally **GSM8K**.
- Create 8 chain-of-thought exemplars that show explicit intermediate steps and a final answer.
- Run the same model with:
  - standard prompting,
  - chain-of-thought prompting,
  - equation-only prompting,
  - variable-compute-only prompting,
  - reasoning-after-answer prompting.
- Use greedy decoding first, since that matches the main setup in the paper.
- Add an optional external calculator pass for arithmetic tasks to measure how many errors are arithmetic execution mistakes versus reasoning mistakes.
- Track performance as a function of model size if possible, because the emergence claim is central.

Practical notes from the paper:
- No finetuning is required.
- The authors report using TPU v3 for LaMDA 137B inference and TPU v4 for PaLM 540B inference; GPT-3 experiments were done through the public API.
- Exact prompts are given in Appendix G, which is very useful for faithful reproduction.

## Open Questions / Next Actions
- Would the same prompt pattern still help on newer reasoning-heavy tasks that are less template-friendly than GSM8K?
- Can we automatically synthesize good chain-of-thought exemplars instead of writing them by hand?
- How much of the gain can be transferred to smaller models through distillation, finetuning, or verifier-based training?
- When does chain-of-thought improve accuracy versus merely improving the *appearance* of reasoning?
- Follow-up reading to chase from this paper: rationale supervision for math word problems, scratchpad prompting, self-consistency decoding, and work on explanation faithfulness.

## Glossary
- **Chain of thought (CoT):** A sequence of intermediate natural-language reasoning steps produced before the final answer.
- **Standard prompting:** Few-shot prompting with input-output examples only, without explicit reasoning steps.
- **Emergent ability:** A capability that appears sharply only once models reach a sufficiently large scale.
- **OOD (out-of-domain) length generalization:** Performance on longer or more complex inputs than those shown in the exemplars.
- **Equation-only prompting:** An ablation where the model outputs an equation as an intermediate step, without the full natural-language reasoning trace.
