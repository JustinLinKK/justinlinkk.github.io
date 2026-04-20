---
title: 'Paper Notes: Visual Instruction Tuning'
date: 2026-04-11
permalink: /posts/2026/04/visual-instruction-tuning/
tags:
  - research-notes
  - reading-list
  - knowledge-base
  - multimodal-llm
  - vision-language
  - instruction-tuning
draft: true
paper:
  title: 'Visual Instruction Tuning'
  authors: 'Haotian Liu, Chunyuan Li, Qingyang Wu, Yong Jae Lee'
  venue: 'NeurIPS 2023'
  link: 'https://arxiv.org/abs/2304.08485'
---

## TL;DR
- This paper asks whether the instruction-tuning recipe that worked for text-only LLMs can be extended to vision-language models to produce a general-purpose visual assistant.
- The key move is data-centric: use GPT-4 to convert image-caption / bounding-box metadata into multimodal instruction-following conversations, then fine-tune a CLIP-to-Vicuna model called **LLaVA**.
- My biggest takeaway is that **explicit multimodal instruction tuning matters at least as much as architecture sophistication**: a frozen CLIP encoder plus a simple learned projection already goes surprisingly far when paired with good synthetic data.

## Bibliographic Snapshot
| Field | Detail |
| --- | --- |
| Citation | `Liu et al., NeurIPS 2023` |
| Keywords | multimodal instruction tuning, LLaVA, CLIP, Vicuna, visual assistant |
| Dataset / Benchmarks | Filtered CC3M (595K), LLaVA-Instruct-158K, LLaVA-Bench (COCO / In-the-Wild), ScienceQA |
| Code / Repo | Project page: https://llava-vl.github.io |

## Problem Statement
The paper targets a gap in early large multimodal models: many systems could caption or answer narrow vision-language tasks, but they were not explicitly trained to follow open-ended human instructions grounded in images. The authors ask whether the instruction-tuning paradigm from Alpaca/Vicuna-style text models can transfer to the multimodal setting. A practical constraint is that high-quality human-written image-grounded instruction data is scarce and expensive to create at scale. Their solution is to reformulate existing image-text data into instruction-following samples and then train a lightweight vision-language connector on top of strong frozen / pre-trained components.

## Core Idea
1. **Main components / modules**
   - Visual backbone: **CLIP ViT-L/14**.
   - Language backbone: **Vicuna**.
   - Connector: a **single trainable linear projection** `W` that maps CLIP visual tokens into the LLM embedding space.
   - Multimodal model: **LLaVA (Large Language and Vision Assistant)**.

2. **Training regimen / algorithm steps**
   - **Stage 1: feature alignment**
     - Filter CC3M down to **595K** image-text pairs.
     - Turn each pair into a simple instruction-following example like “describe this image briefly.”
     - Freeze CLIP and Vicuna; train only the projection matrix `W`.
   - **Stage 2: end-to-end instruction tuning**
     - Build **158K** multimodal instruction-following samples with GPT-4.
     - Keep the vision encoder frozen, but train both `W` and the Vicuna parameters.
     - Mix three response styles: **conversation**, **detailed description**, and **complex reasoning**.

3. **Equations / loss terms to remember**
   - Visual token projection:

     ```text
     Z_v = g(X_v)
     H_v = W · Z_v
     ```

   - Standard auto-regressive objective over assistant tokens conditioned on both image tokens and instruction history.
   - Important design choice: the image is grounded for all turns in a multi-turn dialogue, but only assistant responses contribute to the loss.

## Visual / Diagram Notes
- **Figure 1** is the key mental model: image → CLIP encoder → linear projection `W` → visual tokens injected into Vicuna. The simplicity is striking; there is no Q-Former or cross-attention stack here.
- **Table 1 / Table 14** clarify the data pipeline well: GPT-4 never sees the raw image during data generation; it only sees symbolic surrogates such as multiple captions and object bounding boxes, and then produces three kinds of instruction-following outputs.
- **Table 4** is the most persuasive result for the data story. It shows that adding detailed-description and complex-reasoning samples materially improves overall instruction-following, and that removing instruction tuning collapses performance.
- **Table 8** is a compact reproduction checklist: before-last CLIP features beat last-layer features; skipping pretraining hurts a lot; 13B beats 7B; chain-of-thought style reasoning helps convergence more than final accuracy.
- The qualitative figures are useful reminders that LLaVA is more than a captioner: the paper shows meme explanation, OCR-ish behavior, sketch-to-HTML generation, and conversational follow-ups grounded in images.

## Key Results
- The authors construct **158K** multimodal instruction-following samples: **58K conversation**, **23K detailed description**, and **77K complex reasoning**.
- On **LLaVA-Bench (COCO)**, the full training mixture reaches **85.1** relative score versus a text-only GPT-4 reference with access to ground-truth captions and boxes.
- On **LLaVA-Bench (In-the-Wild)**, LLaVA scores **67.3 ± 2.0** overall and **81.7 ± 1.8** on complex reasoning, substantially ahead of BLIP-2 and OpenFlamingo.
- On **ScienceQA**, LLaVA alone gets **90.92%** accuracy; combining LLaVA with GPT-4 as a judge reaches **92.53%**, which the paper reports as a new state of the art.
- Important ablations worth remembering:
  - **No instruction tuning** drops the COCO benchmark overall score to **21.5**.
  - **No pretraining** drops ScienceQA to **85.81%**.
  - **7B vs 13B** loses about **1.08 points** on ScienceQA.
- Limitations the authors acknowledge or reveal empirically:
  - Weakness on high-resolution details and fine-grained semantic composition.
  - Possible hallucination and inherited bias from CLIP + LLaMA/Vicuna.
  - Heavy reliance on **GPT-4-as-judge** style evaluation.

## Personal Analysis
**What worked**: The paper’s strongest idea is not architectural novelty; it is the **reframing of multimodal alignment as a data-generation problem**. I also like the clean two-stage setup because it isolates feature alignment from instruction learning, which makes the experimental story unusually legible. The ablations are persuasive enough that I would treat “good synthetic multimodal instructions” as a first-class lever, not an implementation detail.

**What puzzled you**: GPT-4 never sees the actual image during data generation, only captions and boxes, so the ceiling of the synthetic data is bounded by those symbolic views. The evaluation methodology also feels somewhat circular: GPT-4 helps generate the data, and GPT-4 later judges the outputs. I’d want stronger human evaluation, robustness checks, and more standardized academic benchmarks beyond the custom LLaVA-Bench setup.

## Connections & Related Work
This paper is the multimodal analog of the text-only instruction-tuning wave around **Alpaca**, **Vicuna**, and **InstructGPT**. Relative to **Flamingo** and **BLIP-2**, the main contribution is not a more elaborate connector but **explicit vision-language instruction tuning**. It also contrasts with tool-orchestration systems like **Visual ChatGPT**, **MM-REACT**, and **ViperGPT** by aiming for a single end-to-end trained multimodal assistant. My mental summary: *Flamingo/BLIP-2 showed multimodal prompting and transfer; LLaVA argued that multimodal chat quality jumps once you train directly on instruction-following behavior.*

## Implementation Sketch
- **Dependencies / frameworks**
  - PyTorch training stack
  - CLIP ViT-L/14 visual encoder
  - Vicuna checkpoint
  - spaCy for noun-phrase extraction during CC3M filtering
  - Distributed training utilities such as **FSDP** and gradient checkpointing

- **Data preprocessing pipeline**
  - Filter CC3M by noun-phrase coverage to create the **CC-595K** subset.
  - Create naive “brief description” instruction pairs for Stage 1.
  - For Stage 2, prompt GPT-4 with **multi-caption context + bounding boxes** to generate:
    - visual conversations
    - detailed descriptions
    - complex reasoning chains
  - Serialize multi-turn conversations in Vicuna’s chat format with separator tokens.

- **Training recipe, hyperparameters, and compute budget**
  - Stage 1 pretraining: **1 epoch**, lr **2e-3**, batch size **128**, train `W` only.
  - Stage 2 instruction tuning: **3 epochs**, lr **2e-5**, batch size **32**, freeze vision encoder, train `W + Vicuna`.
  - ScienceQA variant: use **before-last-layer CLIP features**, reasoning-first answer format, train for **12 epochs**.
  - Hardware: **8× A100** GPUs.
  - Reported runtime: about **4h** for CC-595K pretraining, **10h** for Instruct-158K fine-tuning, **4h** for ScienceQA fine-tuning.

## Open Questions / Next Actions
- How much quality is lost because GPT-4 only sees captions and boxes rather than the image itself during data generation?
- Would a stronger connector (Q-Former, cross-attention, Perceiver resampler, etc.) still matter once instruction data quality is high?
- How robust is GPT-4-as-judge across styles, verbosity levels, or adversarial prompting?
- Can this recipe be extended with **retrieval**, **tool use**, or **higher-resolution visual tokens** to fix failures on OCR and fine-grained details?
- Follow-up reading to chase:
  - BLIP-2
  - Flamingo / OpenFlamingo
  - LLaMA-Adapter
  - MM-CoT
  - later LLaVA follow-ups and improved baselines

## Glossary
- **Visual instruction tuning**: Fine-tuning a multimodal model to follow natural-language instructions grounded in images.
- **LMM**: Large multimodal model.
- **CLIP**: Contrastive Language-Image Pretraining; used here as the frozen vision encoder.
- **Vicuna**: An instruction-tuned open-source LLM used as LLaVA’s language backbone.
- **ScienceQA**: A multimodal multiple-choice science reasoning benchmark.
- **FSDP**: Fully Sharded Data Parallel, used to reduce memory usage in distributed training.
- **GPT-4 as judge**: Evaluation pattern where GPT-4 compares candidate model responses and assigns a score or final decision.
