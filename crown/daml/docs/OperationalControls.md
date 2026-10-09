# Operational controls and governance

## 1. Why controls matter
The repo lifecycle depends on operational controls that are not exclusively enforced by legal forms or UI screens. The Daml ledger must protect the integrity of the workflow by enforcing controllers, signatories, and explicit state transitions.

## 2. Control themes
### Authorization
- Only the designated party or authorized agent can exercise a workflow choice.
- The application backend must validate that the submitting identity is entitled to act for the party it represents.

### Evidence quality
- Settlement evidence must include a source system identifier and a verifiable external reference.
- The Daml contract should retain a digest or other pointer to the actual external artifact.

### Reconciliation and exceptions
- Settlement failures, stale valuations, late margin submissions, or disputed proofs must not silently overwrite valid state.
- The system should create explicit follow-up states rather than forcing a false success state.

### Auditability
- Observers and audit roles should only receive the information necessary to review or reconstruct a workflow.
- Evidence references should be sufficient to recreate the operational story without exposing unrelated trade details.

## 3. Minimum governance checks
Before accepting a repo or creating downstream actions, the application should check:
- counterparty authorization
- trade validity and term consistency
- eligibility and haircut policy
- asset and cash settlement conventions
- duplicate request prevention
- evidence freshness and integrity

## 4. Operational workflow expectations
1. Trade is proposed.
2. Counterparty accepts and the agreement is activated.
3. Required collateral and valuation information are verified.
4. Settlement instruction is created.
5. External settlement evidence is recorded.
6. Lifecycle status advances to active or closed only after evidence passes.

## 5. Risks if controls are weak
- Duplicate settlement instructions
- Hidden margin or collateral under-coverage
- Acceptance of stale valuation evidence
- Counterparty actions executed without valid authority
- Incomplete audit trails in default or termination events

## 6. Design recommendation
The recommended first release keeps the model simple: enforce legal lifecycle and evidence flow in Daml, and leave market-specific settlement execution to adapter boundaries and external systems.
