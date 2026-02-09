---
title: "2-D Systolic Array Accelerator"
date: 2025-12-01
excerpt: "Reconfigurable 2-D systolic array accelerator for DNN matrix multiplication with SIMD and power-saving optimizations.<br/><img src='/images/projects/2D_systolic_array/Systolic_array_structure.png'>"
collection: projects
---

# Project Title: 2-D Systolic Array Accelerator (ECE284)

## Project Overview
This project implements and analyzes a 2-D systolic array accelerator for deep neural network inference. It begins with a weight-stationary baseline and evolves into a reconfigurable architecture with SIMD support, output-stationary mode, and alpha-stage optimizations for accuracy, sparsity, and power efficiency.

## Objectives
- **High-Throughput Matrix Multiply:** Use a grid of processing elements (PEs) to maximize data reuse and minimize memory traffic.
- **Reconfigurable Dataflow:** Support both Weight Stationary (WS) and Output Stationary (OS) modes for different layer shapes.
- **Low-Precision Acceleration:** Enable INT4 baseline and INT2 SIMD packing to increase throughput.
- **Power and Sparsity Optimizations:** Incorporate skip logic and clock gating for sparse workloads.

## Architecture Highlights
- **2-D PE Array:** Systolic data movement across rows and columns for regular, high-bandwidth compute.
- **WS Mode:** Weights stay resident in PEs while activations stream through the array.
- **OS Mode:** Partial sums accumulate within PEs to reduce off-chip traffic.
- **SIMD INT2:** Two INT2 operations packed into a single INT4 datapath for doubled effective throughput.

## Project Structure
1. **Part 1: Vanilla WS Array**
   - Baseline weight-stationary implementation.
   - Validated with a quantized VGG16 layer on CIFAR-10.

2. **Part 2: SIMD Support**
   - Adds INT2 support using SIMD packing within the MAC datapath.

3. **Part 3: Reconfigurable Array**
   - Adds OS mode for flexible dataflow selection.

4. **Part 4: Poster**
   - Presentation material summarizing the architecture and results.

5. **Part 5: Alpha Enhancements**
   - **Optimized Training:** Adam optimizer, cosine scheduler, and label smoothing to recover quantized accuracy.
   - **Coarse-to-Fine Pruning:** Mixed pruning to improve sparsity with minimal accuracy loss.
   - **Gating and Power Saving:** Zero-skipping and clock gating in OS mode.
   - **Multi-Tiling:** Scalable multi-core tiling for larger workloads.

6. **Reports**
   - Final report and progress report documenting design decisions and results.

## Tooling
- **Hardware Simulation:** Verilog simulation with standard EDA tools.
- **Software Modeling:** Python, PyTorch, and Jupyter notebooks for training and analysis.
- **GitHub:** https://github.com/JustinLinKK/ece284-project

## Outcomes
- Demonstrated a functional 2-D systolic array with reconfigurable WS/OS dataflows.
- Achieved higher throughput for low-precision workloads via SIMD packing.
- Validated power-saving mechanisms for sparse operations.
- Documented architectural tradeoffs and optimization results in reports and poster.
