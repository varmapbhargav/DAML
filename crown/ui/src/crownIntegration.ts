import { RepoProposalInput, SettlementInstructionInput, RepoTerms } from "./crownContracts";

export type LedgerLike = {
  create: (template: unknown, payload: unknown) => Promise<unknown>;
  exercise: (contractId: unknown, choice: string, argument?: unknown) => Promise<unknown>;
};

export const createRepoProposal = async (
  ledger: LedgerLike,
  template: unknown,
  input: RepoProposalInput
): Promise<unknown> => {
  if (!template) {
    throw new Error(
      "RepoProposal template is not available. Generate the DAML JS package with daml build before calling the integration layer."
    );
  }

  return ledger.create(template, input);
};

export const createSettlementInstruction = async (
  ledger: LedgerLike,
  template: unknown,
  input: SettlementInstructionInput
): Promise<unknown> => {
  if (!template) {
    throw new Error(
      "SettlementInstruction template is not available. Generate the DAML JS package with daml build before calling the integration layer."
    );
  }

  return ledger.create(template, input);
};

export const buildRepoProposalInput = (
  borrower: string,
  counterparty: string,
  terms: RepoTerms,
  idempotencyKey: string
): RepoProposalInput => ({
  proposalId: `repo-${Date.now()}`,
  proposer: borrower,
  counterparty,
  terms,
  proposedAt: new Date().toISOString(),
  expiresAt: null,
  idempotencyKey,
});
