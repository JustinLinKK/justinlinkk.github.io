---
title: "Consent-Based LLM-OSINT Pipeline"
date: 2026-03-05
excerpt: "An end-to-end agentic pipeline that compiles structured, citation-grounded person profiles from public data using LLMs, MCP tooling, and graph-based normalization<br/><img src='/images/projects/llm-osint/cover.jpg'>"
collection: projects
---

# Project Title: Consent-Based LLM-OSINT Pipeline

## Project Overview
This project presents an **end-to-end agentic LLM system** for open-source intelligence (OSINT) that automatically compiles structured, citation-grounded person profiles from **public data using only a name as input**.  

- **Detailed Wiki:** [DeepWiki Overview](https://deepwiki.com/JustinLinKK/llm-osint/1-overview)
- **Paper Draft:** [Download PDF](/files/llm-osint-paper.pdf)

Unlike traditional OSINT tools that stop at data collection, this pipeline integrates **retrieval, reasoning, normalization, and synthesis** into a unified workflow. It introduces a **dual-retrieval architecture (vector + knowledge graph)** and a **graph-cleanup stage** to resolve identity ambiguity, deduplicate entities, and reduce contradictions.

The system is designed under a **consent-based framework**, positioning it as both:
- a **technical system for agentic information aggregation**, and  
- a **privacy-risk measurement instrument** for understanding how easily public data can be centralized into actionable profiles :contentReference[oaicite:0]{index=0}  

---

## Objectives
- **End-to-End Automation:** Build a fully automated pipeline from name → structured profile
- **Evidence-Grounded Output:** Ensure every claim is linked to verifiable sources
- **Structured Normalization:** Resolve identity ambiguity and conflicting data via graph reasoning
- **Scalable Agent System:** Use planner–worker architecture for iterative retrieval and refinement
- **Privacy-Aware Design:** Evaluate aggregation risk under a consent-based OSINT setting

---

## System Architecture
The pipeline is composed of **two major stages connected by a shared knowledge layer**:

### Stage 1 — Collection & Normalization
- Input analysis and identity anchoring
- Planner–worker agent loop for retrieval
- MCP-based tool orchestration (multi-source search)
- Artifact retention (MinIO-backed storage)
- Entity/relation extraction
- Graph construction and cleanup

### Knowledge Layer
- **Vector Index:** semantic retrieval over heterogeneous evidence  
- **Knowledge Graph (Neo4j):** structured entity relationships and conflict resolution  

### Stage 2 — Profile Synthesis
- Evidence retrieval from graph + vector store
- Structured report generation
- Claim verification and citation grounding
- Iterative refinement loop

This separation ensures **robustness, traceability, and auditability**, avoiding direct generation from raw noisy data :contentReference[oaicite:1]{index=1}  

---

## Key Technical Components

### 1. Agentic Planner–Worker Loop
- Decomposes OSINT into sub-tasks (identity → affiliations → publications → collaborators)
- Executes tools in parallel for efficiency
- Iteratively improves coverage via follow-up retrieval

### 2. MCP Tooling Layer
- Modular tool interface for:
  - Web search (multi-provider)
  - Academic profiles (Google Scholar)
  - Code identity (GitHub)
  - Organization & registry search
- Enables **high-signal, source-specific retrieval**

### 3. Artifact Retention System
- Stores:
  - raw tool outputs  
  - URLs, snippets, timestamps  
  - extracted candidates and provenance  
- Enables:
  - auditability  
  - contradiction tracing  
  - reproducibility  

### 4. Dual Storage (Vector + Graph)
- **Vector DB:** flexible semantic retrieval  
- **Knowledge Graph:** structured reasoning and entity resolution  

This hybrid design solves a key limitation:
> vector retrieval finds relevant text, but cannot resolve identity or contradictions reliably :contentReference[oaicite:2]{index=2}  

### 5. Graph Cleanup (Core Innovation)
- Alias resolution (merge identities)
- Type normalization (consistent schema)
- Relation deduplication
- Conflict arbitration (support-based scoring)

Transforms noisy data → **stable, canonical profile**

---

## Implementation Details
1. **Agent Orchestration:** LangGraph-based stateful workflow
2. **Tool Integration:** MCP protocol for extensible retrieval
3. **Storage:**
   - MinIO (artifact storage)
   - Vector DB (semantic search)
   - Neo4j (knowledge graph)
4. **Extraction Pipeline:**
   - Entity, attribute, relation candidates
   - High-recall design (defer deduplication)
5. **Synthesis:**
   - Retrieval-conditioned generation
   - Claim-level citation grounding
   - Verification loop before final output

---

## Evaluation & Results

### Performance Comparison
| Method | Accuracy | Coverage | Inconsistency |
|--------|--------|----------|--------------|
| Proposed Pipeline | 81% | 73% | 18% |
| Vector-only | 67% | 70% | 42% |
| Manual OSINT | 95% | 93% | 0% |

### Key Findings
- **Graph cleanup significantly reduces contradictions** (42% → 18%)
- Pipeline achieves strong coverage from **name-only input**
- Automated system produces **~24-page structured reports** per subject
- Major advantage: **aggregation speed and cross-source synthesis**

### Efficiency
- Pipeline runtime: ~1.5 hours  
- Manual OSINT: ~4.2 hours  

Automation shifts effort from **collection → verification**

---

## Challenges and Resolutions

### Identity Ambiguity
- Problem: multiple individuals with same name  
- Solution: target anchoring + graph-based disambiguation  

### Contradictory Data
- Problem: conflicting affiliations, publications, timelines  
- Solution: graph cleanup + support-based conflict arbitration  

### Weak Source Grounding
- Problem: incomplete citation coverage  
- Solution: evidence-packing + retrieval refinement loop  

### Privacy Constraints
- Problem: OSINT aggregation risk  
- Solution: consent-based design + public-data-only restriction  

---

## Outcomes
- **End-to-End OSINT Agent System** from name → structured report  
- **Graph-Driven Profile Construction** with reduced contradictions  
- **Auditable Evidence Pipeline** with full provenance tracking  
- **Demonstrated Privacy Insight:**  
  - Risk is not hidden data  
  - Risk is **low-cost aggregation of public data** :contentReference[oaicite:3]{index=3}  

---

## Future Plans
- **Tool Expansion:** integrate more public registries and domain-specific sources  
- **Improved Grounding:** increase citation recall and precision  
- **Scalability:** optimize planner scheduling and parallel tool execution  
- **Graph Learning:** explore LLM-assisted entity resolution and graph embeddings  
- **Privacy Controls:** encryption, selective retention, and user audit interfaces  

---

## Project Significance
This project demonstrates that modern LLM agents are not just language models, but **full-stack information systems** capable of:

- orchestrating retrieval workflows  
- structuring heterogeneous data  
- resolving contradictions  
- generating auditable knowledge artifacts  

It highlights a fundamental shift in OSINT:

> The challenge is no longer access to information —  
> but the ability to **organize and centralize it at scale**.

---