---
title: 'Paper Notes: Model Extraction Attacks & Defenses for LLMs'
date: 2026-03-21
permalink: /posts/2026/03/llm-extraction-survey/
tags:
  - research-notes
  - llm-security
  - model-extraction
draft: false
paper:
  title: 'A Survey on Model Extraction Attacks and Defenses for Large Language Models'
  authors: 'Kaixiang Zhao, Lincan Li, Kaize Ding, Neil Zhenqiang Gong, Yue Zhao, Yushun Dong'
  venue: 'KDD 2025'
  link: 'https://doi.org/10.1145/3711896.3736573'
---

## TL;DR
- This paper studies how attackers can extract functionality, training data, or prompts from large language models via API access.
- It provides a structured taxonomy of attacks and defenses, highlighting the unique vulnerabilities of generative transformer models.
- The key takeaway is that **LLM capabilities can be replicated surprisingly cheaply**, creating serious risks for intellectual property and privacy.

## Bibliographic Snapshot
| Field | Detail |
| --- | --- |
| Citation | `Zhao et al., KDD 2025` |
| Keywords | LLM security, model extraction, prompt stealing, privacy |
| Dataset / Benchmarks | Not specific (survey paper) |
| Code / Repo | N/A |

## Problem Statement
The paper addresses the growing threat of **model extraction attacks (MEAs)** against large language models deployed via APIs. Attackers with only black-box query access can replicate model functionality, recover training data, or infer proprietary prompts. The challenge is amplified by LLM-specific properties such as generative outputs, large-scale memorization, and standardized transformer architectures. The paper aims to systematically categorize these threats and evaluate corresponding defenses under realistic deployment constraints. :contentReference[oaicite:1]{index=1}

## Core Idea
The paper proposes a **taxonomy of LLM extraction attacks and defenses**:

### 1. Attack Categories
- **Functionality Extraction**
  - API-based knowledge distillation
  - Direct query-based extraction
  - Parameter/architecture recovery
- **Training Data Extraction**
  - Prompt-based memorization extraction
  - Private text reconstruction (e.g., activation inversion)
- **Prompt-targeted Attacks**
  - Prompt stealing
  - Prompt reconstruction

### 2. Defense Categories
- **Model Protection**
  - Architectural defenses (e.g., watermarking)
  - Output control (response perturbation)
- **Data Privacy Protection**
  - Training-time protection (e.g., differential privacy)
  - Output sanitization
- **Prompt Protection**
  - Prompt watermarking
  - Query monitoring

### 3. Evaluation Framework
- Attack effectiveness:
  - Functional similarity
  - Data recovery rate
- Defense performance:
  - Security metrics (e.g., detection rate)
  - Utility metrics (e.g., performance degradation)

## Visual / Diagram Notes
- **Figure 1 (page 3)**: Shows the full model extraction pipeline:
  - User queries → API → target model → responses → attacker trains surrogate model
- **Figure 2 (page 4)**: Taxonomy tree:
  - Clean separation between attack types and defense strategies
  - Useful for structuring slides or system design

## Key Results
- LLMs can be **effectively cloned via API queries**, even without internal access.
- Modern attacks are increasingly **query-efficient**, requiring fewer interactions.
- Training data extraction is especially effective for:
  - rare patterns
  - structured data (e.g., emails)
- Defense trade-offs:
  - Strong protection → reduced utility
  - Weak protection → high extraction risk
- Table (page 9) shows:
  - No single defense is universally effective across all attack types

## Personal Analysis
**What worked**:
- Clear taxonomy makes it easy to reason about different attack surfaces.
- Good separation between:
  - functionality vs data vs prompt extraction
- Evaluation metrics are well-defined for generative models.

**What puzzled you**:
- No concrete quantitative benchmark comparing all attacks/defenses.
- Some defenses (e.g., watermarking) seem fragile against adaptive attackers.
- Lack of real-world deployment evaluation.

## Connections & Related Work
- Closely related to:
  - Data extraction / memorization papers (e.g., Carlini et al.)
  - Prompt injection & jailbreak research
- Compared to your OSINT pipeline:
  - This paper extracts **model knowledge**
  - Your system extracts **human knowledge**
- Shared insight:
  - Risk comes from **aggregation + synthesis**, not raw data

## Implementation Sketch
If reproducing an extraction attack:
- Use API access to target LLM
- Generate diverse query dataset
- Collect (prompt, response) pairs
- Train surrogate model:
  - fine-tune smaller LLM
  - or distillation-based training

For defense:
- Add output filtering layer
- Implement query monitoring:
  - detect abnormal query patterns
- Optionally embed watermark signals

## Open Questions / Next Actions
- Can multiple attack methods be combined for stronger extraction?
- How to design defenses that:
  - don’t require retraining
  - maintain high utility?
- Could your OSINT pipeline be adapted for:
  - **model extraction auditing**?
- Explore:
  - prompt leakage detection in real systems

## Glossary
- **MEA (Model Extraction Attack)**: Replicating a model via query access
- **Distillation**: Training a model to mimic another model’s outputs
- **Prompt Stealing**: Extracting hidden system prompts
- **Output Sanitization**: Filtering sensitive outputs