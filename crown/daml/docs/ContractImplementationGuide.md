# Contract implementation guide

## 1. Design principles for Daml implementation
- Model the ledger truth as contracts and state transitions.
- Keep core domain types in a shared module.
- Separate the contractual state from external system evidence.
- Restrict controllers and observers to the minimum required business parties.

## 2. Recommended module layout
- Types: shared enums and records
- Repo: agreement, proposal and lifecycle templates
- Settlement: instruction and evidence templates
- Lifecycle: maturity and termination templates
- Collateral: allocation and substitution logic
- Valuation: market value and pricing metadata
- Margin: risk and dispute workflow
- TriParty: allocation and agency logic
- ReferenceData: policy metadata

## 3. Common implementation patterns
### Template checks
Use `ensure` clauses and `assertMsg` checks for invariants such as:
- positive principal and repurchase amount
- valid trade date range
- required evidence before closure
- duplicate operation prevention or idempotency keys

### State transitions
Instead of mutating an existing template in place, create a new contract instance or archive the old one when a state change is approved.

### Evidence references
Keep references to external evidence lightweight. Store a digest, source, and unique external reference rather than the full payload in ledger contracts.

## 4. Execution pattern
1. Create a proposal.
2. Counterparty accepts or rejects.
3. Settlement instruction is created.
4. Adapter submits external evidence.
5. Agreement transitions to active or closed based on valid evidence.

## 5. Expected first milestone
The first production-quality milestone is a bilateral repo lifecycle with:
- valid proposal and acceptance pattern
- confirmation of settlement evidence
- active state progression
- maturity close-out and termination record
- clear test coverage for normal and failed paths
