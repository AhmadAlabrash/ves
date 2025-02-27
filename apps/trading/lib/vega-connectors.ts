import { useFeatureFlags } from '@vegaprotocol/environment';
import { useMemo } from 'react';
import {
  JsonRpcConnector,
  ViewConnector,
  InjectedConnector,
  SnapConnector,
  DEFAULT_SNAP_ID,
} from '@vegaprotocol/wallet';

export const jsonRpc = new JsonRpcConnector();
export const injected = new InjectedConnector();

let view: ViewConnector;
if (typeof window !== 'undefined') {
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
  view = new ViewConnector(urlParams.get('address'));
} else {
  view = new ViewConnector();
}

export const snap = new SnapConnector(DEFAULT_SNAP_ID);

export const useConnectors = () => {
  const featureFlags = useFeatureFlags((state) => state.flags);
  return useMemo(
    () => ({
      injected,
      jsonRpc,
      view,
      snap: featureFlags.METAMASK_SNAPS ? snap : undefined,
    }),
    [featureFlags.METAMASK_SNAPS]
  );
};
