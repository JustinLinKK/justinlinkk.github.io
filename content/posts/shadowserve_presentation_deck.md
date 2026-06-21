---
title: 'Presentation Deck: ShadowServe'
date: 2026-06-21
permalink: /posts/2026/06/shadowserve-presentation-deck/
excerpt: "Course presentation deck and notes for ShadowServe, focused on distributed prefix caching, SmartNIC KV-cache fetching, and the post-presentation Blackwell decompression update.<br/><img src='/images/posts/shadowserve/cover.png'>"
tags:
  - presentation-deck
  - llm-serving
  - kv-cache
  - computer-architecture
draft: false
deck:
  title: 'ShadowServe: Interference-Free KV Cache Fetching for Distributed Prefix Caching'
  presenter: 'Jingbin Lin'
  date: 'June 1, 2026'
  file: '/files/ShadowServe.pptx'
  based_on: 'Xiang et al., arXiv 2025'
---

![Title slide for the ShadowServe presentation deck](/images/posts/shadowserve/cover.png)

## Deck Artifact

- [Download the presentation deck](/files/ShadowServe.pptx)
- Paper discussed: [ShadowServe: Interference-Free KV Cache Fetching for Distributed Prefix Caching](https://arxiv.org/abs/2509.16857)
- Presentation date: June 1, 2026

This note is centered on the presentation deck I made for class, not just the paper itself. The deck tells the story as a systems talk: long-context inference makes prefill expensive, prefix caching can reuse KV cache state, but distributed cache fetching introduces a new data movement bottleneck.

## Talk Thesis

ShadowServe asks a practical serving question:

> If many LLM requests share a long prefix, can we reuse a remote KV cache without slowing down the GPU that is actively decoding?

The answer is "sometimes yes," but only if cache fetching, decompression, dequantization, and placement do not interfere with model execution. ShadowServe's main design move is to move that cache preparation path onto a SmartNIC.

## Slide Storyline

The presentation is organized around five steps:

1. Long-context LLM serving makes prefill expensive.
2. KV cache and prefix caching expose reusable work.
3. Distributed prefix caching saves compute but adds remote fetch and decompression cost.
4. GPU decompression is not free because it competes with decode.
5. ShadowServe offloads the fetch path to a SmartNIC, then evaluates where that helps and where it fails.

## Core Serving Background

LLM serving has two phases:

- **Prefill**: read the full input prompt and compute KV cache state.
- **Decode**: generate output tokens sequentially, using the cached K/V from prior tokens.

Long prompts hurt prefill because the model must process many input tokens before producing the first output token. That matters for TTFT, or time to first token. Decode then controls TPOT, or time per output token.

Prefix caching becomes useful when multiple requests share the same beginning: system prompts, retrieved documents, chat history, or the same long reference document. Instead of recomputing the shared prefix, the system reuses the cached KV state and computes only the request-specific suffix.

## Why Remote KV Fetching Is Hard

Distributed prefix caching is attractive because KV caches are large and multiple GPUs may want to share them. But remote reuse only pays off if fetching the cache is faster than recomputing prefill.

The fetch path usually has three costs:

- Network transfer.
- Decompression.
- Moving the prepared KV cache into GPU memory.

Compression reduces network traffic, especially under limited bandwidth, but it adds decompression. If decompression runs on the same GPU that is decoding, it can interfere with model execution.

## ShadowServe Design

![Slide showing ShadowServe's control-plane and data-plane split](/images/posts/shadowserve/control-data-plane.png)

ShadowServe splits the system into a CPU control plane and a SmartNIC data plane.

The CPU control plane schedules requests and coordinates cache fetches. When a request can use a remote cached prefix, the KV cache manager moves it into a fetching queue. The GPU keeps working on other requests while the cache is fetched. Once the fetch completes, the request returns through a completion queue.

The SmartNIC data plane handles the heavy cache movement path:

1. Fetch compressed cache data from remote storage.
2. Decompress it.
3. Dequantize it.
4. DMA the result into GPU memory.

The GPU keeps model compute and paged KV memory as its main responsibilities.

## Chunked Pipeline

![Slide showing ShadowServe's four-stage SmartNIC chunked pipeline](/images/posts/shadowserve/chunked-pipeline.png)

The deck emphasizes that SmartNIC offload is not automatically fast. BlueField-style SmartNICs have weaker general-purpose cores and a more constrained memory subsystem than a host server.

ShadowServe splits the KV cache into chunks and pipelines those chunks across four stages:

- Network.
- Decompress.
- Dequantize.
- DMA.

Different chunks can occupy different stages at the same time, which helps overlap work. The design also pre-allocates and pins buffers to avoid runtime allocation, memory registration overhead, and redundant copies.

## Evaluation Takeaway

![Slide summarizing ShadowServe's end-to-end latency results](/images/posts/shadowserve/end-to-end-results.png)

The highlighted end-to-end result compares:

- `vLLM`: recompute KV cache.
- `CacheGen-Async`: remote compressed KV cache with GPU decompression.
- `ShadowServe`: SmartNIC-offloaded cache fetching and preparation.

In the 20 Gbps, 32-output-token setting from the deck, ShadowServe reports:

- 16% lower unloaded TTFT than CacheGen-Async.
- 20% lower loaded TPOT.
- 18% higher maximum throughput.

The broader result is workload-dependent. ShadowServe is strongest when bandwidth is limited, outputs are long enough that TPOT matters, and GPU decompression interference is expensive.

## Limitation Slide

![Slide showing the SmartNIC network-stage bottleneck](/images/posts/shadowserve/smartnic-bottleneck.png)

The most important limitation is that offload moves the bottleneck. The deck highlights the SmartNIC microbenchmark where the network stage reaches about 37.3 Gbps standalone but drops to about 20.6 Gbps inside the full pipeline.

My read is that this is the most honest part of the result. ShadowServe does not make data movement disappear. It changes where the bottleneck lives, from GPU interference to SmartNIC memory and network contention.

## After-Presentation Blackwell Update

The feedback I got after the presentation was that the paper may be hard to publish in its current form because newer NVIDIA Blackwell GPUs integrate decompression into the architecture. I checked this, and the feedback is real.

NVIDIA's [nvCOMP Decompression Engine FAQ](https://docs.nvidia.com/cuda/nvcomp/decompression_engine_faq.html) says Blackwell has a dedicated hardware Decompression Engine with support for formats including Snappy, LZ4, Deflate, and GZip. NVIDIA's [technical blog on Blackwell decompression](https://developer.nvidia.com/blog/speeding-up-data-decompression-with-nvcomp-and-the-nvidia-blackwell-decompression-engine/) also describes compressed data being moved over PCIe or C2C and decompressed in transit while compute continues.

That weakens ShadowServe's original motivation for future Blackwell deployments. If decompression no longer consumes the same general-purpose GPU resources as decode, then a baseline like CacheGen-Async on an L40S is not the final word. A stronger final paper would need a Blackwell-aware baseline using nvCOMP hardware decompression.

Still, Blackwell does not erase the whole idea. ShadowServe also addresses asynchronous scheduling, remote I/O, dequantization, DMA placement, and paged KV memory layout. The Blackwell update changes the comparison, but the broader systems lesson remains: KV cache reuse shifts bottlenecks among compute, network, decompression, dequantization, and memory placement.

## My Takeaway

As a presentation topic, ShadowServe is useful because it makes LLM serving feel like a full-stack systems problem instead of only a model optimization problem. The paper's specific SmartNIC-vs-GPU decompression argument is less future-proof after Blackwell, but the deck still captures a durable architecture lesson: once prefill compute is reused, the hard part becomes moving intermediate state through the serving stack without disturbing decode.
