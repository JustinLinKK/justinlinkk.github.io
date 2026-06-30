---
title: "ASTRA-sim LLM Serving Simulator"
date: 2026-06-21
excerpt: "An ASTRA-sim extension for calibrated LLM serving studies across colocated, chunked-prefill, and prefill-decode disaggregated inference, with two-GPU L40S validation and four-GPU extrapolation sweeps.<br/><img src='/images/projects/astrasim/cover.png'>"
collection: projects
---

# Project Title: ASTRA-sim LLM Serving Simulator

## Project Overview
This project extends **ASTRA-sim** into a calibrated simulator for studying large language model serving systems. The work focuses on the tension between colocated serving, where prefill and decode share the same GPU pool, and **prefill-decode disaggregation**, where prefill and decode run on specialized GPU roles with an explicit KV-cache handoff between them.

- **GitHub Repository:** [JustinLinKK/astra-sim-cse240d](https://github.com/JustinLinKK/astra-sim-cse240d)
- **Paper:** [Download PDF](/files/astrasim_paper.pdf)

The simulator represents each serving request as a dependency graph over **prefill compute**, optional **KV-cache transfer**, and iterative **decode compute**. It reports practical serving metrics such as time to first token (TTFT), time per output token (TPOT), end-to-end latency, throughput, and goodput.

The key idea is not to claim that one layout always wins. Instead, the project builds a measurement-backed workflow for asking when colocated, decode-heavy, balanced, or prefill-heavy GPU assignments make sense under different prompt lengths, output lengths, request rates, and optimization targets.

## Objectives
- **Model LLM Serving in ASTRA-sim:** Convert online inference requests into ASTRA-sim-compatible serving DAGs.
- **Compare Serving Architectures:** Study colocated, chunked colocated, and prefill-decode disaggregated execution.
- **Calibrate Against Hardware:** Fit simulator costs using measured traces from a two-GPU NVIDIA L40S server.
- **Expose Serving Metrics:** Track TTFT, TPOT, E2E latency, request throughput, output-token throughput, and goodput.
- **Explore Design Space:** Use calibrated constants to sweep token shapes, worker counts, and GPU role assignments.
- **Separate Evidence Levels:** Clearly distinguish calibrated two-GPU results from larger four-GPU simulator extrapolations.

## Thesis and Motivation
My thesis is that the ultimate target of LLM serving research should be lowering **cost per generated token** while still achieving the best practical **cost per request** for a given service-level objective. A serving system is not just trying to be fast in isolation; it is trying to place every dollar of GPU time where it creates the most useful latency and throughput improvement.

This matters because it is impossible to test every scenario and deployment configuration directly on real LLM serving hardware. Request rates, prompt lengths, output lengths, chunk sizes, GPU counts, prefill/decode splits, and scheduling policies create a very large design space. A calibrated simulator gives me a way to explore that space first, identify promising regions, and reserve expensive hardware experiments for the configurations most likely to change a deployment decision.

The current study uses static role assignment for prefill-decode disaggregated serving. That is a useful baseline, but it is not the end goal. A future serving scheduler could measure GPU idleness online and reassign idle GPUs from one role to another, or use an ML model to predict near-future demand and remap the cluster toward the lowest-cost role combination before queues build up. In that version, the simulator becomes a training and evaluation environment for adaptive scheduling policies, not only a tool for fixed-layout comparison.

Another direction is heterogeneous hardware placement. Real clusters often contain different GPU generations or memory capacities. If GPU A has more HBM and performs better during decode, while older GPU B is still effective for prefill, then the scheduler should prefer GPU A for decode-heavy work and GPU B for prefill-heavy work. The larger idea is to treat hardware differences as scheduling signals so the serving system can reduce wasted capability and push down request cost.

## System Architecture
The implementation adds a unified analytical layer on top of ASTRA-sim with three major study modes:

1. **`tp_pp_crossover`** for tensor-parallel versus pipeline-parallel tradeoff studies.
2. **`serving_disagg_colocated`** for colocated, chunked-prefill, and prefill-decode disaggregated serving.
3. **`attention_ffn_disaggregation`** for homogeneous GPU versus heterogeneous GPU+LPU placement in trillion-parameter MoE decode.

The paper centers on the serving mode, while the repository packages the supporting configs, calibration artifacts, result folders, plotting scripts, and analytical entrypoints needed to reproduce the experiments.

## Serving Model
### Colocated Execution
In colocated serving, a request stays on the same logical GPU pool for both phases:

```text
Prefill -> Decode token 1 -> Decode token 2 -> ... -> Decode token N
```

This avoids KV-transfer cost, but long prefills can interfere with decode work and increase user-visible latency.

### Prefill-Decode Disaggregation
In prefill-decode disaggregated serving, the request is split across role-specific GPU pools:

```text
Prefill -> KV send -> KV receive -> Decode token 1 -> ... -> Decode token N
```

This can reduce phase interference, but it introduces KV-cache handoff cost and makes GPU role assignment a first-class scheduling decision.

### Chunked Prefill
Chunk mode splits long prompt processing into smaller prefill chunks. In colocated mode, chunks remain on the same GPU group. In disaggregated mode, chunks run on prefill workers, and the request performs one modeled KV handoff only after the final prefill chunk.

The simulator records observable chunk fields such as prefill chunk count, maximum chunk tokens, handoff count, stage service time, and queue wait. This makes chunked replay inspectable even though the model remains a queue-level abstraction rather than a full vLLM cache-block simulator.

## Calibration Workflow
The calibrated experiment uses ShareGPT-derived request shapes with Poisson arrivals. Each trace records arrival time, prompt length, output length, source row, request rate, and random seed so the same request sequence can drive both hardware measurement and simulator replay.

The workflow is:

1. Run colocated and prefill-decode serving traces on a two-GPU NVIDIA L40S server.
2. Fit mode-specific cost terms for prefill, decode, KV transfer, first-token behavior, and queueing.
3. Replay the same traces in ASTRA-sim.
4. Compare simulated and measured TTFT, TPOT, E2E latency, throughput, and goodput.
5. Reuse the validated unchunked constants for larger design-space sweeps.

This makes the simulator useful as a **measurement planning tool**: hardware traces anchor the model, simulation identifies likely crossover regions, and follow-up hardware runs can focus on the most interesting layouts.

## Key Results
### Two-GPU Validation
The strongest calibrated result is two-GPU serving closure. In the non-overloaded validation scope:

| Mode | TTFT MAPE | TPOT MAPE | E2E MAPE |
| --- | ---: | ---: | ---: |
| Colocated unchunked | 11.15% | 4.65% | 4.86% |
| PD unchunked | 10.67% | 1.43% | 1.67% |

Request throughput and goodput stay within 0.11% MAPE across the unchunked modes. The chunked-prefill replay rows show that fixed-size chunked execution is observable and replayable, but the main calibrated design-space claim remains the unchunked two-GPU colocated and PD comparison.

### Colocated-PD Crossover
The unchunked four-GPU sweep compares a colocated data-parallel layout (`C4`) against `P1/D3`, `P2/D2`, and `P3/D1` prefill/decode splits. At 8 requests per second, colocated serving still wins many cells, but all three PD splits appear in the winner set:

- **`P1/D3`** first wins in decode-heavy regions.
- **`P2/D2`** first wins in balanced prompt/output regions.
- **`P3/D1`** first wins in prefill-heavy regions.

This result is an extrapolated simulator study, not a deployment recommendation. Its value is in identifying where real four-GPU measurements should be collected next.

### GPU Role Assignment
In the fixed four-GPU assignment sweep, adding schedulable workers improves queue availability. The best assignment in that sweep is `P1/D3`, with mean TTFT of 148.28 ms and mean E2E latency of 851.34 ms, compared with 187.81 ms TTFT and 1106.21 ms E2E for the calibrated `P1/D1` reference.

The project is careful about the interpretation: the current decode-step model is calibrated by request rate, not by measured multi-worker decode efficiency, so the result should be read as a queueing and placement signal.

### Chunked-Prefill Sensitivity
The chunked experiment fixes request rate at 4 requests per second and output length at 2048 tokens while varying input length, chunk size, and four-GPU assignment.

The sweep shows that chunk size is a first-order control knob. For both `C4` and `P2/D2`, the best chunk size follows prompt length up to 1024 tokens and then stays at 1024 for longer prompts. It also shows a practical caution: the TTFT-optimal assignment is not always the E2E-optimal assignment, and optimized chunked colocation can re-enter the winner set.

## Repository Contents
- **ASTRA-sim analytical modes:** C++ analytical entrypoints and config parsing for the new study modes.
- **Serving configs:** YAML entrypoints for colocated, disaggregated, chunked, and extrapolated serving runs.
- **Calibration tools:** Scripts for fitting serving cost models and replaying golden traces.
- **Result packages:** CSV, JSON, SVG, Markdown, and TeX outputs for paper figures and tables.
- **Compact calibration artifacts:** Git LFS archives that preserve fitted models, traces, summaries, plots, and provenance without storing full raw telemetry.
- **Regression tests:** Analytical and serving-runtime tests for the new modes.

## Reproducibility
The main analytical binary is built with:

```bash
./build/astra_analytical/build.sh
```

The serving study is launched through the public analytical config entrypoint:

```bash
./build/astra_analytical/build/bin/AstraSim_Analytical_Congestion_Aware \
  --analytical-config=$(realpath configs/serving_disagg_colocated.yaml)
```

The repository also includes commands for restoring compact calibration archives, fitting unchunked and chunked cost models, replaying validation traces, and regenerating paper-facing result packages.

## Limitations
- The simulator models serving-time behavior, not answer quality. It does not execute logits, sampling, or generated text evaluation.
- Only the two-GPU colocated point, the two-GPU `P1/D1` disaggregated point, and fixed-size two-GPU chunked replay rows are calibrated against hardware.
- Four-GPU layouts, larger worker-count sweeps, and chunked four-GPU figures are extrapolated simulator results.
- GPU roles are static during a run; the scheduler does not yet support adaptive role switching.
- The serving study assumes homogeneous GPU workers; heterogeneous GPU-aware role placement is a future extension.
- Chunked prefill is modeled at the queue level and does not yet capture vLLM block management, prefix-cache hits, preemption, or per-layer asynchronous KV transfer.

## Why It Matters
LLM serving performance depends on workload shape, scheduling policy, queueing behavior, KV-cache movement, and GPU role assignment. Testing every configuration directly on hardware is expensive, especially when token distributions and serving objectives vary.

This project shows how ASTRA-sim can become a practical bridge between hardware measurement and systems design exploration: calibrate the simulator on real traces, sweep the design space cheaply, identify crossover regimes, and return to hardware with sharper hypotheses.
