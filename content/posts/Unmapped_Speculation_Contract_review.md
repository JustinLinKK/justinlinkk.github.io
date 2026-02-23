---
title: 'Paper Notes: Efficiently Mitigating Transient Execution Attacks using the Unmapped Speculation Contract'
date: 2026-02-18
permalink: /posts/2026/02/usc-ward-osdi20/
tags:
  - research-notes
  - operating-systems
  - security
  - transient-execution
  - OSDI
draft: true
paper:
  title: 'Efficiently Mitigating Transient Execution Attacks using the Unmapped Speculation Contract'
  authors: 'Jonathan Behrens, Anton Cao, Cel Skeggs, Adam Belay, M. Frans Kaashoek, Nickolai Zeldovich'
  venue: 'OSDI 2020'
  link: 'https://www.usenix.org/conference/osdi20/presentation/behrens'
---

## TL;DR (3 sentences max)

- This paper proposes the *Unmapped Speculation Contract (USC)*, which states that memory not mapped in the current page table cannot be accessed through speculative execution.
- Based on USC, the authors design **WARD**, a kernel architecture that selectively maps only non-sensitive kernel memory for each process, eliminating many transient execution mitigations on common system calls.
- WARD significantly reduces mitigation overhead: 18/30 LEBench microbenchmarks run within 5% of an unmitigated baseline, compared to substantial slowdowns under Linux-style mitigations.

---

## Bibliographic Snapshot

| Field | Detail |
| --- | --- |
| Citation | `Behrens et al., OSDI 2020` |
| Keywords | transient execution, Spectre, Meltdown, kernel isolation, page tables, microarchitecture |
| Dataset / Benchmarks | LEBench |
| Code / Repo | https://github.com/mit-pdos/ward |

---

## Problem Statement

Transient execution attacks (e.g., Spectre, Meltdown, MDS) allow adversaries to leak sensitive data via speculative execution side effects. Modern OS kernels mitigate these attacks using techniques such as KPTI, retpoline, speculation barriers, and buffer flushing. However, these mitigations incur significant overhead—especially at privilege boundary crossings (e.g., system calls and context switches).

The central challenge:  
**How can we reduce the performance overhead of transient execution mitigations without sacrificing security?**

The threat model assumes mutually distrusting processes running on the same machine (e.g., cloud tenants), where a malicious process may attempt to leak kernel or cross-process memory via speculative side channels.

---

## Core Idea

### 1. The Unmapped Speculation Contract (USC)

The key observation:

> **If physical memory is not mapped in the current page table, speculative execution cannot access it.**

USC formalizes this into a hardware/software contract:

If two states have:
- identical CPU microarchitectural state  
- identical contents of mapped memory  

Then speculative execution must evolve identically — even if unmapped physical memory differs.

In short:

**Speculation may depend only on mapped memory and current CPU state — never on unmapped memory.**

Modern CPUs (AMD explicitly; Intel via microcode fixes) already approximately satisfy this property.

---

### 2. WARD: Kernel Architecture Based on USC

WARD leverages USC by restructuring kernel memory mappings.

Each process maintains **two kernel page tables**:

#### Q Domain (Quasi-visible domain)
- Maps:
  - Kernel text (no mitigations)
  - Public kernel data
  - Process-specific non-sensitive data
- Does **NOT** map:
  - Other processes’ data
  - Global secrets
- Runs without most transient execution mitigations.

#### K Domain (Kernel domain)
- Maps all physical memory.
- Runs with full Linux-style mitigations.

System calls begin in the **Q domain**.  
If sensitive data is needed, WARD performs a **world switch** to the K domain.

This avoids mitigation overhead for many common system calls.

---

## Key Design Mechanisms

### World Switch

A transition from Q → K domain:

- Switch page table
- Switch stack (copy Q stack → K stack)
- Enable mitigations
- Resume execution seamlessly

Two modes:
- **Intentional**: explicit `kswitch()`
- **Transparent**: triggered by page fault

Transparent switching allows unmodified kernel code to work.

---

### Kernel Text Dual Mapping

WARD:
- Compiles kernel once (with mitigations)
- Makes two runtime copies:
  - K domain: full mitigations
  - Q domain: retpolines patched out
- Maintains identical virtual addresses for seamless switching

---

### Data Structure Partitioning

To avoid mapping secrets:

- `struct proc` split into:
  - Public metadata (PID, scheduler state)
  - Private sensitive state (registers)
- Inodes made public (unless containing sensitive metadata)
- File data temporarily mapped into Q domain when needed
- Per-Q-domain memory allocator shards

---

## Evaluation

### Experimental Setup

Three configurations:
1. **Baseline** – No mitigations
2. **Linux-style** – Full mitigations everywhere
3. **USC-based (WARD)** – Q/K domain split

Benchmark: **LEBench**

---

### LEBench Results

- 18/30 microbenchmarks: ≤ 5% overhead vs unmitigated baseline
- Linux-style mitigations: median 19% overhead
- Worst case:
  - WARD: 4.3× (context switching)
  - Linux-style: nearly 7×

Many syscalls (e.g., `getpid`, small `mmap`, small `read/write`) execute entirely in Q domain — zero world switches.

---

### Application-Level Result

`git status` benchmark:
- Linux-style mitigations: +24.6% overhead
- USC-based WARD: +11.2% overhead

Improvement mainly from eliminating mitigation overhead on frequent metadata syscalls (e.g., `lstat`).

---

### World Switch Cost

Measured costs:

- Intentional world switch: ~644 cycles + stack copy cost
- Transparent world switch (via page fault): ~1372 cycles

Mitigation overhead is dominated by world switches.

---

## Security Coverage

WARD mitigates:

- Spectre V1/V2
- Meltdown
- MDS (Fallout, RIDL, ZombieLoad)
- SpectreRSB
- LazyFPU
- L1TF

USC specifically protects against:
- Attacks that leak *mapped memory contents*

Not covered by USC:
- Leaks of CPU internal state (e.g., MSRs)
- Core/uncore-only leaks (e.g., CrossTalk)
- Non-transient side channels

WARD applies Linux-style mitigations for these.

---

## Memory Overhead

Additional memory cost includes:

- Duplicate kernel text (~2 MB)
- Separate per-process stacks (32 KB/thread)
- Split data structures
- Extra page tables
- Public page allocations padded to page boundaries

Trade-off:  
Security + performance vs modest memory overhead.

---

## Strengths

- Clear hardware/software contract
- Minimal performance overhead for common syscalls
- Transparent switching via page faults
- Real implementation in sv6
- Demonstrates feasibility for monolithic kernels

---

## Limitations

1. Does not protect:
   - Secrets already in CPU microarchitectural state
2. Kernel ASLR difficult to protect
3. Increased memory overhead
4. Significant kernel refactoring required
5. Hyperthreading leakage still possible (like Linux)

---

## Big Picture Insight

This paper reframes the mitigation problem:

Instead of asking:

> How do we prevent speculative execution from leaking secrets?

It asks:

> What if secrets simply are not mapped during speculative execution?

By pushing isolation into page tables and formalizing it via USC, WARD turns speculative execution from a global liability into a controllable mechanism.

This is a powerful systems insight:  
**Use virtual memory as a speculation boundary.**

---

## Personal Reflection

WARD is conceptually elegant because it leverages an existing architectural abstraction (page tables) instead of fighting speculation with ever-growing fences and flushes.

From a systems architecture perspective, this resembles:
- Hardware/software contracts in memory consistency
- Capability-based isolation
- Microkernel-style compartmentalization — but within a monolithic kernel

It suggests a broader lesson:

> Performance-sensitive security mechanisms often benefit from *restructuring invariants*, not adding patches.


