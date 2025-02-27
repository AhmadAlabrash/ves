import * as Types from '@vegaprotocol/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type DataSourceFilterFragment = { __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null };

export type DataSourceFragment = { __typename?: 'DataSourceSpec', id: string, data: { __typename?: 'DataSourceDefinition', sourceType: { __typename?: 'DataSourceDefinitionExternal', sourceType: { __typename?: 'DataSourceSpecConfiguration', signers?: Array<{ __typename?: 'Signer', signer: { __typename?: 'ETHAddress', address?: string | null } | { __typename?: 'PubKey', key?: string | null } }> | null, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } | { __typename?: 'EthCallSpec', abi?: Array<string> | null, address: string, args?: Array<string> | null, method: string, requiredConfirmations: number, normalisers?: Array<{ __typename?: 'Normaliser', name: string, expression: string }> | null, trigger: { __typename?: 'EthCallTrigger', trigger: { __typename?: 'EthTimeTrigger', initial?: any | null, every?: number | null, until?: any | null } }, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } } | { __typename?: 'DataSourceDefinitionInternal', sourceType: { __typename?: 'DataSourceSpecConfigurationTime', conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } | { __typename: 'DataSourceSpecConfigurationTimeTrigger', triggers: Array<{ __typename?: 'InternalTimeTrigger', initial?: number | null, every?: number | null } | null>, conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } } } };

export type FutureFragment = { __typename?: 'Future', quoteName: string, settlementAsset: { __typename?: 'Asset', id: string, symbol: string, name: string, decimals: number, quantum: string }, dataSourceSpecForSettlementData: { __typename?: 'DataSourceSpec', id: string, data: { __typename?: 'DataSourceDefinition', sourceType: { __typename?: 'DataSourceDefinitionExternal', sourceType: { __typename?: 'DataSourceSpecConfiguration', signers?: Array<{ __typename?: 'Signer', signer: { __typename?: 'ETHAddress', address?: string | null } | { __typename?: 'PubKey', key?: string | null } }> | null, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } | { __typename?: 'EthCallSpec', abi?: Array<string> | null, address: string, args?: Array<string> | null, method: string, requiredConfirmations: number, normalisers?: Array<{ __typename?: 'Normaliser', name: string, expression: string }> | null, trigger: { __typename?: 'EthCallTrigger', trigger: { __typename?: 'EthTimeTrigger', initial?: any | null, every?: number | null, until?: any | null } }, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } } | { __typename?: 'DataSourceDefinitionInternal', sourceType: { __typename?: 'DataSourceSpecConfigurationTime', conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } | { __typename: 'DataSourceSpecConfigurationTimeTrigger', triggers: Array<{ __typename?: 'InternalTimeTrigger', initial?: number | null, every?: number | null } | null>, conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } } } }, dataSourceSpecForTradingTermination: { __typename?: 'DataSourceSpec', id: string, data: { __typename?: 'DataSourceDefinition', sourceType: { __typename?: 'DataSourceDefinitionExternal', sourceType: { __typename?: 'DataSourceSpecConfiguration', signers?: Array<{ __typename?: 'Signer', signer: { __typename?: 'ETHAddress', address?: string | null } | { __typename?: 'PubKey', key?: string | null } }> | null, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } | { __typename?: 'EthCallSpec', abi?: Array<string> | null, address: string, args?: Array<string> | null, method: string, requiredConfirmations: number, normalisers?: Array<{ __typename?: 'Normaliser', name: string, expression: string }> | null, trigger: { __typename?: 'EthCallTrigger', trigger: { __typename?: 'EthTimeTrigger', initial?: any | null, every?: number | null, until?: any | null } }, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } } | { __typename?: 'DataSourceDefinitionInternal', sourceType: { __typename?: 'DataSourceSpecConfigurationTime', conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } | { __typename: 'DataSourceSpecConfigurationTimeTrigger', triggers: Array<{ __typename?: 'InternalTimeTrigger', initial?: number | null, every?: number | null } | null>, conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } } } }, dataSourceSpecBinding: { __typename?: 'DataSourceSpecToFutureBinding', settlementDataProperty: string, tradingTerminationProperty: string } };

export type PerpetualFragment = { __typename?: 'Perpetual', quoteName: string, settlementAsset: { __typename?: 'Asset', id: string, symbol: string, name: string, decimals: number, quantum: string }, dataSourceSpecForSettlementData: { __typename?: 'DataSourceSpec', id: string, data: { __typename?: 'DataSourceDefinition', sourceType: { __typename?: 'DataSourceDefinitionExternal', sourceType: { __typename?: 'DataSourceSpecConfiguration', signers?: Array<{ __typename?: 'Signer', signer: { __typename?: 'ETHAddress', address?: string | null } | { __typename?: 'PubKey', key?: string | null } }> | null, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } | { __typename?: 'EthCallSpec', abi?: Array<string> | null, address: string, args?: Array<string> | null, method: string, requiredConfirmations: number, normalisers?: Array<{ __typename?: 'Normaliser', name: string, expression: string }> | null, trigger: { __typename?: 'EthCallTrigger', trigger: { __typename?: 'EthTimeTrigger', initial?: any | null, every?: number | null, until?: any | null } }, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } } | { __typename?: 'DataSourceDefinitionInternal', sourceType: { __typename?: 'DataSourceSpecConfigurationTime', conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } | { __typename: 'DataSourceSpecConfigurationTimeTrigger', triggers: Array<{ __typename?: 'InternalTimeTrigger', initial?: number | null, every?: number | null } | null>, conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } } } }, dataSourceSpecForSettlementSchedule: { __typename?: 'DataSourceSpec', id: string, data: { __typename?: 'DataSourceDefinition', sourceType: { __typename?: 'DataSourceDefinitionExternal', sourceType: { __typename?: 'DataSourceSpecConfiguration', signers?: Array<{ __typename?: 'Signer', signer: { __typename?: 'ETHAddress', address?: string | null } | { __typename?: 'PubKey', key?: string | null } }> | null, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } | { __typename?: 'EthCallSpec', abi?: Array<string> | null, address: string, args?: Array<string> | null, method: string, requiredConfirmations: number, normalisers?: Array<{ __typename?: 'Normaliser', name: string, expression: string }> | null, trigger: { __typename?: 'EthCallTrigger', trigger: { __typename?: 'EthTimeTrigger', initial?: any | null, every?: number | null, until?: any | null } }, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } } | { __typename?: 'DataSourceDefinitionInternal', sourceType: { __typename?: 'DataSourceSpecConfigurationTime', conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } | { __typename: 'DataSourceSpecConfigurationTimeTrigger', triggers: Array<{ __typename?: 'InternalTimeTrigger', initial?: number | null, every?: number | null } | null>, conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } } } }, dataSourceSpecBinding: { __typename?: 'DataSourceSpecPerpetualBinding', settlementDataProperty: string, settlementScheduleProperty: string } };

export type MarketInfoQueryVariables = Types.Exact<{
  marketId: Types.Scalars['ID'];
}>;


export type MarketInfoQuery = { __typename?: 'Query', market?: { __typename?: 'Market', id: string, decimalPlaces: number, positionDecimalPlaces: number, state: Types.MarketState, tradingMode: Types.MarketTradingMode, linearSlippageFactor: string, quadraticSlippageFactor: string, proposal?: { __typename?: 'Proposal', id?: string | null, rationale: { __typename?: 'ProposalRationale', title: string, description: string } } | null, marketTimestamps: { __typename?: 'MarketTimestamps', open: any, close: any }, openingAuction: { __typename?: 'AuctionDuration', durationSecs: number, volume: number }, accountsConnection?: { __typename?: 'AccountsConnection', edges?: Array<{ __typename?: 'AccountEdge', node: { __typename?: 'AccountBalance', type: Types.AccountType, balance: string, asset: { __typename?: 'Asset', id: string } } } | null> | null } | null, fees: { __typename?: 'Fees', factors: { __typename?: 'FeeFactors', makerFee: string, infrastructureFee: string, liquidityFee: string } }, priceMonitoringSettings: { __typename?: 'PriceMonitoringSettings', parameters?: { __typename?: 'PriceMonitoringParameters', triggers?: Array<{ __typename?: 'PriceMonitoringTrigger', horizonSecs: number, probability: number, auctionExtensionSecs: number }> | null } | null }, riskFactors?: { __typename?: 'RiskFactor', market: string, short: string, long: string } | null, liquidityMonitoringParameters: { __typename?: 'LiquidityMonitoringParameters', triggeringRatio: string, targetStakeParameters: { __typename?: 'TargetStakeParameters', timeWindow: number, scalingFactor: number } }, liquiditySLAParameters?: { __typename?: 'LiquiditySLAParameters', priceRange: string, commitmentMinTimeFraction: string, performanceHysteresisEpochs: number, slaCompetitionFactor: string } | null, tradableInstrument: { __typename?: 'TradableInstrument', instrument: { __typename?: 'Instrument', id: string, name: string, code: string, metadata: { __typename?: 'InstrumentMetadata', tags?: Array<string> | null }, product: { __typename?: 'Future', quoteName: string, settlementAsset: { __typename?: 'Asset', id: string, symbol: string, name: string, decimals: number, quantum: string }, dataSourceSpecForSettlementData: { __typename?: 'DataSourceSpec', id: string, data: { __typename?: 'DataSourceDefinition', sourceType: { __typename?: 'DataSourceDefinitionExternal', sourceType: { __typename?: 'DataSourceSpecConfiguration', signers?: Array<{ __typename?: 'Signer', signer: { __typename?: 'ETHAddress', address?: string | null } | { __typename?: 'PubKey', key?: string | null } }> | null, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } | { __typename?: 'EthCallSpec', abi?: Array<string> | null, address: string, args?: Array<string> | null, method: string, requiredConfirmations: number, normalisers?: Array<{ __typename?: 'Normaliser', name: string, expression: string }> | null, trigger: { __typename?: 'EthCallTrigger', trigger: { __typename?: 'EthTimeTrigger', initial?: any | null, every?: number | null, until?: any | null } }, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } } | { __typename?: 'DataSourceDefinitionInternal', sourceType: { __typename?: 'DataSourceSpecConfigurationTime', conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } | { __typename: 'DataSourceSpecConfigurationTimeTrigger', triggers: Array<{ __typename?: 'InternalTimeTrigger', initial?: number | null, every?: number | null } | null>, conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } } } }, dataSourceSpecForTradingTermination: { __typename?: 'DataSourceSpec', id: string, data: { __typename?: 'DataSourceDefinition', sourceType: { __typename?: 'DataSourceDefinitionExternal', sourceType: { __typename?: 'DataSourceSpecConfiguration', signers?: Array<{ __typename?: 'Signer', signer: { __typename?: 'ETHAddress', address?: string | null } | { __typename?: 'PubKey', key?: string | null } }> | null, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } | { __typename?: 'EthCallSpec', abi?: Array<string> | null, address: string, args?: Array<string> | null, method: string, requiredConfirmations: number, normalisers?: Array<{ __typename?: 'Normaliser', name: string, expression: string }> | null, trigger: { __typename?: 'EthCallTrigger', trigger: { __typename?: 'EthTimeTrigger', initial?: any | null, every?: number | null, until?: any | null } }, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } } | { __typename?: 'DataSourceDefinitionInternal', sourceType: { __typename?: 'DataSourceSpecConfigurationTime', conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } | { __typename: 'DataSourceSpecConfigurationTimeTrigger', triggers: Array<{ __typename?: 'InternalTimeTrigger', initial?: number | null, every?: number | null } | null>, conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } } } }, dataSourceSpecBinding: { __typename?: 'DataSourceSpecToFutureBinding', settlementDataProperty: string, tradingTerminationProperty: string } } | { __typename?: 'Perpetual', quoteName: string, settlementAsset: { __typename?: 'Asset', id: string, symbol: string, name: string, decimals: number, quantum: string }, dataSourceSpecForSettlementData: { __typename?: 'DataSourceSpec', id: string, data: { __typename?: 'DataSourceDefinition', sourceType: { __typename?: 'DataSourceDefinitionExternal', sourceType: { __typename?: 'DataSourceSpecConfiguration', signers?: Array<{ __typename?: 'Signer', signer: { __typename?: 'ETHAddress', address?: string | null } | { __typename?: 'PubKey', key?: string | null } }> | null, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } | { __typename?: 'EthCallSpec', abi?: Array<string> | null, address: string, args?: Array<string> | null, method: string, requiredConfirmations: number, normalisers?: Array<{ __typename?: 'Normaliser', name: string, expression: string }> | null, trigger: { __typename?: 'EthCallTrigger', trigger: { __typename?: 'EthTimeTrigger', initial?: any | null, every?: number | null, until?: any | null } }, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } } | { __typename?: 'DataSourceDefinitionInternal', sourceType: { __typename?: 'DataSourceSpecConfigurationTime', conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } | { __typename: 'DataSourceSpecConfigurationTimeTrigger', triggers: Array<{ __typename?: 'InternalTimeTrigger', initial?: number | null, every?: number | null } | null>, conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } } } }, dataSourceSpecForSettlementSchedule: { __typename?: 'DataSourceSpec', id: string, data: { __typename?: 'DataSourceDefinition', sourceType: { __typename?: 'DataSourceDefinitionExternal', sourceType: { __typename?: 'DataSourceSpecConfiguration', signers?: Array<{ __typename?: 'Signer', signer: { __typename?: 'ETHAddress', address?: string | null } | { __typename?: 'PubKey', key?: string | null } }> | null, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } | { __typename?: 'EthCallSpec', abi?: Array<string> | null, address: string, args?: Array<string> | null, method: string, requiredConfirmations: number, normalisers?: Array<{ __typename?: 'Normaliser', name: string, expression: string }> | null, trigger: { __typename?: 'EthCallTrigger', trigger: { __typename?: 'EthTimeTrigger', initial?: any | null, every?: number | null, until?: any | null } }, filters?: Array<{ __typename?: 'Filter', key: { __typename?: 'PropertyKey', name?: string | null, type: Types.PropertyKeyType, numberDecimalPlaces?: number | null }, conditions?: Array<{ __typename?: 'Condition', value?: string | null, operator: Types.ConditionOperator }> | null }> | null } } | { __typename?: 'DataSourceDefinitionInternal', sourceType: { __typename?: 'DataSourceSpecConfigurationTime', conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } | { __typename: 'DataSourceSpecConfigurationTimeTrigger', triggers: Array<{ __typename?: 'InternalTimeTrigger', initial?: number | null, every?: number | null } | null>, conditions: Array<{ __typename?: 'Condition', operator: Types.ConditionOperator, value?: string | null } | null> } } } }, dataSourceSpecBinding: { __typename?: 'DataSourceSpecPerpetualBinding', settlementDataProperty: string, settlementScheduleProperty: string } } | { __typename?: 'Spot' } }, riskModel: { __typename?: 'LogNormalRiskModel', tau: number, riskAversionParameter: number, params: { __typename?: 'LogNormalModelParams', r: number, sigma: number, mu: number } } | { __typename?: 'SimpleRiskModel', params: { __typename?: 'SimpleRiskModelParams', factorLong: number, factorShort: number } }, marginCalculator?: { __typename?: 'MarginCalculator', scalingFactors: { __typename?: 'ScalingFactors', searchLevel: number, initialMargin: number, collateralRelease: number } } | null } } | null };

export const DataSourceFilterFragmentDoc = gql`
    fragment DataSourceFilter on Filter {
  key {
    name
    type
    numberDecimalPlaces
  }
  conditions {
    value
    operator
  }
}
    `;
export const DataSourceFragmentDoc = gql`
    fragment DataSource on DataSourceSpec {
  id
  data {
    sourceType {
      ... on DataSourceDefinitionExternal {
        sourceType {
          ... on EthCallSpec {
            abi
            address
            args
            method
            requiredConfirmations
            normalisers {
              name
              expression
            }
            trigger {
              trigger {
                ... on EthTimeTrigger {
                  initial
                  every
                  until
                }
              }
            }
            filters {
              key {
                name
                type
                numberDecimalPlaces
              }
              conditions {
                value
                operator
              }
            }
          }
          ... on DataSourceSpecConfiguration {
            signers {
              signer {
                ... on PubKey {
                  key
                }
                ... on ETHAddress {
                  address
                }
              }
            }
            filters {
              ...DataSourceFilter
            }
          }
        }
      }
      ... on DataSourceDefinitionInternal {
        sourceType {
          ... on DataSourceSpecConfigurationTime {
            conditions {
              operator
              value
            }
          }
          ... on DataSourceSpecConfigurationTimeTrigger {
            __typename
            triggers {
              initial
              every
            }
            conditions {
              operator
              value
            }
          }
        }
      }
    }
  }
}
    ${DataSourceFilterFragmentDoc}`;
export const FutureFragmentDoc = gql`
    fragment Future on Future {
  quoteName
  settlementAsset {
    id
    symbol
    name
    decimals
    quantum
  }
  dataSourceSpecForSettlementData {
    ...DataSource
  }
  dataSourceSpecForTradingTermination {
    ...DataSource
  }
  dataSourceSpecBinding {
    settlementDataProperty
    tradingTerminationProperty
  }
}
    ${DataSourceFragmentDoc}`;
export const PerpetualFragmentDoc = gql`
    fragment Perpetual on Perpetual {
  quoteName
  settlementAsset {
    id
    symbol
    name
    decimals
    quantum
  }
  dataSourceSpecForSettlementData {
    ...DataSource
  }
  dataSourceSpecForSettlementSchedule {
    ...DataSource
  }
  dataSourceSpecBinding {
    settlementDataProperty
    settlementScheduleProperty
  }
}
    ${DataSourceFragmentDoc}`;
export const MarketInfoDocument = gql`
    query MarketInfo($marketId: ID!) {
  market(id: $marketId) {
    id
    decimalPlaces
    positionDecimalPlaces
    state
    tradingMode
    linearSlippageFactor
    quadraticSlippageFactor
    proposal {
      id
      rationale {
        title
        description
      }
    }
    marketTimestamps {
      open
      close
    }
    openingAuction {
      durationSecs
      volume
    }
    accountsConnection {
      edges {
        node {
          type
          asset {
            id
          }
          balance
        }
      }
    }
    fees {
      factors {
        makerFee
        infrastructureFee
        liquidityFee
      }
    }
    priceMonitoringSettings {
      parameters {
        triggers {
          horizonSecs
          probability
          auctionExtensionSecs
        }
      }
    }
    riskFactors {
      market
      short
      long
    }
    liquidityMonitoringParameters {
      triggeringRatio
      targetStakeParameters {
        timeWindow
        scalingFactor
      }
    }
    liquiditySLAParameters {
      priceRange
      commitmentMinTimeFraction
      performanceHysteresisEpochs
      slaCompetitionFactor
    }
    tradableInstrument {
      instrument {
        id
        name
        code
        metadata {
          tags
        }
        product {
          ... on Future {
            ...Future
          }
          ... on Perpetual {
            ...Perpetual
          }
        }
      }
      riskModel {
        ... on LogNormalRiskModel {
          tau
          riskAversionParameter
          params {
            r
            sigma
            mu
          }
        }
        ... on SimpleRiskModel {
          params {
            factorLong
            factorShort
          }
        }
      }
      marginCalculator {
        scalingFactors {
          searchLevel
          initialMargin
          collateralRelease
        }
      }
    }
  }
}
    ${FutureFragmentDoc}
${PerpetualFragmentDoc}`;

/**
 * __useMarketInfoQuery__
 *
 * To run a query within a React component, call `useMarketInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useMarketInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMarketInfoQuery({
 *   variables: {
 *      marketId: // value for 'marketId'
 *   },
 * });
 */
export function useMarketInfoQuery(baseOptions: Apollo.QueryHookOptions<MarketInfoQuery, MarketInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MarketInfoQuery, MarketInfoQueryVariables>(MarketInfoDocument, options);
      }
export function useMarketInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MarketInfoQuery, MarketInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MarketInfoQuery, MarketInfoQueryVariables>(MarketInfoDocument, options);
        }
export type MarketInfoQueryHookResult = ReturnType<typeof useMarketInfoQuery>;
export type MarketInfoLazyQueryHookResult = ReturnType<typeof useMarketInfoLazyQuery>;
export type MarketInfoQueryResult = Apollo.QueryResult<MarketInfoQuery, MarketInfoQueryVariables>;