import { useEffect, useMemo, useRef } from 'react';
import compact from 'lodash/compact';
import { useApolloClient } from '@apollo/client';
import { type Subscription } from 'zen-observable-ts';
/*
 * TODO: figure out how we can get the chart types
import {
  type LibrarySymbolInfo,
  type IBasicDataFeed,
  type ResolutionString,
  type SeriesFormat,
} from '../charting_library/charting_library';
*/
import {
  GetBarsDocument,
  LastBarDocument,
  type BarFragment,
  type GetBarsQuery,
  type GetBarsQueryVariables,
  type LastBarSubscription,
  type LastBarSubscriptionVariables,
} from './__generated__/Bars';
import { Interval } from '@vegaprotocol/types';
import {
  SymbolDocument,
  type SymbolQuery,
  type SymbolQueryVariables,
} from './__generated__/Symbol';
import { getMarketExpiryDate, toBigNum } from '@vegaprotocol/utils';

const EXCHANGE = 'VEGA';

const resolutionMap: Record<string, Interval> = {
  '1T': Interval.INTERVAL_BLOCK,
  '1': Interval.INTERVAL_I1M,
  '5': Interval.INTERVAL_I5M,
  '15': Interval.INTERVAL_I15M,
  '60': Interval.INTERVAL_I1H,
  '360': Interval.INTERVAL_I6H,
  '1D': Interval.INTERVAL_I1D,
} as const;

const supportedResolutions = Object.keys(resolutionMap);

const configurationData = {
  // only showing Vega ofc
  exchanges: [EXCHANGE],

  // Represents the resolutions for bars supported by your datafeed
  // @ts-ignore cant import types as chartin_library is external
  supported_resolutions: supportedResolutions as ResolutionString[],
} as const;

export const useDatafeed = () => {
  const hasHistory = useRef(false);
  const subRef = useRef<Subscription>();
  const client = useApolloClient();

  const datafeed = useMemo(() => {
    // @ts-ignore cant import types as chartin_library is external
    const feed: IBasicDataFeed = {
      // @ts-ignore cant import types as chartin_library is external
      onReady: (callback) => {
        setTimeout(() => callback(configurationData));
      },

      searchSymbols: () => {
        /* no op, we handle finding markets in app */
      },

      resolveSymbol: async (
        // @ts-ignore cant import types as chartin_library is external
        marketId,
        // @ts-ignore cant import types as chartin_library is external
        onSymbolResolvedCallback,
        // @ts-ignore cant import types as chartin_library is external
        onResolveErrorCallback
      ) => {
        try {
          const result = await client.query<SymbolQuery, SymbolQueryVariables>({
            query: SymbolDocument,
            variables: {
              marketId,
            },
          });

          if (!result.data.market) {
            onResolveErrorCallback('Cannot resolve symbol: market not found');
            return;
          }

          const market = result.data.market;
          const instrument = market.tradableInstrument.instrument;
          const productType = instrument.product.__typename;

          if (!productType) {
            onResolveErrorCallback(
              'Cannot resolve symbol: invalid product type'
            );
            return;
          }

          let type = 'undefined'; // https://www.tradingview.com/charting-library-docs/latest/api/modules/Charting_Library#symboltype
          if (productType === 'Future' || productType === 'Perpetual') {
            type = 'futures';
          } else if (productType === 'Spot') {
            type = 'spot';
          }

          const expirationDate = getMarketExpiryDate(instrument.metadata.tags);
          const expirationTimestamp = expirationDate
            ? Math.floor(expirationDate.getTime() / 1000)
            : null;

          // @ts-ignore cant import types as chartin_library is external
          const symbolInfo: LibrarySymbolInfo = {
            ticker: market.id, // use ticker as our unique identifier so that code/name can be used for name/description
            name: instrument.code,
            full_name: `${EXCHANGE}:${instrument.code}`,
            description: instrument.name,
            listed_exchange: EXCHANGE,
            expired: productType === 'Perpetual' ? false : true,
            expirationDate: expirationTimestamp,

            // @ts-ignore cant import types as chartin_library is external
            format: 'price' as SeriesFormat,
            type,
            session: '24x7',
            timezone: 'Etc/UTC',
            exchange: EXCHANGE,
            minmov: 1,
            pricescale: Number('1' + '0'.repeat(market.decimalPlaces)), // for number of decimal places
            visible_plots_set: 'ohlc',
            volume_precision: market.positionDecimalPlaces,
            data_status: 'streaming',
            delay: 1000, // around 1 block time
            has_intraday: true, // required for less than 1 day interval
            has_empty_bars: true, // library will generate bars if there are gaps, useful for auctions
            has_ticks: false, // switch to true when enabling block intervals

            // @ts-ignore required for data conversion
            vegaDecimalPlaces: market.decimalPlaces,
            // @ts-ignore required for data conversion
            vegaPositionDecimalPlaces: market.positionDecimalPlaces,
          };

          onSymbolResolvedCallback(symbolInfo);
        } catch (err) {
          onResolveErrorCallback('Cannot resolve symbol');
        }
      },

      getBars: async (
        // @ts-ignore cant import types as chartin_library is external
        symbolInfo,
        // @ts-ignore cant import types as chartin_library is external
        resolution,
        // @ts-ignore cant import types as chartin_library is external
        periodParams,
        // @ts-ignore cant import types as chartin_library is external
        onHistoryCallback,
        // @ts-ignore cant import types as chartin_library is external
        onErrorCallback
      ) => {
        if (!symbolInfo.ticker) {
          onErrorCallback('No symbol.ticker');
          return;
        }

        try {
          const result = await client.query<
            GetBarsQuery,
            GetBarsQueryVariables
          >({
            query: GetBarsDocument,
            variables: {
              marketId: symbolInfo.ticker,
              since: unixTimestampToDate(periodParams.from).toISOString(),
              to: unixTimestampToDate(periodParams.to).toISOString(),
              interval: resolutionMap[resolution],
            },
          });

          const candleEdges = compact(
            result.data.market?.candlesConnection?.edges
          );

          if (!candleEdges.length) {
            onHistoryCallback([], { noData: true });
            return;
          }

          const bars = candleEdges.map((edge) => {
            return prepareBar(
              edge.node,
              // @ts-ignore added in resolveSymbol
              symbolInfo.vegaDecimalPlaces,
              // @ts-ignore added in resolveSymbol
              symbolInfo.vegaPositionDecimalPlaces
            );
          });

          hasHistory.current = true;

          onHistoryCallback(bars, { noData: false });
        } catch (err) {
          onErrorCallback(
            err instanceof Error ? err.message : 'Failed to get bars'
          );
        }
      },

      subscribeBars: (
        // @ts-ignore cant import types as chartin_library is external
        symbolInfo,
        // @ts-ignore cant import types as chartin_library is external
        resolution,
        // @ts-ignore cant import types as chartin_library is external
        onTick

        // subscriberUID,  // chart will subscribe and unsbuscribe when the parent market of the page changes so we don't need to use subscriberUID as of now
      ) => {
        if (!symbolInfo.ticker) {
          throw new Error('No symbolInfo.ticker');
        }

        // Dont start the subscription if there is no candle history. This protects against a
        // problem where drawing on the chart throws an error if there is no prior history, instead
        // no you'll just get the no data message
        if (!hasHistory.current) {
          return;
        }

        subRef.current = client
          .subscribe<LastBarSubscription, LastBarSubscriptionVariables>({
            query: LastBarDocument,
            variables: {
              marketId: symbolInfo.ticker,
              interval: resolutionMap[resolution],
            },
          })
          .subscribe(({ data }) => {
            if (data) {
              const bar = prepareBar(
                data.candles,
                // @ts-ignore added in resolveSymbol
                symbolInfo.vegaDecimalPlaces,
                // @ts-ignore added in resolveSymbol
                symbolInfo.vegaPositionDecimalPlaces
              );

              onTick(bar);
            }
          });
      },

      /**
       * We only have one active subscription no need to use the uid provided by unsubscribeBars
       */
      unsubscribeBars: () => {
        if (subRef.current) {
          subRef.current.unsubscribe();
        }
      },
    };

    return feed;
  }, [client]);

  useEffect(() => {
    return () => {
      if (subRef.current) {
        subRef.current.unsubscribe();
      }
    };
  }, []);

  return datafeed;
};

const prepareBar = (
  bar: BarFragment,
  decimalPlaces: number,
  positionDecimalPlaces: number
) => {
  return {
    time: new Date(bar.periodStart).getTime(),
    low: toBigNum(bar.low, decimalPlaces).toNumber(),
    high: toBigNum(bar.high, decimalPlaces).toNumber(),
    open: toBigNum(bar.open, decimalPlaces).toNumber(),
    close: toBigNum(bar.close, decimalPlaces).toNumber(),
    volume: toBigNum(bar.volume, positionDecimalPlaces).toNumber(),
  };
};

const unixTimestampToDate = (timestamp: number) => {
  return new Date(timestamp * 1000);
};
