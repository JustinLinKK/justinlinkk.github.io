---
title: "Paper Notes: Extracting Training Data from Large Language Models"
date: 2026-02-23
permalink: /posts/2026/02/extracting-training-data-llms/
tags:
  - research-notes
  - security
  - privacy
  - language-models
  - memorization
draft: false
paper:
  title: "Extracting Training Data from Large Language Models"
  authors: "Nicholas Carlini et al."
  venue: "30th USENIX Security Symposium, 2021"
  link: "https://www.usenix.org/conference/usenixsecurity21/presentation/carlini-extracting"
---
Original Paper: [Extracting Training Data from Large Language Models](https://www.usenix.org/conference/usenixsecurity21/presentation/carlini-extracting)

## TL;DR

- This paper demonstrates that large language models (LLMs) can leak verbatim training data through black-box querying.
- The authors design a practical extraction attack that recovers hundreds of memorized sequences from GPT-2, including contact information, UUIDs, URLs, and source code.
- Crucially, memorization occurs **without overfitting**, and larger models exhibit significantly greater privacy leakage.

---

## Bibliographic Snapshot

| Field | Detail |
| --- | --- |
| Citation | `Carlini et al., USENIX Security 2021` |
| Keywords | memorization, training data extraction, membership inference, LLM privacy |
| Dataset / Benchmarks | GPT-2 (XL, Medium, Small); OpenWebText (implicitly) |
| Code / Repo | Not publicly released (evaluation done in collaboration with OpenAI) |

---

## Problem Statement

Large language models are often trained on massive datasets scraped from the web, potentially containing sensitive or personal information. The prevailing belief was that modern LLMs do not meaningfully memorize training data because they exhibit minimal train–test loss gaps.

This paper challenges that assumption by asking:

> Can an adversary extract verbatim training examples from a large language model using only black-box access?

The threat model assumes:
- Black-box access (API-level queries).
- No knowledge of model weights.
- No direct access to training data.

The attack goal is **indiscriminate extraction**, not targeted recovery of specific secrets.

---

## Core Idea

### 1. Attack Pipeline

The attack consists of two major phases:

#### Step 1 — Generate Candidate Sequences
Generate 200,000 samples from GPT-2 using:
- Top-n sampling
- Decaying temperature sampling
- Internet-conditioned prefix sampling

Each sample is 256 tokens long.

#### Step 2 — Rank by Memorization Likelihood

The authors introduce improved membership inference metrics:

- Raw perplexity
- Perplexity ratio vs GPT-2 Small
- Perplexity ratio vs GPT-2 Medium
- zlib compression entropy ratio
- Lowercased perplexity ratio
- Sliding-window minimum perplexity

Key insight:
> Memorized sequences have anomalously low perplexity compared to reference models or compression metrics.

---

### 2. Formal Definition: k-Eidetic Memorization

They define:

- A string is *extractable* if it can be generated with high likelihood.
- A string is **k-eidetic memorized** if it appears in at most k training documents.

Small k ⇒ stronger privacy violation.

This definition shifts memorization from vague intuition to a measurable property.

---

### 3. Key Quantitative Results

- 1,800 candidates manually inspected.
- 604 unique memorized sequences recovered.
- Best attack configuration: 67% precision.
- Extracted content included:
  - 32 contact information entries
  - 46 named individuals
  - 35 high-entropy UUID/base64 strings
  - 31 source code snippets
  - 50 valid URLs

Some sequences appeared in only **one training document**.

---

## Visual / Diagram Notes

**Figure 2 (Attack Workflow)**:
LM → 200k generations → rank via metric → deduplicate → manually inspect → verify against training data.

This makes clear the attack is entirely black-box and requires no gradient access.

**Figure 3 (zlib vs GPT-2 Perplexity Scatter Plot)**:
- Most samples lie on a diagonal.
- Memorized samples appear as outliers where GPT-2 assigns low perplexity but zlib is surprised.
- Indicates memorization detection via *likelihood ratio anomaly*.

**Table 2**:
Internet-conditioned prompts + zlib ratio yielded highest precision (67%).

---

## Key Results

- 604 memorized training examples extracted.
- Larger models memorize significantly more.
- GPT-2 XL memorizes URLs after ~33 insertions.
- Medium and Small models show much weaker memorization.
- Memorization increases with model size.

Important empirical claim:

> Memorization does NOT require overfitting.

Train/test gap was minimal, yet extraction succeeded.

---

## Personal Analysis

### What worked

- The likelihood-ratio idea (compare to smaller model or compression metric) is elegant.
- The formalization of k-eidetic memorization is useful for auditing.
- The empirical study is methodologically strong (manual verification + OpenAI collaboration).

### What puzzled me

- The paper assumes memorization is inherently undesirable, but some memorization (e.g., public licenses, digits of π) is expected.
- The boundary between “knowledge” and “memorization” is philosophically unclear.
- It is not obvious how scalable manual verification would be for GPT-3/4-scale models.

---

## Connections & Related Work

- Extends “The Secret Sharer” (Carlini et al., 2019) to large-scale LLMs.
- Related to membership inference attacks (Shokri et al.).
- Connects to differential privacy (DP-SGD).
- Relevant to scaling laws (Kaplan et al.) — larger models ⇒ greater memorization.

In modern context:
- Directly relevant to API-based LLM deployment.
- Impacts training data governance for foundation models.

---

## Implementation Sketch

If reproducing the work:

### Dependencies
- GPT-2 models (XL, Medium, Small)
- zlib compression
- Perplexity computation utilities
- Web scraping for prefix generation

### Steps
1. Generate 200k samples per strategy.
2. Compute perplexity and ratio metrics.
3. Rank samples by anomaly score.
4. Deduplicate via trigram overlap.
5. Manually search substrings online.
6. Confirm with training data (if available).

Compute budget:
- Modest by modern standards (GPT-2 scale).
- Manual inspection is the bottleneck.

---

## Open Questions / Next Actions

- How does memorization scale for GPT-3, GPT-4, or modern 70B+ models?
- Can we automate memorization auditing?
- Is differential privacy viable at trillion-token scale?
- Can we design architectural inductive biases to reduce memorization?
- How does fine-tuning affect inherited memorization?


---

## Glossary

**k-Eidetic Memorization**  
A string extractable from the model that appears in ≤ k training documents.

**Perplexity**  
Exponential of average negative log-likelihood; lower means higher model confidence.

**Membership Inference**  
Attack to determine whether data was in training set.

**Differential Privacy (DP-SGD)**  
Training method that provides formal privacy guarantees via noise injection.

**Contextual Integrity**  
Privacy framework stating data misuse occurs when information appears outside intended context.

---

## Personal Takeaway
This paper is important because it exposes a structural privacy weakness in LLMs. From my own experience using GPT-3.5 in 2022, I was able to get sensitive outputs such as Windows activation codes and callable phone numbers, that reflected with the authors’ core claim: memorization is not accidental but a byproduct of the next-token prediction objective. Rare or uniquely structured training examples like addresses or contacts can receive disproportionately low training loss, making them statistically attractive continuations under specific prompt engineering. This vulnerability is extremely dangerous, since attackers actually have no technical barriers on extracting data from LLMs as paper shown. I would rate this paper 5/5. And here are my 2 questions:
1. For legacy open source LLMs such as GPT-2, they were trained without privacy filtering. What practical mitigation strategies can reduce ongoing privacy risks, given that retraining from scratch and delete all vulnerable copies may not be feasible?
2. Do modern LLM-based agent systems introduce new privacy vulnerabilities beyond model memorization, such as tool misuse or retrieval-layer leakage?