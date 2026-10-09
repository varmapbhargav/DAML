export type AgreementStatus =
  | "Proposed"
  | "Accepted"
  | "Rejected"
  | "Cancelled"
  | "Active"
  | "MaturityPending"
  | "TerminationPending"
  | "DefaultWorkflow"
  | "Closed";

export type SettlementStatus =
  | "Prepared"
  | "Submitted"
  | "Acknowledged"
  | "SettlementPending"
  | "Settled"
  | "SettlementFailed"
  | "SettlementCancelled"
  | "ReconciliationRequired";

export type MarginStatus =
  | "Open"
  | "Disputed"
  | "PartiallySatisfied"
  | "Satisfied"
  | "Expired"
  | "MarginCancelled";

export type CollarStatus =
  | "AllocationProposed"
  | "Allocated"
  | "SubstitutionPending"
  | "Released"
  | "CollateralReconciliationRequired";

export type AssetClass =
  | "GovernmentBond"
  | "CorporateBond"
  | "EquityShare"
  | "MoneyMarketInstrument"
  | "CoveredBond"
  | "AgencyBond";

export type RateType = "Fixed" | "Floating" | "OverNightIndexSwap";

export type DayCountConvention =
  | "Actual360"
  | "Actual365Fixed"
  | "ActualActual"
  | "Thirty360";

export interface RepoTerms {
  productType: string;
  marketConventionId: string;
  principal: number;
  currency: string;
  repoRate: number;
  rateType: RateType;
  dayCountConvention: DayCountConvention;
  tradeDate: string;
  openingValueDate: string;
  maturityDate: string;
  applicableCalendar: string;
  repurchaseAmount: number;
  collateralBasketId: string | null;
  eligibleAssetClasses: AssetClass[];
  collateralCurrency: string;
  haircut: number;
  concentrationLimit: number;
  marginFrequencyDays: number;
  marginThreshold: number;
  minimumTransferAmount: number;
  disputeWindowHours: number;
  settlementSystemId: string;
  settlementCutOffTime: string;
  masterAgreementRef: string;
  legalEntityIdBorrower: string;
  legalEntityIdProvider: string;
  termsVersion: number;
  approvedBy: string;
}

export interface RepoProposalInput {
  proposalId: string;
  proposer: string;
  counterparty: string;
  terms: RepoTerms;
  proposedAt: string;
  expiresAt: string | null;
  idempotencyKey: string;
}

export interface RepoAgreementInput {
  agreementId: string;
  borrower: string;
  cashProvider: string;
  terms: RepoTerms;
  status: AgreementStatus;
  createdAt: string;
  activatedAt: string | null;
  closedAt: string | null;
}

export interface SettlementInstructionInput {
  instructionId: string;
  agreementId: string;
  borrower: string;
  cashProvider: string;
  settlementRole: string;
  legType: "CashLeg" | "SecuritiesLeg";
  amount: number;
  currency: string;
  instrumentId: string | null;
  debitAccount: string;
  creditAccount: string;
  settlementSystem: string;
  valueDate: string;
  status: SettlementStatus;
  idempotencyKey: string;
  requestedAt: string;
  externalRef: string | null;
}

export interface SettlementEvidenceInput {
  evidenceId: string;
  instructionId: string;
  agreementId: string;
  borrower: string;
  cashProvider: string;
  settlementRole: string;
  evidenceRef: {
    sourceSystem: string;
    externalRef: string;
    evidenceDigest: string;
    recordedAt: string;
    evidenceStatus: string;
  };
  outcomeStatus: SettlementStatus;
  recordedAt: string;
}

export const createDefaultRepoTerms = (approver: string): RepoTerms => ({
  productType: "BilateralRepo",
  marketConventionId: "M-0001",
  principal: 1000000,
  currency: "USD",
  repoRate: 0.05,
  rateType: "Fixed",
  dayCountConvention: "Actual360",
  tradeDate: "2026-01-01",
  openingValueDate: "2026-01-02",
  maturityDate: "2026-01-09",
  applicableCalendar: "TARGET",
  repurchaseAmount: 1005000,
  collateralBasketId: null,
  eligibleAssetClasses: ["GovernmentBond"],
  collateralCurrency: "USD",
  haircut: 0.02,
  concentrationLimit: 0.2,
  marginFrequencyDays: 0,
  marginThreshold: 0.01,
  minimumTransferAmount: 100,
  disputeWindowHours: 24,
  settlementSystemId: "CCIL",
  settlementCutOffTime: "14:30:00Z",
  masterAgreementRef: "GMRA-2011",
  legalEntityIdBorrower: "LEI-BORROWER",
  legalEntityIdProvider: "LEI-LENDER",
  termsVersion: 1,
  approvedBy: approver,
});

export const contractCatalog = [
  {
    module: "Repo.Agreement",
    template: "RepoProposal",
    summary: "Trade proposal and acceptance workflow",
  },
  {
    module: "Repo.Agreement",
    template: "RepoAgreement",
    summary: "Accepted repo terms and lifecycle states",
  },
  {
    module: "Settlement",
    template: "SettlementInstruction",
    summary: "External settlement request and status handling",
  },
  {
    module: "Settlement",
    template: "SettlementEvidence",
    summary: "Evidence, confirmations and reconciliation",
  },
  {
    module: "Lifecycle",
    template: "MaturityObligation",
    summary: "Maturity obligation and close-out checks",
  },
  {
    module: "Lifecycle",
    template: "TerminationRecord",
    summary: "Termination evidence and closure record",
  },
];
