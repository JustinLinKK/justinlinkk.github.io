---
title: 'Paper Notes: Firecracker Lightweight Virtualization for Serverless Applications'
date: 2026-02-03
permalink: /posts/2026/02/firecracker-lightweight-virtualization/
tags:
  - research-notes
  - systems
  - virtualization
  - serverless
draft: false
paper:
  title: 'Firecracker: Lightweight Virtualization for Serverless Applications'
  authors: 'Alexandru Agache et al.'
  venue: 'USENIX NSDI 2020'
  link: 'https://www.usenix.org/conference/nsdi20/presentation/agache'
---

## TL;DR

- This paper tackles the tension between strong VM-level isolation and the low overhead / fast startup required by serverless platforms.
- Firecracker replaces QEMU with a minimal Rust-based VMM built on KVM, enabling microVMs with ~3MB memory overhead and ~125ms boot times.
- The biggest takeaway: **specialization for serverless workloads (not general-purpose virtualization) enables dramatically improved density without sacrificing hardware-backed isolation**.



## Bibliographic Snapshot

| Field | Detail |
|  |  |
| Citation | `Agache et al., NSDI 2020` |
| Keywords | microVM, serverless, virtualization, isolation, KVM |
| Dataset / Benchmarks | Boot time CDF, memory overhead, IO throughput (fio, iperf3) |
| Code / Repo | https://github.com/firecracker-microvm/firecracker |


## Problem Statement

Serverless platforms (e.g., AWS Lambda) must run **millions of mutually untrusted workloads** on shared hardware while satisfying:

- Strong isolation (against privilege escalation and side-channel attacks)
- Minimal memory and CPU overhead
- Fast startup (sub-second cold start)
- Compatibility with arbitrary Linux binaries
- High density (thousands of sandboxes per host)
- Soft allocation and oversubscription

Traditional solutions present a tradeoff:

- **Containers** → low overhead, weaker isolation (shared kernel).
- **VMs (QEMU/KVM, Xen)** → strong isolation, high memory overhead and slow startup.

The core research question:

> Can we build a virtualization layer that provides VM-level isolation with container-like performance and density?


## Core Idea

Firecracker is a **minimal, specialized Virtual Machine Monitor (VMM)** built on Linux KVM that provides lightweight "MicroVMs" tailored for serverless workloads.

### 1. Main Components

- **KVM** for hardware-assisted virtualization.
- **Custom Rust VMM (~50k LOC)** replacing QEMU (>1.4M LOC).
- **Minimal device model**:
  - virtio block
  - virtio network
  - serial console
  - no PCI, USB, BIOS, GPU, etc.
- **REST API** for lifecycle management.
- **Process-per-MicroVM model**.
- **Jailer**: seccomp + chroot + namespace sandbox for the VMM itself.

Design philosophy:  
> Remove everything not strictly required for serverless workloads.


### 2. Architectural Choices

#### Specialization

Firecracker deliberately does **not** support:

- Arbitrary BIOS
- VM migration
- PCI device emulation
- Legacy devices
- Windows guests (without major changes)

This reduces:

- Trusted Computing Base (TCB)
- Attack surface
- Memory footprint
- Boot time


### 3. Security Model

Compared to containers:

- Containers → guest code directly invokes host kernel syscalls.
- Firecracker → guest code runs in a separate guest kernel enforced by hardware virtualization.

Additional protections:

- SMT disabled (side-channel mitigation)
- seccomp filtering (24 syscalls allowed in jailer)
- chroot isolation
- rate limiting on IO devices
- no filesystem passthrough (block device only)

Firecracker moves the security boundary from:
Application ↔ Host Kernel
to:
Application ↔ Guest Kernel ↔ VMM ↔ Host Kernel

### 4. Boot Optimization

Boot time defined as:
> VMM fork → guest kernel forks init

Key optimizations:

- No BIOS (direct kernel loading)
- Minimal Linux kernel config
- No kernel modules
- Compressed minimal kernel (~4MB)
- Logging disabled on serial console
- Pre-configured MicroVM pooling

Result:

- ~125–150ms boot
- 150 MicroVMs/sec per host


## Visual / Diagram Notes

### Lambda Architecture (Fig. 2 & 3)

- Control path: Frontend → Worker Manager → Placement → Worker.
- Each Lambda slot = one MicroVM.
- One Firecracker process per MicroVM.
- MicroManager communicates with shim inside VM via TCP/IP.

Important architectural insight:
- **MicroVM is the primary security boundary.**
- Worker can run **hundreds or thousands** of MicroVMs simultaneously.


### Boot Time CDF (Fig. 5 & 6)

Observations:

- Firecracker boots ~2× faster than QEMU (serial).
- Pre-configured Firecracker has tighter 99th percentile.
- Under parallel launch (50 VMs):
  - ~146ms 99th percentile.

Takeaway:
> API design + kernel specialization are as important as hypervisor architecture.


### Memory Overhead (Fig. 7)

Constant overhead per VM:

- Firecracker: ~3MB
- Cloud Hypervisor: ~13MB
- QEMU: ~131MB

For small VMs (128MB), QEMU overhead is catastrophic.

This is the decisive density advantage.


### IO Performance (Fig. 8 & 9)

Block IO:

- 4k read limited (~13k IOPS).
- No flush-to-disk in current implementation.
- Higher latency for large blocks.

Networking:

- ~15Gbps vs host ~44Gbps.
- Slightly lower than Cloud Hypervisor.

Tradeoff:
> Firecracker optimizes density & isolation first; near-bare-metal IO is not primary goal.

## Key Results

- **Boot time**: ~125–150ms
- **Memory overhead**: ~3MB per VM
- **Density**: thousands per host
- **Oversubscription**: tested up to 20× (10× in production)
- Used in Lambda since 2018
- Processes trillions of events per month

Compared to QEMU:

- ~96% fewer LOC
- ~40× less memory overhead
- Faster cold start

## Personal Analysis

### What Worked

- Extreme minimalism is the correct design strategy.
- Replacing QEMU entirely was a bold but justified move.
- Specialization enabled measurable system-level economic improvements.
- Process-per-VM model simplifies reasoning and debugging.

From a systems perspective, this is a strong example of:
> Engineering specialization outperforming general-purpose abstraction.



### What Puzzled Me

- Block IO implementation sacrifices durability (no flush).
- Network performance significantly below host.
- Reliance on Linux host scheduler increases TCB.
- Side-channel mitigations depend heavily on operational discipline.

Also, no VM migration — how does that limit elasticity or maintenance strategies?

## Connections & Related Work

- **Kata Containers** → VM isolation for containers (but heavier).
- **gVisor** → user-space kernel isolation (container-based).
- **LightVM (SOSP ’17)** → similar minimal VM goal.
- **Cloud Hypervisor** → similar Rust-based VMM.

Conceptual bridge:
- Moves container isolation paradigm toward microVM abstraction.
- Suggests future of container runtimes may be virtualization-backed.

## Implementation Sketch

If reproducing:

### Dependencies

- Linux host with KVM
- Rust toolchain
- Minimal Linux kernel build
- Rootfs image
- TAP networking setup

### Steps

1. Build minimal kernel:
   - No modules
   - Only virtio + serial
2. Create rootfs with minimal init.
3. Launch Firecracker process.
4. Configure via REST API:
   - Kernel path
   - Block device
   - Network interface
   - Memory / vCPU
5. Start VM via API.
6. Measure:
   - Boot latency
   - Memory (pmap)
   - fio + iperf3

Compute budget:  
Single bare-metal host sufficient for experimentation.


## Open Questions / Next Actions

- Can MicroVMs support accelerators (GPU, NPU) efficiently?
- Can we integrate memory deduplication safely under side-channel constraints?
- Could this architecture support hardware enclaves (SGX / SEV)?
- Is VM-per-request feasible for ultra-low-latency serverless?
- How would Firecracker integrate with edge computing nodes?

For my own interest:
- Could microVM-style isolation benefit multi-tenant ML inference clusters?
- Could we design NPU workloads around microVM-level tenancy?

## Glossary

**MicroVM** — Minimal VM optimized for fast startup and low overhead.

**VMM** — Virtual Machine Monitor; manages guest execution.

**KVM** — Kernel-based Virtual Machine; Linux virtualization infrastructure.

**Soft Allocation** — Oversubscription strategy where resources are allocated statistically.

**TCB (Trusted Computing Base)** — Components that must be trusted for security.

**SMT** — Simultaneous MultiThreading (HyperThreading).

**virtio** — Standardized virtual device interface for hypervisors.


## Personal Takeaway
This paper is important because it proves the feasibility of providing VM-level isolation with container-level performance overhead. As a cloud application developer, I fully understand the difficulty of balancing service scalability and application security. Unlike prior approaches that rely on formal verification to argue correctness, this paper adopts an engineering-driven enforcement model. By moving the trust boundary beyond the guest kernel, Firecracker limits faults or compromises to a single MicroVM and prevents cross-tenant impact. However, this design assumes that the host operating system kernel and hardware virtualization mechanisms are trusted; therefore, vulnerabilities in the host kernel or KVM could still damage the whole system. A question I would like to discuss is: Compared to systems like Singularity or seL4, does Firecracker represent a compromise on security for scalability, or a more realistic path for production cloud systems? Rate 4.5/5