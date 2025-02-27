import { useVegaWallet } from '@vegaprotocol/wallet';
import { FundingPaymentsManager } from '@vegaprotocol/funding-payments';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useDataGridEvents } from '@vegaprotocol/datagrid';
import { Splash } from '@vegaprotocol/ui-toolkit';
import type { DataGridSlice } from '../../stores/datagrid-store-slice';
import { createDataGridSlice } from '../../stores/datagrid-store-slice';
import { useMarketClickHandler } from '../../lib/hooks/use-market-click-handler';
import { useT } from '../../lib/use-t';

export const FundingPaymentsContainer = ({
  marketId,
}: {
  marketId?: string;
}) => {
  const t = useT();
  const onMarketClick = useMarketClickHandler(true);
  const { pubKey } = useVegaWallet();

  const gridStore = useFundingPaymentsStore((store) => store.gridStore);
  const updateGridStore = useFundingPaymentsStore(
    (store) => store.updateGridStore
  );

  const gridStoreCallbacks = useDataGridEvents(gridStore, (colState) => {
    updateGridStore(colState);
  });

  if (!pubKey) {
    return (
      <Splash>
        <p>{t('Please connect Vega wallet')}</p>
      </Splash>
    );
  }

  return (
    <FundingPaymentsManager
      partyId={pubKey}
      marketId={marketId}
      onMarketClick={onMarketClick}
      gridProps={gridStoreCallbacks}
    />
  );
};

export const useFundingPaymentsStore = create<DataGridSlice>()(
  persist(createDataGridSlice, {
    name: 'vega_funding_payments_store',
  })
);
