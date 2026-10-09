# Business requirements for CROWN

## 1. Product objective
CROWN is a repo and secured-funding workflow platform for institutional market participants. The product captures repo agreements, collateral eligibility, settlement evidence, maturity obligations, and operational controls in a shared Daml ledger model.

## 2. Business stakeholders
- Cash borrower / dealer
- Cash provider / investor
- Tri-party agent
- Custodian / settlement agent
- Compliance and risk operations
- Internal application operator and audit function

## 3. Core business requirements
### 3.1 Trade capture and agreement lifecycle
- A repo proposal must be created by one party and accepted by the counterparty before it becomes legally binding.
- Proposals must include trade terms that are internally valid and governance-approved.
- The agreement must be able to transition through proposed, accepted, active, maturity, and closed states in a controlled manner.

### 3.2 Collateral and valuation controls
- Collateral must be mapped to an eligible asset class and valuation convention.
- Haircut, concentration, and asset-domicile rules must be explicit.
- Price freshness and evidence provenance must be recorded.

### 3.3 Settlement integrity
- Settlement instructions are distinct from final settlement evidence.
- A settlement instruction only becomes accepted as executed when external evidence is recorded.
- The system must support retries, failure and reconciliation states without conflating them with a successful close-out.

### 3.4 Maturity and termination
- Maturity obligations must be generated from active repo agreements.
- Close-out settlement must be evidenced before the repo is closed.
- Early termination must be driven by authorized workflow and supporting evidence.

### 3.5 Controls and auditability
- Each material action must be attributable to a party or designated workflow role.
- Evidence references must include source system, timestamp, and a digest or reference to externally stored proof.
- Operational and compliance users must be able to identify the basis for a decision without exposing unrelated confidential data.

## 4. Non-functional requirements
- Privacy by design: only relevant parties receive visibility into relevant contracts.
- Idempotency: settlement and lifecycle actions must be protected from duplicate submission.
- Traceability: every workflow step must retain enough evidence for audit and reconciliation.
- Determinism: arithmetic and lifecycle state transitions must be comprehensible and reproducible.

## 5. Requirement-to-contract mapping
| Business requirement | Daml contract domain |
|---|---|
| Trade proposal and acceptance | RepoProposal, RepoAgreement |
| Settlement request and confirmation | SettlementInstruction, SettlementEvidence |
| Value and exposure controls | ValuationSnapshot, CollateralAllocation |
| Margin disputes and satisfaction | MarginCall |
| Maturity obligations | MaturityObligation |
| Close-out evidence | TerminationRecord |
| Agent-based collateral management | AgentMandate, AllocationRequest |
| Clearing and market submission | ClearingSubmission |

## 6. Acceptance criteria
- A valid repo proposal can be accepted by the counterparty only under permitted conditions.
- Opening settlement can be requested and confirmed using evidence traceability.
- Closing settlement generates a maturity or termination record before closure.
- Margin and collateral events preserve state and evidence history.
- Operational controls provide a clear audit trail without permitting unrestricted visibility.
