# Daml contract catalogue

This catalogue explains the primary contract families in the CROWN design and how they relate to the business lifecycle.

## 1. Shared domain models
### Types
The shared domain model holds the canonical enum values and the economic records used everywhere else in the application.

Key records and enums include:
- AgreementStatus
- SettlementStatus
- MarginStatus
- CollateralStatus
- RepoTerms
- CollateralLine
- ExternalEvidenceRef

These should remain stable and should not hide market-specific rules in free-form text.

## 2. Agreement and lifecycle contracts
### RepoProposal
Represents a trade term proposal from one party to another. It is not yet an active repo agreement.

Key business intent:
- explicit counterparty authorization
- term validation before acceptance
- support for pricing, collateral and legal reference checks

### RepoAgreement
Represents an accepted agreement and the main lifecycle contract for the repo. It contains the economic terms and controls access to downstream workflow choices.

Responsible choices typically include:
- RequestOpeningSettlement
- RequestClosingSettlement
- Update or confirm lifecycle state when evidence is valid

## 3. Settlement contracts
### SettlementInstruction
Captures the requested external movement of cash or securities. It records the instruction details and identifies the authorized settlement agent.

### SettlementEvidence
Stores the external acknowledgement or final outcome from the underlying system. This is where the application records data such as external reference, source system, and evidence digest.

This separation is critical: an instruction is not evidence; evidence is not a legal asset transfer by itself.

## 4. Margin and collateral contracts
### CollateralAllocation
Tracks the allocated collateral under a repo arrangement. It is the ledger representation of an allocation that must be monitored for substitution, release, and haircut compliance.

### ValuationSnapshot
Provides a point-in-time valuation result, including source metadata, timestamp, and the value facts needed for risk and margin decisions.

### MarginCall
Represents a margin request and allows dispute, satisfaction, and status tracking.

## 5. Maturity and close-out contracts
### MaturityObligation
Captures the amount and status due at the end of the repo life. It creates an operational checklist for closing settlement and collateral return.

### TerminationRecord
Records the legal or operational close-out evidence that a repo has ended, including the reason and supporting settlement evidence references.

## 6. Product extension contracts
These are optional, but the architecture anticipates use of them for broader secured-funding products:
- TriParty agent mandate and allocation contracts
- Securities lending loan record
- Buy/sell-back agreement
- Clearing submission record
- Audit evidence reference

## 7. Design principles for contract design
1. Each contract should model one business concept, not a whole operational system.
2. Use signatories and controllers to reflect legal authorization.
3. Keep external evidence separate from the primary contractual record.
4. Use explicit state transitions rather than free-form status strings where possible.
5. Prefer references to external facts over embedding the full evidence payload on ledger.
