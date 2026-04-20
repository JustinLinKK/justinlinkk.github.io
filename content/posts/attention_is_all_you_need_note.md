---
title: 'Paper Notes: Attention Is All You Need'
date: 2026-04-20
permalink: /posts/2026/04/attention-is-all-you-need/
tags:
  - research-notes
  - transformer
  - llm
draft: false
paper:
  title: 'Attention Is All You Need'
  authors: 'Vaswani et al.'
  venue: 'NeurIPS 2017'
  link: 'https://arxiv.org/abs/1706.03762'
---

## TL;DR
- This paper replaces RNNs/CNNs with a fully attention-based architecture for sequence modeling.
- The Transformer enables parallel computation and captures long-range dependencies efficiently.
- The key takeaway is that self-attention alone is sufficient and more scalable than recurrence.

## Bibliographic Snapshot
| Field | Detail |
| --- | --- |
| Citation | `Vaswani et al., NeurIPS 2017` |
| Keywords | transformer, attention, sequence modeling |
| Dataset / Benchmarks | WMT 2014 En-De, En-Fr |
| Code / Repo | https://github.com/tensorflow/tensor2tensor |

## Problem Statement
Traditional sequence models rely on RNNs or CNNs, which suffer from limited parallelism and difficulty capturing long-range dependencies. The sequential nature of RNNs makes training slow and inefficient for long sequences. The paper aims to design a model that removes recurrence while maintaining strong performance on sequence transduction tasks like machine translation.

## Core Idea
1. Replace recurrence and convolution with **self-attention**
2. Use **encoder-decoder architecture** with stacked layers
3. Key components:
   - Multi-head self-attention
   - Position-wise feed-forward networks
   - Residual connections + layer normalization
4. Attention formula:
   - Scaled Dot-Product Attention:
     Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V
5. Positional encoding injects sequence order using sinusoidal functions

## Visual / Diagram Notes
- Figure 1 (page 3) shows the full Transformer architecture:
  - Encoder: repeated self-attention + FFN blocks
  - Decoder: masked attention + encoder-decoder attention
- Figure 2 (page 4) explains scaled dot-product attention and multi-head attention
- Key intuition: multiple heads learn different relationships in parallel

## Key Results
- Achieves **28.4 BLEU** on WMT En-De, outperforming prior models
- Much lower training cost compared to RNN/CNN-based models
- Strong parallelization → significantly faster training
- Ablation: multi-head attention improves performance over single-head
- Limitation: quadratic complexity in sequence length (O(n^2))

## Personal Analysis
**What worked**:
- Elegant removal of recurrence simplifies architecture
- Parallelism is a major practical advantage
- Attention provides interpretable alignment patterns

**What puzzled you**:
- Quadratic complexity limits scaling to very long sequences
- Positional encoding feels somewhat heuristic

## Connections & Related Work
- Replaces RNN-based seq2seq (e.g., LSTM, GRU)
- Extends attention mechanisms used in prior models
- Foundation of modern LLMs (GPT, BERT, etc.)

## Implementation Sketch
- Framework: PyTorch / TensorFlow
- Steps:
  1. Tokenize input (BPE)
  2. Add positional encoding
  3. Stack encoder layers (self-attention + FFN)
  4. Stack decoder layers (masked + cross attention)
  5. Train with Adam + learning rate warmup
- Hyperparameters:
  - d_model = 512
  - heads = 8
  - layers = 6
- Compute: multi-GPU recommended

## Open Questions / Next Actions
- Can attention be made more efficient than O(n^2)?
- How to scale to longer contexts?
- Explore sparse or linear attention variants

## Glossary
- Self-attention: mechanism relating all tokens in a sequence
- Multi-head attention: parallel attention projections
- Positional encoding: injects order into sequence
