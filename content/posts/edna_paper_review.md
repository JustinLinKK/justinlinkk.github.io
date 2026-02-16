---
title: "Paper Notes: Edna — Disguising and Revealing User Data in Web Applications"
date: 2026-02-11
permalink: /posts/2026/02/edna-sosp23/
tags:
  - research-notes
  - systems
  - privacy
  - security
  - databases
draft: false
paper:
  title: "Edna: Disguising and Revealing User Data in Web Applications"
  authors: "Lillian Tsai, Hannah Gross, M. Frans Kaashoek, Eddie Kohler, Malte Schwarzkopf"
  venue: "SOSP 2023"
  link: "https://pdos.csail.mit.edu/papers/edna:sosp23.pdf"
---

> Full paper reference: :[Edna: Disguising and Revealing User Data in Web Applications](https://pdos.csail.mit.edu/papers/edna:sosp23.pdf)

---

## TL;DR (3 sentences max)

- Edna enables web applications to support **reversible, composable user data removal and anonymization** without breaking referential integrity.
- It introduces three primitives—**remove, modify, decorrelate**—implemented using encrypted diff records and pseudoprincipals.
- The key insight is that privacy-preserving transformations can be made reversible and practical with modest overhead and minimal developer effort.

---

## Bibliographic Snapshot

| Field | Detail |
|-------|--------|
| Citation | Tsai et al., SOSP 2023 |
| Keywords | Data anonymization, encryption, GDPR, referential integrity, web applications |
| Implementation | 7.9k LoC Rust prototype |
| DB Assumption | MySQL + relational ownership model |
| Case Studies | Lobsters, WebSubmit, HotCRP |

---

## Problem Statement

Modern privacy regulations (e.g., GDPR) mandate data deletion, but users often want **more nuanced controls**:

- Temporarily deactivate accounts
- Anonymize past contributions
- Dissociate identity from old data
- Return later and restore data

However, implementing this is difficult because:

1. Deleting data breaks referential integrity.
2. Shared data complicates ownership.
3. Multiple transformations must compose cleanly.
4. Revealing must avoid overwriting concurrent changes.
5. Sensitive data must be inaccessible even if the DB is compromised.

Edna addresses this by designing reversible transformations that preserve application functionality.

---

## Core Idea

### Two Transformations

- **Disguising** → Makes user data inaccessible.
- **Revealing** → Restores disguised data upon request.

---

### Three Primitives

1. **Remove**  
   Delete data rows.

2. **Modify**  
   Replace content with placeholder values.

3. **Decorrelate**  
   Replace user ownership links with *pseudoprincipals*.

These primitives are expressive but restricted to avoid developer mistakes.

---

### Pseudoprincipals

A key innovation.

When decorrelating data:

- Edna creates placeholder users (pseudoprincipals).
- Referential integrity is preserved.
- Data remains structurally valid.
- Ownership becomes unlinkable.

Each pseudoprincipal:
- Has its own keypair.
- Is linked to the original user via encrypted **speaks-for records**.

This allows:
- Clean composition of transformations.
- Reversible anonymization.
- No dangling references.

---

### Storage Design

Disguised data is stored as:

- **Diff records** — original values needed for restoration.
- **Speaks-for records** — ownership mappings.
- Encrypted using x25519 ephemeral key exchange.
- Indexed via encrypted indirection tables.

Security guarantees:

- Confidentiality of disguised data.
- Confidentiality of which disguised data belongs to which user.
- Reduced linkability via pseudoprincipals.

---

## Reveal Algorithm

Reveal proceeds as:

1. Reconstruct private key (via password-based Shamir secret sharing).
2. Decrypt disguise records.
3. Restore removed rows.
4. Undo modifications.
5. Recorrelate pseudoprincipals.
6. Enforce consistency checks:
   - No uniqueness violations.
   - No overwritten concurrent updates.
   - Referential integrity preserved.

Reveal operations can happen **in any order** due to speaks-for chains.

---

## Composability

Edna supports:

- Remove after decorrelate
- Decorrelate after decorrelate
- Multiple anonymizations
- Out-of-order reveals

Key mechanism:
- Encrypted **speaks-for chains**
- Recursive reveal traversal

Latency grows roughly linearly with number of pseudoprincipals (~1ms per pseudoprincipal).

---

## Evaluation Highlights

### Developer Effort

~1 person-day per application.

Spec sizes:
- Lobsters: 518 LoC
- WebSubmit: 75 LoC
- HotCRP: 357 LoC

Minimal modifications required.

---

### Performance

Common operations:
- No noticeable overhead.

Disguising:
- 13–85 ms typical.

Revealing:
- 13–80 ms typical.

Heavy global anonymization:
- Several seconds (acceptable for background jobs).

Throughput impact:
- ≤7% in common case.
- ≤17% worst-case under heavy load.

Space overhead:
- ~11% DB size increase when 10% users removed accounts.

---

## Comparison to Alternatives

| System | What It Does | What It Lacks |
|---------|--------------|--------------|
| Manual SQL | Simple deletion | No reveal, no composition |
| Qapla | Access control policies | Complex reasoning, no reversible transformation |
| CryptDB | Encrypted storage | No anonymization or reversible removal |
| Decentralized storage (e.g., Solid) | User-owned data | No server-side functionality |

Edna is the first to provide:
**Reversible + composable + integrity-preserving transformations.**

---

## Security Model

Protected:

- Disguised data contents.
- Mapping from user to disguised data.
- Linkability between decorrelated records.

Not protected:

- Metadata size leakage.
- Existence of pseudoprincipals.
- Undisguised data.
- Post-compromise user-provided credentials.

Threat model assumes:
- Secure cryptography.
- Secure user private keys.
- No malicious misuse of reveal credentials.

---

## Strengths

- Elegant abstraction.
- Practical integration.
- Clean compositional semantics.
- Strong real-world validation.
- Low performance overhead.

---

## Limitations

- Metadata leakage possible.
- No protection against multi-service data sharing.
- Assumes correct disguise specifications.
- Does not protect undisguised data.
- Limited to relational DB ownership models.

---

## Implementation Notes

Requirements:

- MySQL
- Direct foreign-key ownership model
- Unique row identifiers

Crypto:

- x25519 ECDH
- PBKDF2
- Shamir Secret Sharing
- Encrypted indexing

Concurrency:

- Serializable transactions
- Optional background transformations

---

## Connections to Other Work

Related to:

- Crypto shredding
- Information flow control
- Capability systems (speaks-for chains)
- Policy enforcement (Qapla)
- Encrypted DB systems (CryptDB)

Orthogonal to:

- Full encrypted databases
- Pure access-control systems

---

## Open Questions

- Can disguise specifications be formally verified?
- Can metadata leakage be reduced?
- How would this integrate with:
  - LLM SaaS systems?
  - OSINT graph pipelines?
  - Multi-tenant cloud platforms?
- Can pseudoprincipals be obfuscated further?

---

## Glossary

- **Disguising** — Transform data to make it inaccessible.
- **Revealing** — Restore disguised data.
- **Pseudoprincipal** — Placeholder user created during decorrelation.
- **Speaks-for record** — Encrypted ownership mapping.
- **Diff record** — Encrypted restoration data.
- **Crypto shredding** — Deleting key material instead of plaintext.

---

### Personal Takeaway
In my previous experience of web design, soft deletion is an important constraint for modern web system design.  Traditional soft deletion preserves referential integrity and recoverability, but leaves plaintext data intact and fully exposed under database compromise. Edna allows applications to preserve structural consistency while making disguised data inaccessible. However, while it removes explicit ownership links and encrypts disguised data, it does not eliminate the risk of statistical analysis. Attackers may still use the residual information, and correlate behavioral patterns, activity timestamps, or structural signals with pseudo-principals to derive some sensitive records like account relations. Additionally, the system’s correctness fully depends on developer-defined JSON disguise specifications.  If a developer omits a table or writes an incomplete predicate, sensitive data may remain undisguised without detection. A question I would like to leave is, how should we manage the synchronization between current database and backup database with Edna since backup data may still visible. Rate 5/5
