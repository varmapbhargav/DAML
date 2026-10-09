# Workflow diagrams and contract relationships

This document summarizes the primary flow and relationship diagrams for the CROWN DAML model.

## 1. Repo lifecycle overview

```mermaid
stateDiagram-v2
    [*] --> Proposed
    Proposed --> Accepted: counterparty accepts
    Proposed --> Rejected: counterparty rejects
    Proposed --> Cancelled: proposer cancels
    Accepted --> Active: opening settlement confirmed
    Active --> MaturityPending: maturity reached
    Active --> TerminationPending: early termination
    Active --> DefaultWorkflow: default event
    MaturityPending --> Closed: final evidence validated
    TerminationPending --> Closed: termination record approved
    DefaultWorkflow --> Closed: recovery action completed
    Closed --> [*]
```

The lifecycle is intentionally represented as a sequence of contracts and evidence-based transitions, not as a single mutable record with arbitrary strings.

---

## 2. Settlement evidence workflow

```mermaid
sequenceDiagram
    participant A as Borrower
    participant P as Cash Provider
    participant W as Workflow Service
    participant S as Settlement Adapter
    participant E as External Settlement Rail

    A->>W: Request opening settlement
    W->>S: Create SettlementInstruction
    S->>E: Submit instruction
    E-->>S: Acknowledge / pending
    S-->>W: Final status / evidence
    W->>A: Record SettlementEvidence
    W->>P: Record SettlementEvidence
    A->>W: Confirm agreement state advance
    P->>W: Confirm agreement state advance
```

This sequence keeps the instruction and evidence models separate so the bank can distinguish a request from verified completion.

---

## 3. Collateral and margin flow

```mermaid
flowchart LR
    REPO[RepoAgreement] --> COLL[CollateralAllocation]
    COLL --> VAL[ValuationSnapshot]
    VAL --> MRG[MarginCall]
    MRG --> DISPUTE[Dispute or satisfaction]
    DISPUTE --> RESOLVE[Margin resolved]
    COLL --> RELEASE[Release or substitution]
```

Business meaning:
- collateral is allocated against the repo agreement
- valuation determines sufficiency or deficiency
- margin call arises when risk coverage is insufficient
- dispute and satisfaction bring the event back to a controlled state

---

## 4. Contract relationship map

```mermaid
erDiagram
    REPO_PROPOSAL ||--o| REPO_AGREEMENT : accepted_as
    REPO_AGREEMENT ||--o{ SETTLEMENT_INSTRUCTION : settles_through
    SETTLEMENT_INSTRUCTION ||--o{ SETTLEMENT_EVIDENCE : evidenced_by
    REPO_AGREEMENT ||--o| MATURITY_OBLIGATION : matures_into
    REPO_AGREEMENT ||--o| TERMINATION_RECORD : closes_with
    REPO_AGREEMENT ||--o{ COLLATERAL_ALLOCATION : secured_by
    REPO_AGREEMENT ||--o{ VALUATION_SNAPSHOT : revalued_by
    REPO_AGREEMENT ||--o{ MARGIN_CALL : may_trigger
```

This ER diagram shows the intended relationship model and clarifies that the ledger is built from contracts and links rather than a single central table.

---

## 5. Product extension map

```mermaid
flowchart TD
    CORE[Core Repo Model]
    TRIP[Tri-Party Repo]
    LEND[Sec Lending]
    BUY[Buy/Sell-Back]
    CLEAR[Clearing]
    CORE --> TRIP
    CORE --> LEND
    CORE --> BUY
    CORE --> CLEAR
```

The common core can be reused across multiple secured-funding products while preserving distinct legal and operational rules for each extension.

---

## 6. Control-plane relationship

```mermaid
flowchart LR
    TRADE[Trade / Repo Agreement]
    CTRL[Governance + Compliance + Identity]
    OPS[Adapter / Interface]
    EVIDENCE[External Evidence]

    TRADE --> CTRL
    CTRL --> OPS
    OPS --> EVIDENCE
    EVIDENCE --> TRADE
```

This shows the control plane around the trade: governance and identity feed approval, interface adapters generate operational evidence, and the trade itself only accepts externally validated outcomes.
