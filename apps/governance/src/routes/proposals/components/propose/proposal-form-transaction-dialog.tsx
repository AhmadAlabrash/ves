import {
  getProposalDialogIcon,
  getProposalDialogIntent,
  useGetProposalDialogTitle,
} from '@vegaprotocol/proposals';
import type { ProposalEventFieldsFragment } from '@vegaprotocol/proposals';
import type { DialogProps } from '@vegaprotocol/proposals';

interface ProposalFormTransactionDialogProps {
  finalizedProposal: ProposalEventFieldsFragment | null;
  TransactionDialog: (props: DialogProps) => JSX.Element;
}

export const ProposalFormTransactionDialog = ({
  finalizedProposal,
  TransactionDialog,
}: ProposalFormTransactionDialogProps) => {
  const title = useGetProposalDialogTitle(finalizedProposal?.state);
  // Render a custom complete UI if the proposal was rejected otherwise
  // pass undefined so that the default vega transaction dialog UI gets used
  const completeContent = finalizedProposal?.rejectionReason ? (
    <p>{finalizedProposal.rejectionReason}</p>
  ) : undefined;

  return (
    <div data-testid="proposal-transaction-dialog">
      <TransactionDialog
        title={title}
        intent={getProposalDialogIntent(finalizedProposal?.state)}
        icon={getProposalDialogIcon(finalizedProposal?.state)}
        content={{
          Complete: completeContent,
        }}
      />
    </div>
  );
};
