---
title: 'Paper Notes: ShadowServe'
date: 2026-06-21
permalink: /posts/2026/06/shadowserve-paper-notes/
tags:
  - research-notes
  - llm-serving
  - kv-cache
  - computer-architecture
draft: false
paper:
  title: 'ShadowServe: Interference-Free KV Cache Fetching for Distributed Prefix Caching'
  authors: 'Xingyu Xiang, Raj Joshi, Yuhan Liu, Jiayi Yao, Chenxingyu Zhao, Junchen Jiang, Yang Zhou, Eddie Kohler, Minlan Yu'
  venue: 'arXiv preprint, 2025'
  link: 'https://arxiv.org/abs/2509.16857'
---

## TL;DR
- ShadowServe targets distributed prefix caching for long-context LLM serving: reuse remote KV cache entries without slowing down active model inference.
- Its core move is to offload the cache-fetching data plane to a SmartNIC, which handles network fetch, lossless decompression, dequantization, and DMA transfer to GPU memory.
- The important post-presentation update is that NVIDIA Blackwell adds a dedicated hardware Decompression Engine, which weakens the paper's GPU-decompression-interference argument for future Blackwell deployments.

## Bibliographic Snapshot
| Field | Detail |
| --- | --- |
| Citation | Xiang et al., arXiv 2025 |
| Keywords | LLM serving, KV cache, prefix caching, SmartNIC, decompression, Blackwell |
| Local files | [Presentation](/files/ShadowServe.pptx), [Paper PDF](/files/ShadowServe.pdf) |
| Online paper | https://arxiv.org/abs/2509.16857 |
| Blackwell update | [NVIDIA nvCOMP docs](https://docs.nvidia.com/cuda/nvcomp/decompression_engine_faq.html) and [NVIDIA technical blog](https://developer.nvidia.com/blog/speeding-up-data-decompression-with-nvcomp-and-the-nvidia-blackwell-decompression-engine/) confirm Blackwell's dedicated decompression hardware |

## Problem Statement
Long-context LLM serving is expensive because every request must first process a potentially huge prompt during prefill. This prefill phase produces the KV cache, which decode later uses to generate tokens sequentially. If many requests share the same prefix, such as a system prompt, document, chat history, or retrieved context, prefix caching can reuse the precomputed KV cache instead of recomputing it.

The problem becomes harder in distributed serving. KV caches can be too large to keep locally, and multiple GPUs may want to share the same cache entries. Fetching a remote KV cache is only useful if the fetch path is faster than recomputing prefill. Compression reduces network traffic, but decompression can become a new bottleneck.

## Core Idea
Prior distributed prefix caching systems often fetch compressed KV cache data and decompress it on the serving GPU. ShadowServe argues that this is not free: decompression competes with LLM decode for GPU resources, causing both decode and decompression to slow down. Moving decompression to the CPU avoids GPU interference, but CPU decompression has limited throughput and the CPU is often already busy with serving-side work.

ShadowServe instead moves the cache preparation data path to a SmartNIC:

1. The host CPU keeps the control plane.
2. The SmartNIC owns the data plane.
3. The GPU stays focused on model computation and paged KV memory.

This makes the system less about a new compression algorithm and more about hardware placement: where should KV cache movement and transformation run so it does not interfere with model serving?

## Design Notes
### Control Plane
The KV cache manager runs alongside the serving scheduler. When the scheduler forms a prefill batch, the manager intercepts requests whose KV cache can be fetched remotely. Those requests move into a fetching queue while the GPU keeps processing other work. When the SmartNIC data plane finishes fetching and preparing the KV cache, the request returns through a completion queue.

One subtle point: fetching the KV cache is not equivalent to a full prefill. A full prefill also produces the hidden state needed for the first output token. ShadowServe follows the CacheGen workaround: mark the final token as not yet prefilled, then let the scheduler finish that last local step.

### SmartNIC Data Plane
The data plane uses a four-stage chunked pipeline:

1. Network fetch from remote storage.
2. Lossless decompression.
3. Dequantization.
4. DMA transfer into GPU memory.

The KV cache is split into chunks so different chunks can occupy different pipeline stages at the same time. This helps hide stage latency and better uses the SmartNIC's limited compute resources.

### Memory Management
ShadowServe pre-allocates and pins buffers to avoid runtime allocation, memory registration overhead, and redundant copies. It first DMA-transfers data into a contiguous GPU destination buffer, then uses a lightweight scatter step to place data into paged KV memory. This keeps the data path tight, but it also reveals how sensitive the system is to the SmartNIC memory subsystem.

## Key Results
The presentation compared:

- `vLLM`: recompute KV cache.
- `CacheGen-Async`: remote compressed KV cache with GPU decompression.
- `ShadowServe`: SmartNIC-offloaded fetch and preparation.

In the highlighted setting with 20 Gbps bandwidth and 32 output tokens, ShadowServe achieved:

- 16% lower unloaded TTFT than CacheGen-Async.
- 20% lower loaded TPOT.
- 18% higher maximum throughput.

The paper's broader headline results report up to 2.2x lower loaded TPOT, up to 1.38x lower TTFT in low-bandwidth scenarios, and up to 1.35x higher throughput. The win is strongest when network bandwidth is limited, outputs are long enough for TPOT to matter, and GPU decode interference is expensive.

## Where ShadowServe Wins
ShadowServe is most convincing in low-bandwidth, TPOT-sensitive serving:

- Low bandwidth makes compression valuable.
- Longer outputs make TPOT more important than TTFT.
- GPU decode interference matters because decode runs throughout generation.
- SmartNIC offload can overlap cache fetching with useful GPU work.

The system is less compelling when the output is very short or bandwidth is high. In those cases, TTFT dominates, and the SmartNIC pipeline can become the bottleneck.

## Main Limitation
ShadowServe removes one bottleneck but exposes another. In the paper's SmartNIC microbenchmark, the network stage reaches about 37.3 Gbps standalone, but drops to about 20.6 Gbps inside the full pipeline. The likely cause is memory subsystem contention on the BlueField-3 SmartNIC. That result is important because it shows that offloading is not automatically a win: the offload target has its own compute, memory, and I/O limits.

Other limitations worth remembering:

- The evaluation assumes a 100% remote cache hit rate to isolate remote fetching.
- Local prefix caching is disabled in the setup.
- The implementation does not support partial hits or chunked prefill.
- Pairing each GPU with a capable SmartNIC increases deployment cost and complexity.

## Blackwell Update
The after-presentation feedback checks out. NVIDIA documents that Blackwell introduces a dedicated hardware Decompression Engine through nvCOMP. The [official nvCOMP documentation](https://docs.nvidia.com/cuda/nvcomp/decompression_engine_faq.html) says the Blackwell Decompression Engine can reach up to 600 GB/s, supports formats such as Snappy, LZ4, Deflate, and GZip, and frees SM resources by integrating decompression with the copy engine. NVIDIA's [technical blog](https://developer.nvidia.com/blog/speeding-up-data-decompression-with-nvcomp-and-the-nvidia-blackwell-decompression-engine/) also says compressed data can be moved over PCIe or C2C and decompressed in transit while compute continues.

This matters because ShadowServe's main motivation is that GPU decompression interferes with LLM decode. On Blackwell, standard-format decompression may no longer consume the same general-purpose GPU resources. For ShadowServe's Deflate-based path, a Blackwell baseline using nvCOMP's Decompression Engine would be a much stronger comparison than CacheGen-Async on an L40S.

My interpretation:

- The feedback does not prove the paper cannot be published, but it does identify a serious moving-target risk.
- The paper's motivation is strongest for pre-Blackwell GPUs, GPUs without decompression hardware, unsupported codecs, or deployments where network and dequantization remain the dominant bottlenecks.
- A final version would likely need to evaluate against Blackwell-style hardware decompression or reframe the contribution around full data-path offload rather than decompression alone.

Important nuance: Blackwell's Decompression Engine does not automatically solve all of ShadowServe. ShadowServe also handles asynchronous scheduling, remote I/O, dequantization, DMA placement, and memory management. It changes the baseline, but it does not erase the broader lesson that KV cache reuse shifts bottlenecks across the serving stack.

## Personal Analysis
**What worked**:  
The paper's system story is clean. It starts from a practical LLM serving pain point, shows why compressed remote KV cache is attractive, then demonstrates that decompression can interfere with decode. The control-plane/data-plane split is also a useful mental model for thinking about LLM serving systems.

**What puzzled me**:  
The evaluation is very dependent on hardware and workload assumptions. A 100% remote hit rate makes the data-path comparison clean, but real systems must also handle partial hits, eviction, cache locality, and dynamic routing. The Blackwell update also makes the hardware baseline feel unstable: once decompression moves into a dedicated GPU engine, the relative value of a SmartNIC changes.

## Connections
- **CacheGen / LMCache**: ShadowServe builds on the idea of transmitting compressed KV cache, but moves decompression away from the GPU.
- **vLLM prefix caching**: Local prefix caching solves the single-node version; ShadowServe addresses the distributed remote-cache path.
- **SmartNIC systems**: The paper fits into a broader trend of moving data-intensive work closer to I/O devices.
- **Blackwell nvCOMP Decompression Engine**: Future GPU hardware may absorb part of the offload problem directly into the GPU architecture.

## Discussion Questions
- In a production serving system, would I optimize first for TTFT, TPOT, or cost per generated token?
- If Blackwell removes most GPU decompression interference, does SmartNIC offload still win for dequantization and network placement?
- How often do real applications have remote cache hit rates high enough to justify this pipeline?
- Is one SmartNIC per GPU a reasonable deployment assumption, or does it only fit high-end serving clusters?

## Final Takeaway
ShadowServe is a strong paper for understanding how long-context LLM serving turns memory movement into a first-class systems problem. Its most durable lesson is not simply "decompress on the SmartNIC." The deeper lesson is that KV cache reuse moves the bottleneck among prefill compute, network bandwidth, decompression, dequantization, memory layout, and scheduling. Blackwell's decompression hardware makes the specific SmartNIC-vs-GPU decompression argument less future-proof, but it also makes the paper a useful case study in how quickly architecture changes can reshape systems research.
