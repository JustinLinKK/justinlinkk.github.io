---
title: "Quad-Core Attention Accelerator"
date: 2026-03-23
excerpt: "Quad-core Verilog attention accelerator with adaptive core grouping, double-buffered memory loading, sparsity-aware B1/B2 filtering, and published RTL-to-physical-design evidence.<br/><img src='/images/projects/quad_core_acc/mac_array.png'>"
collection: projects
---

# Project Title: Quad-Core Attention Accelerator

## Project Overview
This project is a **quad-core hardware attention accelerator** implemented in **Verilog RTL** and released as a public snapshot of the final Step 6 design. The repository packages the main compute blocks, top-level integration RTL, representative testbenches, sparse dataset generation scripts, simulation vectors, and selected synthesis and place-and-route artifacts.

- **GitHub Repository:** [JustinLinKK/quad-core-attention-accelerator](https://github.com/JustinLinKK/quad-core-attention-accelerator)

The design focuses on scaling an attention-style compute pipeline beyond a single core while still handling practical implementation constraints such as memory overlap, timing pressure, sparse execution behavior, and cross-core accumulation.

## Objectives
- **Scale Attention Compute:** Extend a single-core datapath into a grouped quad-core architecture for higher throughput.
- **Improve Data Movement:** Reduce idle time with double-buffered loading for the major on-chip memories.
- **Support Sparse Execution:** Add zero-skipping and B1/B2 control behavior to avoid unnecessary switching.
- **Preserve Timing Feasibility:** Clean up the datapath and add selective pipelining for a 1 GHz design target.
- **Publish End-to-End Evidence:** Package verification, synthesis, and physical-design artifacts alongside the RTL.

## Architecture Highlights
- **Quad-Core Integration:** `core.v` and `fullchip.v` compose the accelerator into a multi-core top level with adaptive grouping modes.
- **Adaptive Grouping:** Supports enabled-core layouts such as `[2,2]`, `[1,1,2]`, and full 4-core operation.
- **Cross-Core Accumulation:** `cross_core_adder.v` provides the accumulation path across cores.
- **Compute Fabric:** Built around `mac_array`, `mac_col`, and `sfp_optimized` for the main attention datapath.
- **Memory / Control Path:** Includes scratchpad-style local storage, output FIFO support, and clock-domain-crossing logic.

## Key Design Improvements

### 1. Double-Buffered Loading
The final design adds double buffering in `pmem`, `kmem`, and `qmem` so the next tile can be loaded while the current tile is still being processed. This improves overlap between memory movement and compute.

### 2. Sparse B1 / B2 Control
The accelerator includes sparsity-aware behavior for B1/B2 filtering experiments, along with skip-normalization flow in the optimized sparse processing path. This lets the design model more realistic sparse attention workloads instead of only dense matrix flow.

### 3. Zero-Skipping and Gating
All-zero `Q` or `K` rows can suppress unnecessary register and MAC activity, reducing wasted switching and improving efficiency on sparse inputs.

### 4. Timing-Aware Datapath Cleanup
The published Step 6 RTL adds a small pipeline stage in `mac_col` to improve timing near the 1 GHz target, accepting a modest extra cycle of output latency in exchange for cleaner critical-path behavior.

### 5. Parallel Core Loading
Input-duplication muxing allows grouped cores to be loaded in parallel from a shared input path, which makes the multi-core modes more practical from a system-integration standpoint.

## Repository Contents
1. **RTL Sources:** top-level and block-level Verilog modules for the accelerator
2. **Testbenches:** representative verification benches for single-core, double-buffered, sparse, and full-chip cases
3. **Dataset Scripts:** Python utilities for generating sparse attention-style vectors and B2-oriented datasets
4. **Simulation Assets:** filelists and saved simulation outputs
5. **Synthesis Collateral:** selected block-level synthesis deliverables
6. **PnR Collateral:** packaged place-and-route outputs for key submodules

## Verification and Reproducibility
The repo includes sample sparse manifests, full-chip B2 datasets, and simulator filelists that document how the published test cases were assembled. Representative verification coverage spans blocks such as:

- `sfp_optimized`
- `mac_array`
- `mac_col`
- `core`
- `fullchip`
- `cross_core_adder`

This makes the project more than a code dump; it also captures the experimental setup used to validate the architecture direction.

## Physical Design Status
One of the strongest parts of this release is that it includes **physical-design evidence**, not just RTL. The repository shows that several standalone blocks are in strong shape for the target direction, while also being honest that **hierarchical reintegration and top-level timing closure remain the main follow-on challenge**.

That makes the project valuable both as:
- a working RTL accelerator design, and
- a documented hardware implementation study showing where scaling pressure appears in practice.

## Outcomes
- Built a **quad-core attention accelerator RTL** with adaptive multi-core grouping
- Added **double-buffered memory flow** to improve tile-to-tile overlap
- Implemented **sparsity-aware skip behavior** and B1/B2 control paths
- Published **testbenches, datasets, simulation assets, synthesis, and PnR evidence** in one repository
- Captured the real tradeoff between **block-level timing success** and **full-chip integration difficulty**

## Why It Matters
This project sits at the intersection of **AI acceleration** and **physical hardware realization**. Instead of stopping at algorithm ideas or high-level architecture diagrams, it pushes through RTL integration, verification infrastructure, and implementation evidence.

That makes it a strong systems project: it demonstrates not only how an attention accelerator can be structured, but also what it takes to move that design toward a realistic silicon-oriented workflow.
