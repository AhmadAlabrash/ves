/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import {
  addDecimalsFormatNumber,
  formatLabel,
  formatNumber,
  formatNumberPercentage,
  t,
} from '@vegaprotocol/react-helpers';
import {
  KeyValueTable,
  KeyValueTableRow,
  AsyncRenderer,
  Splash,
  Accordion,
  Tooltip,
  Link,
} from '@vegaprotocol/ui-toolkit';
import startCase from 'lodash/startCase';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import type { MarketInfoQuery, MarketInfoQuery_market } from './__generated__';
import BigNumber from 'bignumber.js';
import { useQuery } from '@apollo/client';
import { totalFees } from '@vegaprotocol/market-list';
import { AccountType, Interval } from '@vegaprotocol/types';
import { MARKET_INFO_QUERY } from './info-market-query';
import { ExternalLink } from '@vegaprotocol/ui-toolkit';

import { generatePath } from 'react-router-dom';
import { useEnvironment } from '@vegaprotocol/environment';

const Links = {
  PROPOSAL_PAGE: ':tokenUrl/governance/:proposalId',
};

export interface InfoProps {
  market: MarketInfoQuery_market;
}

export const calcCandleVolume = (
  m: MarketInfoQuery_market
): string | undefined => {
  return m?.candles
    ?.reduce((acc, c) => {
      return acc.plus(new BigNumber(c?.volume ?? 0));
    }, new BigNumber(0))
    .toString();
};

export interface MarketInfoContainerProps {
  marketId: string;
}
export const MarketInfoContainer = ({ marketId }: MarketInfoContainerProps) => {
  const yTimestamp = useMemo(() => {
    const yesterday = Math.round(new Date().getTime() / 1000) - 24 * 3600;
    return new Date(yesterday * 1000).toISOString();
  }, []);

  const { data, loading, error } = useQuery(MARKET_INFO_QUERY, {
    variables: { marketId, interval: Interval.INTERVAL_I1H, since: yTimestamp },
  });

  return (
    <AsyncRenderer<MarketInfoQuery> data={data} loading={loading} error={error}>
      {data && data.market ? (
        <Info market={data.market} />
      ) : (
        <Splash>
          <p>{t('Could not load market')}</p>
        </Splash>
      )}
    </AsyncRenderer>
  );
};

export const Info = ({ market }: InfoProps) => {
  const { VEGA_TOKEN_URL } = useEnvironment();
  const headerClassName = 'uppercase text-lg';
  const dayVolume = calcCandleVolume(market);
  const marketDataPanels = [
    {
      title: t('Current fees'),
      content: (
        <>
          <MarketInfoTable
            data={{
              ...market.fees.factors,
              totalFees: totalFees(market.fees.factors),
            }}
            asPercentage={true}
          />
          <p className="text-sm">
            {t(
              'All fees are paid by price takers and are a % of the trade notional value. Fees are not paid during auction uncrossing.'
            )}
          </p>
        </>
      ),
    },
    {
      title: t('Market price'),
      content: (
        <MarketInfoTable
          data={pick(
            market.data,
            'name',
            'markPrice',
            'bestBidPrice',
            'bestOfferPrice'
          )}
          decimalPlaces={market.decimalPlaces}
        />
      ),
    },
    {
      title: t('Market volume'),
      content: (
        <MarketInfoTable
          data={{
            '24hourVolume':
              dayVolume && dayVolume !== '0' ? formatNumber(dayVolume) : '-',
            ...pick(
              market.data,
              'openInterest',
              'name',
              'bestBidVolume',
              'bestOfferVolume',
              'bestStaticBidVolume',
              'bestStaticOfferVolume'
            ),
          }}
          decimalPlaces={market.positionDecimalPlaces}
        />
      ),
    },
    ...(market.accounts || [])
      .filter((a) => a.type === AccountType.ACCOUNT_TYPE_INSURANCE)
      .map((a, i) => ({
        title: t(`Insurance pool`),
        content: (
          <MarketInfoTable
            data={{
              balance: `${a.balance}
           ${market.tradableInstrument.instrument.product?.settlementAsset.symbol}`,
            }}
          />
        ),
      })),
  ];

  const keyDetails = pick(
    market,
    'name',
    'decimalPlaces',
    'positionDecimalPlaces',
    'tradingMode',
    'state',
    'id' as 'marketId'
  );
  const marketSpecPanels = [
    {
      title: t('Key details'),
      content: (
        <MarketInfoTable
          data={{
            ...keyDetails,
            marketID: keyDetails.id,
            id: undefined,
            tradingMode:
              keyDetails.tradingMode && formatLabel(keyDetails.tradingMode),
          }}
        />
      ),
    },
    {
      title: t('Instrument'),
      content: (
        <MarketInfoTable
          data={{
            marketName: market.tradableInstrument.instrument.name,
            code: market.tradableInstrument.instrument.code,
            productType:
              market.tradableInstrument.instrument.product.__typename,
            ...market.tradableInstrument.instrument.product,
          }}
        />
      ),
    },
    {
      title: t('Settlement asset'),
      content: (
        <MarketInfoTable
          data={{
            name: market.tradableInstrument.instrument.product?.settlementAsset
              .name,
            symbol:
              market.tradableInstrument.instrument.product?.settlementAsset
                .symbol,
            assetID:
              market.tradableInstrument.instrument.product?.settlementAsset.id,
          }}
        />
      ),
    },
    {
      title: t('Metadata'),
      content: (
        <MarketInfoTable
          data={{
            ...market.tradableInstrument.instrument.metadata.tags
              ?.map((tag) => {
                const [key, value] = tag.split(':');
                return { [key]: value };
              })
              .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
          }}
        />
      ),
    },
    {
      title: t('Risk factors'),
      content: (
        <MarketInfoTable
          data={market.riskFactors}
          unformatted={true}
          omits={['market', '__typename']}
        />
      ),
    },
    {
      title: t('Risk model'),
      content: (
        <MarketInfoTable
          data={market.tradableInstrument.riskModel}
          unformatted={true}
          omits={[]}
        />
      ),
    },
    ...(market.priceMonitoringSettings?.parameters?.triggers || []).map(
      (trigger, i) => ({
        title: t(`Price monitoring trigger ${i + 1}`),
        content: <MarketInfoTable data={trigger} />,
      })
    ),
    ...(market.data?.priceMonitoringBounds || []).map((trigger, i) => ({
      title: t(`Price monitoring bound ${i + 1}`),
      content: (
        <MarketInfoTable data={trigger} decimalPlaces={market.decimalPlaces} />
      ),
    })),
    {
      title: t('Liquidity monitoring parameters'),
      content: (
        <MarketInfoTable
          data={{
            triggeringRatio:
              market.liquidityMonitoringParameters.triggeringRatio,
            ...market.liquidityMonitoringParameters.targetStakeParameters,
          }}
        />
      ),
    },
    {
      title: t('Oracle'),
      content: (
        <MarketInfoTable
          data={{
            ...market.tradableInstrument.instrument.product.oracleSpecBinding,
            priceOracle:
              market.tradableInstrument.instrument.product
                .oracleSpecForSettlementPrice.id,
            terminationOracle:
              market.tradableInstrument.instrument.product
                .oracleSpecForTradingTermination.id,
          }}
        />
      ),
    },
  ];

  const marketGovPanels = [
    {
      title: t('Proposal'),
      content: (
        <p>
          <ExternalLink
            href={generatePath(Links.PROPOSAL_PAGE, {
              tokenUrl: VEGA_TOKEN_URL,
              proposalId: market.proposal?.id || '',
            })}
            title={
              market.proposal?.rationale.title ||
              market.proposal?.rationale.description ||
              ''
            }
          >
            {t('View governance proposal')}
          </ExternalLink>
        </p>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-4">
        <p className={headerClassName}>{t('Market data')}</p>
        <Accordion panels={marketDataPanels} />
      </div>
      <div className="mb-4">
        <p className={headerClassName}>{t('Market specification')}</p>
        <Accordion panels={marketSpecPanels} />
      </div>
      {VEGA_TOKEN_URL && market.proposal?.id && (
        <div>
          <p className={headerClassName}>{t('Market governance')}</p>
          <Accordion panels={marketGovPanels} />
        </div>
      )}
    </div>
  );
};

const tooltipMapping: Record<string, ReactNode> = {
  makerFee: t(
    'Maker portion of the fee is transferred to the non-aggressive, or passive party in the trade (the maker, as opposed to the taker).'
  ),
  liquidityFee: t(
    'Liquidity portion of the fee is paid to market makers for providing liquidity, and is transferred to the market-maker fee pool for the market.'
  ),
  infrastructureFee: t(
    'Fees paid to validators as a reward for running the infrastructure of the network.'
  ),

  markPrice: t(
    'A concept derived from traditional markets. It is a calculated value for the ‘current market price’ on a market.'
  ),
  openInterest: t(
    'The volume of all open positions in a given market (the sum of the size of all positions greater than 0).'
  ),
  indicativeVolume: t(
    'The volume at which all trades would occur if the auction was uncrossed now (when in auction mode).'
  ),
  bestBidVolume: t(
    'The aggregated volume being bid at the best bid price on the market.'
  ),
  bestOfferVolume: t(
    'The aggregated volume being offered at the best offer price on the market.'
  ),
  bestStaticBidVolume: t(
    'The aggregated volume being bid at the best static bid price on the market.'
  ),
  bestStaticOfferVolume: t(
    'The aggregated volume being offered at the best static offer price on the market.'
  ),

  decimalPlaces: t('The smallest price increment on the book.'),
  positionDecimalPlaces: t(
    'How big the smallest order / position on the market can be.'
  ),
  tradingMode: t('The trading mode the market is currently running.'),
  state: t('The current state of the market'),

  base: t(
    'The first currency in a pair for a currency-based derivatives market.'
  ),
  quote: t(
    'The second currency in a pair for a currency-based derivatives market.'
  ),
  class: t(
    'The classification of the product. Examples: shares, commodities, crypto, FX.'
  ),
  sector: t(
    'Data about the sector. Example: "automotive" for a market based on value of Tesla shares.'
  ),

  short: t(
    'A number that will be calculated by an appropriate stochastic risk model, dependent on the type of risk model used and its parameters.'
  ),
  long: t(
    'A number that will be calculated by an appropriate stochastic risk model, dependent on the type of risk model used and its parameters.'
  ),

  tau: (
    <span>
      {t('Projection horizon measured as a year fraction used in ')}
      <Link
        href="https://vega.xyz/papers/margins-and-credit-risk.pdf#page=7"
        target="__blank"
      >
        {t('Expected Shortfall')}
      </Link>
      {t(' calculation when obtaining Risk Factor Long and Risk Factor Short')}
    </span>
  ),
  riskAversionParameter: (
    <span>
      {t('Probability level used in ')}
      <Link
        href="https://vega.xyz/papers/margins-and-credit-risk.pdf#page=7"
        target="__blank"
      >
        {t('Expected Shortfall')}
      </Link>
      {t(' calculation when obtaining Risk Factor Long and Risk Factor Short')}
    </span>
  ),

  horizonSecs: t('Time horizon of the price projection in seconds.'),
  probability: t(
    'Probability level for price projection, e.g. value of 0.95 will result in a price range such that over the specified projection horizon, the prices observed in the market should be in that range 95% of the time.'
  ),
  auctionExtensionSecs: t(
    'Auction extension duration in seconds, should the price breach its theoretical level over the specified horizon at the specified probability level.'
  ),

  triggeringRatio: t('The triggering ratio for entering liquidity auction.'),
  timeWindow: t('The length of time over which open interest is measured.'),
  scalingFactor: t(
    'The scaling between the liquidity demand estimate, based on open interest and target stake.'
  ),
};

interface RowProps {
  field: string;
  value: any;
  decimalPlaces?: number;
  asPercentage?: boolean;
  unformatted?: boolean;
}

const Row = ({
  field,
  value,
  decimalPlaces,
  asPercentage,
  unformatted,
}: RowProps) => {
  const isNumber = typeof value === 'number' || !isNaN(Number(value));
  const isPrimitive = typeof value === 'string' || isNumber;
  if (isPrimitive) {
    return (
      <KeyValueTableRow key={field} inline={isPrimitive} noBorder={true}>
        <Tooltip description={tooltipMapping[field]} align="start">
          <div tabIndex={-1}>{startCase(t(field))}</div>
        </Tooltip>
        <span style={{ wordBreak: 'break-word' }}>
          {isNumber && !unformatted
            ? decimalPlaces
              ? addDecimalsFormatNumber(value, decimalPlaces)
              : asPercentage
              ? formatNumberPercentage(new BigNumber(value * 100))
              : formatNumber(Number(value))
            : value}
        </span>
      </KeyValueTableRow>
    );
  }
  return null;
};

export interface MarketInfoTableProps {
  data: any;
  decimalPlaces?: number;
  asPercentage?: boolean;
  unformatted?: boolean;
  omits?: string[];
}

export const MarketInfoTable = ({
  data,
  decimalPlaces,
  asPercentage,
  unformatted,
  omits = ['__typename'],
}: MarketInfoTableProps) => {
  return (
    <KeyValueTable>
      {Object.entries(omit(data, ...omits) || []).map(([key, value]) => (
        <Row
          key={key}
          field={key}
          value={value}
          decimalPlaces={decimalPlaces}
          asPercentage={asPercentage}
          unformatted={unformatted || key.toLowerCase().includes('volume')}
        />
      ))}
    </KeyValueTable>
  );
};
