# Copilot Merge Prompt

```text
Act as the senior documentation architect for the TradeEvidence repository.

I am adding a documentation package that records an approved decision to adopt AWS AI-DLC selectively and introduces the engineering-governance layer for the next phase of TradeEvidence.

PRIMARY OBJECTIVE

Merge the supplied files into the existing TradeEvidence Product Handbook without changing approved product philosophy or creating duplicate sources of truth.

APPROVED DECISION

TradeEvidence will use AI-DLC wherever the Chief Software Architect determines that it materially improves discovery, architecture, planning, implementation, testing, security, documentation, operations, or learning.

Adoption is selective and risk-based.

AI accelerates execution. Humans retain authority and accountability.

AI-DLC does not replace product strategy, architecture ownership, engineering accountability, security approval, release authority, or financial-domain safety boundaries.

REQUIRED ACTIONS

1. Inspect the current documentation hierarchy before editing.
2. Preserve all approved decisions and historical workshop notes.
3. Add the supplied files in the best existing folders; normalize paths only if needed.
4. Add a concise AI-DLC adoption entry to Product-Decision-Log.md and link ADR-001.
5. Update README.md so the new governance and engineering documents are easy to find.
6. Update Source-of-Truth.md to identify the AI-DLC Adoption Policy, Engineering Lifecycle, ADRs, and Engineering Specification Index as authoritative for their defined purposes.
7. Update Canonical-Terminology.md with AI-DLC, Engineering Lifecycle, Phase Gate, AI-DLC Level, and ADR.
8. Add an Engineering Architecture phase to the roadmap: Master System Architecture; MVP Implementation Specification; MVP Data Schema; API Contracts; Frontend and Backend Architecture; Evidence Engine and AI Workflow; Delivery Readiness; First Vertical Slice.
9. Clearly distinguish product AI from development AI.
10. Add repository-relative cross-references.
11. Do not duplicate the full ADR rationale in Product-Decision-Log.md.
12. Do not describe AI-DLC as an autonomous authority.
13. Do not bind the architecture permanently to AWS, Kiro, Amazon Q, GitHub Copilot, or any single model.
14. Do not invent undecided implementation details.
15. Preserve standard Markdown.

DOCUMENT STATUS

The AI-DLC adoption decision and governance documents are Approved. The Engineering Specification Index and Architecture Workshop Plan are Approved plans. Specifications named in the index are not complete unless they already exist.

QUALITY REVIEW

After merging, detect duplicates and contradictions, verify links and README navigation, preserve human approval for material decisions, and keep MVP and future scope separate.

FINAL RESPONSE

Provide an Integration Report with files added, files updated, files renamed or moved, duplicate material merged, contradictions resolved, unresolved questions, broken links or missing documents, a recommended commit message, and readiness for Architecture Workshop 1.

Do not implement product code.
```
