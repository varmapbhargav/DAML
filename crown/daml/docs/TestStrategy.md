# Test strategy for CROWN

## 1. Goal
The Daml package must validate the lifecycle, settlement, collateral, valuation and termination rules at the contract level. Test scenarios should cover both happy-path and exception flows.

## 2. Test categories
### Lifecycle tests
- proposal acceptance
- proposal rejection and cancellation
- opening settlement request and confirmation
- closing settlement and closure
- maturity obligation creation and reconciliation

### Settlement tests
- final evidence recorded by authorized settlement agent
- failed evidence does not advance the workflow
- stale or missing evidence halts lifecycle progression

### Collateral and valuation tests
- eligible collateral is accepted
- ineligible collateral is rejected or flagged
- stale valuation does not satisfy margin requirements
- concentration and haircut rules are enforced

### Margin tests
- margin call created
- dispute is accepted under the dispute window
- satisfaction closes the margin event

### Failure and recovery tests
- settlement retry after failure
- duplicate instruction idempotency handling
- default or termination recovery path

## 3. Recommended testing model
- Prefer Daml Script scenarios for ledger workflow validation.
- Write focused tests around one business state transition each.
- Assert on the effect of choices: created contracts, archived contracts, and updated statuses.
- Keep lifecycle tests small and deterministic.

## 4. Minimum acceptance test suite
1. Repo proposal accepted and agreement created.
2. Opening settlement instruction recorded with external evidence and agreement transitions to active.
3. Closing settlement triggers maturity close-out and termination record.
4. Margin dispute is accepted and then later satisfied.
5. Invalid or stale evidence fails the workflow without changing the business state to success.

## 5. Operational test rule
No test should treat an adapter response as legal proof. The evidence must be recorded and then validated as part of the contract workflow.
