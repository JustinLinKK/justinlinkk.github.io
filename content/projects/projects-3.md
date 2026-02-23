---
title: "Raspberry Pi Cluster v2"
date: 2025-08-01
excerpt: "A smaller, portable Raspberry Pi cluster with a similar v1 software stack<br/><img src='/images/projects/piclusterv2/1.jpg'>"
collection: projects
---

# Project Title: Raspberry Pi Cluster v2

## Project Overview
Raspberry Pi Cluster v2 is a compact, portable rebuild of v1 with a similar software environment but a much smaller physical footprint. The goal was to keep the familiar SLURM + MPI workflow while making the cluster easier to carry and faster to set up. A live status page tracks node availability and health for quick checks while on the go.

- **Cluster Status Monitor:** [Cluster Status](https://justinlinkk.github.io/cluster-status/)

## Objectives
- **Portability:** Shrink the overall size and power requirements while keeping core capabilities from v1.
- **Environment Parity:** Maintain a similar SLURM + OpenMPI stack to reuse scripts and workflows.
- **Visibility:** Provide a lightweight monitoring page for quick status checks and diagnostics.

## Hardware Components
- **Master Node:** 1 x Raspberry Pi (control node for scheduling and monitoring)
- **Compute Nodes:** Raspberry Pi Zero 2 units for low-power, compact compute
- **Cluster Interface:** Cluster HAT for rapid deployment and reliable multi-node connections

- **Thanks to Cluster HAT:** [Cluster HAT](https://clusterhat.com/)

## Software Configuration
- **Operating System:** Lightweight Linux distribution optimized for low resource usage
- **SLURM:** Scheduling and job control across compute nodes
- **OpenMPI:** Parallel execution for MPI jobs
- **Monitoring:** A minimal web dashboard for node status and quick health checks

## Implementation Details
1. **Compact Assembly:** Designed a smaller enclosure for easy transport and quick setup.
2. **Environment Replication:** Matched the v1 software stack for compatibility with existing scripts and workflows.
3. **Cluster HAT Integration:** Leveraged Cluster HAT to simplify wiring and reduce setup time.
4. **Status Monitoring:** Built and hosted a lightweight cluster status page for node health tracking.

## Challenges and Resolutions
- **Tighter Resource Constraints:** Raspberry Pi Zero 2 nodes required careful tuning of MPI job sizes and concurrency.
- **Memory and CPU Limits:** Adjusted scheduling defaults, job limits, and MPI settings to avoid oversubscription.
- **Portability vs. Performance:** Balanced size reduction with enough compute power for meaningful parallel workloads.

## Outcomes
- **Portable Cluster:** A compact, carry-ready cluster with a familiar v1 workflow.
- **Improved Mobility:** Faster setup and teardown without losing core capabilities.
- **Operational Visibility:** Live monitoring for quick validation and troubleshooting.
- **Portfolio Deployment:** Currently responsible for building and deploying my personal portfolio website every time I update it.

## Future Plans
- **Power Profiling:** Measure and optimize power draw for longer off-grid runs.
- **Job Templates:** Create MPI job presets for the Zero 2 resource profile.
- **Thermal Improvements:** Add passive cooling options to maintain stable performance.

This project focuses on portability and practical usability while preserving the distributed computing workflow from v1.
