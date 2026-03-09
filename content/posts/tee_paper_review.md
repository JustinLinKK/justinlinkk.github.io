---
title: 'Paper Notes: SoK – TEE Design Choices'
date: 2026-02-25
permalink: /posts/2026/02/sok-tee-design-choices/
tags:
  - research-notes
  - confidential-computing
  - trusted-execution-environments
draft: false
paper:
  title: 'SoK: Understanding Design Choices and Pitfalls of Trusted Execution Environments'
  authors: 'Mengyuan Li, Yuheng Yang, Guoxing Chen, Mengjia Yan, Yinqian Zhang'
  venue: 'ACM Asia CCS, 2024'
  link: 'https://doi.org/10.1145/3634737.3644993'
---

## TL;DR (3 sentences max)
- This paper systematizes the design space of hardware-based server-side Trusted Execution Environments (TEEs).
- It proposes TRAF (TEE Runtime Architectural Framework) to analyze how TEEs split runtime resource management between the Trusted Computing Base (TCB) and the untrusted host OS.
- The key takeaway: most TEE vulnerabilities stem from how runtime management tasks (CPU, memory, I/O) are divided across trust boundaries, especially when using unprotected or partially guarded modes.

## Bibliographic Snapshot
| Field | Detail |
| --- | --- |
| Citation | Li et al., ASIA CCS 2024 |
| Keywords | TEE, Confidential Computing, SGX, SEV, TDX, TRAF |
| Platforms Covered | Intel SGX/TDX, AMD SEV/SEV-ES/SEV-SNP, ARM CCA, IBM PEF, Keystone, Penglai, CURE |
| Code / Repo | N/A (SoK paper) |

## Problem Statement
Server-side TEEs enable secure remote execution (SRE) in cloud environments, protecting confidentiality and integrity of workloads against a malicious cloud provider. However, modern TEEs vary significantly in design choices (e.g., SGX vs. SEV vs. TDX), making it difficult to reason systematically about security trade-offs. The central question the paper tackles:

> How can TEE designs safeguard resources used by TEE instances while still allowing an untrusted OS to manage computing resources efficiently?

The threat model assumes a privileged adversary controlling the host OS and possibly with physical access, but typically excludes availability attacks and most side channels.

## Core Idea

### 1. TRAF (TEE Runtime Architectural Framework)

TRAF decomposes TEE runtime into OS-style resource management tasks:

- **CPU management**
  - Scheduling
  - Context switching
  - Interrupt & instruction emulation
- **Memory management**
  - Virtual memory
  - Physical allocation
  - Page fault handling
  - Memory encryption
- **I/O management**
  - Data transmission
  - I/O operations

For each task, TEEs choose one of four protection modes:

### 2. Four Runtime Protection Modes

1. **Unprotected Mode**
   - Host OS fully manages resource.
   - Best performance, largest attack surface.
   - Example: CPU scheduling in most TEEs.

2. **RTPM-only Mode**
   - Managed entirely by Runtime Protection Module (Manufacturer TCB).
   - Strong security, larger TCB, potential performance cost.
   - Example: Context switch in SEV-SNP, TDX.

3. **RTPM-guarded Mode**
   - Host performs management; RTPM verifies correctness.
   - Balance between security and efficiency.
   - Example: Memory allocation in SEV-SNP.

4. **Instance-assisted Mode**
   - TEE instance participates in resource management.
   - Used for virtual memory (e.g., Keystone page handling).
   - Improves isolation but increases complexity.

---

## Visual / Diagram Notes

### Figure 3 (Runtime Events)
Shows how TEE instances interact with:
- CPU scheduling & context switching
- Page table updates & page faults
- I/O data paths via shared memory

This makes clear that TEEs are fundamentally about *re-partitioning OS responsibilities across trust boundaries*.

### Figure 4 (Four Modes)
Graphical depiction of:
- Privileged SW
- RTPM
- TEE Instance
- Runtime resources

It clarifies who controls what in each mode — extremely useful mental model.

### Figure 5 (Timeline of Design Choices)
Shows evolution from:
- SEV (weak protection)
- SEV-ES
- SEV-SNP (stronger RTPM-only transitions)
- TDX, ARM CCA

Bug icons highlight where design flaws were later exploited.

Trend:
→ Newer TEEs increasingly shift critical operations into RTPM-only mode after real-world attacks.

---

## Key Results

### 1. Most TEEs follow similar patterns
- CPU scheduling → Unprotected mode
- Context switch → RTPM-only
- Memory allocation → RTPM-guarded
- I/O → Mostly unprotected

### 2. Vulnerabilities Cluster Around:
- Nested Page Tables (NPT) in SEV
- TLB handling
- Instruction emulation (e.g., CPUID spoofing)
- Unencrypted register state in early SEV

### 3. Case Study: AMD SEV Evolution

| Version | Weakness | Fix |
|----------|----------|------|
| SEV | Unencrypted registers | SEV-ES encrypts register state |
| SEV-ES | TLB poisoning | SEV-SNP adds hardware-enforced TLB protection |
| SEV-SNP | CPUID filtering & RMP checks | Stronger integrity enforcement |

Big insight:
SEV’s early designs relied heavily on **unprotected or weakly guarded modes**, which directly enabled attacks like:
- SEVered (NPT remapping)
- TLB poisoning
- Ciphertext side channels

---

## Personal Analysis

### What worked
- TRAF is a clean abstraction layer. It feels like an OS textbook classification applied to confidential computing.
- The CPU/Memory/I/O breakdown is pedagogically powerful.
- The SEV case study shows concrete evolution under attack pressure — great for understanding real-world design iteration.

### What puzzled me
- TRAF does not deeply model microarchitectural side channels, even though they dominate practical attacks.
- TCB size comparison remains qualitative due to proprietary vendor implementations.

---

## Connections & Related Work

- Connects directly to:
  - SGX Explained (Costan & Devadas)
  - SEVered (Morbitzer et al.)
  - SEV-SNP whitepapers
  - Controlled-channel attacks (Xu et al.)
  - Spectre/Meltdown class attacks

- Conceptually related to:
  - Microkernel vs monolithic kernel trust partitioning
  - Virtualization security models
  - Formal SRE definitions (Subramanyan et al.)

---

## Implementation Sketch

If reproducing a research prototype inspired by this:

1. Choose platform:
   - SGX (process-based)
   - SEV-SNP (VM-based)
   - Keystone (RISC-V)

2. Map runtime tasks:
   - Which are unprotected?
   - Which use guarded checks?

3. Evaluate:
   - TCB size
   - Privilege transitions
   - Page fault latency
   - Interrupt handling path

4. Attack surface evaluation:
   - Can OS manipulate PTE?
   - Can ASID/TLB be misused?
   - Is instruction emulation trusted?

---

## Open Questions / Next Actions

- Can we formally verify correct coordination in RTPM-guarded mode?
- What is the minimal TCB architecture for VM-based TEEs?
- Can we eliminate controlled-channel attacks without massive performance cost?
- How does TRAF extend to accelerator-attached TEEs (e.g., GPU confidential computing)?

---

## Glossary

**TEE** – Trusted Execution Environment  
**TCB** – Trusted Computing Base  
**RTPM** – Runtime Protection Module (Manufacturer TCB component)  
**NPT** – Nested Page Table  
**ASID** – Address Space Identifier  
**Controlled-channel attack** – Attack exploiting OS-controlled resources (e.g., page faults, interrupts)  
**SRE** – Secure Remote Execution  
