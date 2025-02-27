import * as Types from '@vegaprotocol/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type NewMarketProductFieldsFragment = { __typename?: 'Proposal', terms: { __typename?: 'ProposalTerms', change: { __typename?: 'CancelTransfer' } | { __typename?: 'NewAsset' } | { __typename?: 'NewFreeform' } | { __typename?: 'NewMarket', instrument: { __typename?: 'InstrumentConfiguration', product?: { __typename: 'FutureProduct' } | { __typename: 'PerpetualProduct' } | { __typename: 'SpotProduct' } | null } } | { __typename?: 'NewSpotMarket' } | { __typename?: 'NewTransfer' } | { __typename?: 'UpdateAsset' } | { __typename?: 'UpdateMarket' } | { __typename?: 'UpdateMarketState' } | { __typename?: 'UpdateNetworkParameter' } | { __typename?: 'UpdateReferralProgram' } | { __typename?: 'UpdateSpotMarket' } | { __typename?: 'UpdateVolumeDiscountProgram' } } };

export type UpdateMarketStatesFragment = { __typename?: 'Proposal', terms: { __typename?: 'ProposalTerms', change: { __typename?: 'CancelTransfer' } | { __typename?: 'NewAsset' } | { __typename?: 'NewFreeform' } | { __typename?: 'NewMarket' } | { __typename?: 'NewSpotMarket' } | { __typename?: 'NewTransfer' } | { __typename?: 'UpdateAsset' } | { __typename?: 'UpdateMarket' } | { __typename?: 'UpdateMarketState', updateType: Types.MarketUpdateType, price?: string | null, market: { __typename?: 'Market', decimalPlaces: number, id: string, tradableInstrument: { __typename?: 'TradableInstrument', instrument: { __typename?: 'Instrument', name: string, code: string, product: { __typename: 'Future', quoteName: string } | { __typename: 'Perpetual', quoteName: string } | { __typename: 'Spot' } } } } } | { __typename?: 'UpdateNetworkParameter' } | { __typename?: 'UpdateReferralProgram' } | { __typename?: 'UpdateSpotMarket' } | { __typename?: 'UpdateVolumeDiscountProgram' } } };

export type UpdateReferralProgramsFragment = { __typename?: 'Proposal', terms: { __typename?: 'ProposalTerms', change: { __typename?: 'CancelTransfer' } | { __typename?: 'NewAsset' } | { __typename?: 'NewFreeform' } | { __typename?: 'NewMarket' } | { __typename?: 'NewSpotMarket' } | { __typename?: 'NewTransfer' } | { __typename?: 'UpdateAsset' } | { __typename?: 'UpdateMarket' } | { __typename?: 'UpdateMarketState' } | { __typename?: 'UpdateNetworkParameter' } | { __typename?: 'UpdateReferralProgram', windowLength: number, endOfProgram: any, benefitTiers: Array<{ __typename?: 'BenefitTier', minimumEpochs: number, minimumRunningNotionalTakerVolume: string, referralDiscountFactor: string, referralRewardFactor: string }>, stakingTiers: Array<{ __typename?: 'StakingTier', minimumStakedTokens: string, referralRewardMultiplier: string }> } | { __typename?: 'UpdateSpotMarket' } | { __typename?: 'UpdateVolumeDiscountProgram' } } };

export type UpdateVolumeDiscountProgramsFragment = { __typename?: 'Proposal', terms: { __typename?: 'ProposalTerms', change: { __typename?: 'CancelTransfer' } | { __typename?: 'NewAsset' } | { __typename?: 'NewFreeform' } | { __typename?: 'NewMarket' } | { __typename?: 'NewSpotMarket' } | { __typename?: 'NewTransfer' } | { __typename?: 'UpdateAsset' } | { __typename?: 'UpdateMarket' } | { __typename?: 'UpdateMarketState' } | { __typename?: 'UpdateNetworkParameter' } | { __typename?: 'UpdateReferralProgram' } | { __typename?: 'UpdateSpotMarket' } | { __typename?: 'UpdateVolumeDiscountProgram', endOfProgramTimestamp: any, windowLength: number, benefitTiers: Array<{ __typename?: 'VolumeBenefitTier', minimumRunningNotionalTakerVolume: string, volumeDiscountFactor: string }> } } };

export type ProposalFieldsFragment = { __typename?: 'Proposal', id?: string | null, reference: string, state: Types.ProposalState, datetime: any, rejectionReason?: Types.ProposalRejectionReason | null, errorDetails?: string | null, rationale: { __typename?: 'ProposalRationale', title: string, description: string }, party: { __typename?: 'Party', id: string }, terms: { __typename?: 'ProposalTerms', closingDatetime: any, enactmentDatetime?: any | null, change: { __typename?: 'CancelTransfer' } | { __typename: 'NewAsset', name: string, symbol: string, decimals: number, quantum: string, source: { __typename?: 'BuiltinAsset', maxFaucetAmountMint: string } | { __typename?: 'ERC20', contractAddress: string, withdrawThreshold: string, lifetimeLimit: string } } | { __typename?: 'NewFreeform' } | { __typename?: 'NewMarket', instrument: { __typename?: 'InstrumentConfiguration', name: string, code: string, product?: { __typename?: 'FutureProduct', settlementAsset: { __typename?: 'Asset', symbol: string } } | { __typename?: 'PerpetualProduct', settlementAsset: { __typename?: 'Asset', symbol: string } } | { __typename?: 'SpotProduct' } | null } } | { __typename?: 'NewSpotMarket' } | { __typename?: 'NewTransfer' } | { __typename?: 'UpdateAsset', quantum: string, assetId: string, source: { __typename?: 'UpdateERC20', lifetimeLimit: string, withdrawThreshold: string } } | { __typename?: 'UpdateMarket', marketId: string } | { __typename?: 'UpdateMarketState' } | { __typename?: 'UpdateNetworkParameter', networkParameter: { __typename?: 'NetworkParameter', key: string, value: string } } | { __typename?: 'UpdateReferralProgram' } | { __typename?: 'UpdateSpotMarket' } | { __typename?: 'UpdateVolumeDiscountProgram' } }, votes: { __typename?: 'ProposalVotes', yes: { __typename?: 'ProposalVoteSide', totalTokens: string, totalNumber: string, totalEquityLikeShareWeight: string }, no: { __typename?: 'ProposalVoteSide', totalTokens: string, totalNumber: string, totalEquityLikeShareWeight: string } } };

export type ProposalsQueryVariables = Types.Exact<{
  includeNewMarketProductFields: Types.Scalars['Boolean'];
  includeUpdateMarketStates: Types.Scalars['Boolean'];
  includeUpdateReferralPrograms: Types.Scalars['Boolean'];
}>;


export type ProposalsQuery = { __typename?: 'Query', proposalsConnection?: { __typename?: 'ProposalsConnection', edges?: Array<{ __typename?: 'ProposalEdge', node: { __typename?: 'Proposal', id?: string | null, reference: string, state: Types.ProposalState, datetime: any, rejectionReason?: Types.ProposalRejectionReason | null, errorDetails?: string | null, rationale: { __typename?: 'ProposalRationale', title: string, description: string }, party: { __typename?: 'Party', id: string }, terms: { __typename?: 'ProposalTerms', closingDatetime: any, enactmentDatetime?: any | null, change: { __typename?: 'CancelTransfer' } | { __typename: 'NewAsset', name: string, symbol: string, decimals: number, quantum: string, source: { __typename?: 'BuiltinAsset', maxFaucetAmountMint: string } | { __typename?: 'ERC20', contractAddress: string, withdrawThreshold: string, lifetimeLimit: string } } | { __typename?: 'NewFreeform' } | { __typename?: 'NewMarket', instrument: { __typename?: 'InstrumentConfiguration', name: string, code: string, product?: { __typename: 'FutureProduct', settlementAsset: { __typename?: 'Asset', symbol: string } } | { __typename: 'PerpetualProduct', settlementAsset: { __typename?: 'Asset', symbol: string } } | { __typename: 'SpotProduct' } | null } } | { __typename?: 'NewSpotMarket' } | { __typename?: 'NewTransfer' } | { __typename?: 'UpdateAsset', quantum: string, assetId: string, source: { __typename?: 'UpdateERC20', lifetimeLimit: string, withdrawThreshold: string } } | { __typename?: 'UpdateMarket', marketId: string } | { __typename?: 'UpdateMarketState', updateType: Types.MarketUpdateType, price?: string | null, market: { __typename?: 'Market', decimalPlaces: number, id: string, tradableInstrument: { __typename?: 'TradableInstrument', instrument: { __typename?: 'Instrument', name: string, code: string, product: { __typename: 'Future', quoteName: string } | { __typename: 'Perpetual', quoteName: string } | { __typename: 'Spot' } } } } } | { __typename?: 'UpdateNetworkParameter', networkParameter: { __typename?: 'NetworkParameter', key: string, value: string } } | { __typename?: 'UpdateReferralProgram', windowLength: number, endOfProgram: any, benefitTiers: Array<{ __typename?: 'BenefitTier', minimumEpochs: number, minimumRunningNotionalTakerVolume: string, referralDiscountFactor: string, referralRewardFactor: string }>, stakingTiers: Array<{ __typename?: 'StakingTier', minimumStakedTokens: string, referralRewardMultiplier: string }> } | { __typename?: 'UpdateSpotMarket' } | { __typename?: 'UpdateVolumeDiscountProgram', endOfProgramTimestamp: any, windowLength: number, benefitTiers: Array<{ __typename?: 'VolumeBenefitTier', minimumRunningNotionalTakerVolume: string, volumeDiscountFactor: string }> } }, votes: { __typename?: 'ProposalVotes', yes: { __typename?: 'ProposalVoteSide', totalTokens: string, totalNumber: string, totalEquityLikeShareWeight: string }, no: { __typename?: 'ProposalVoteSide', totalTokens: string, totalNumber: string, totalEquityLikeShareWeight: string } } } } | null> | null } | null };

export const NewMarketProductFieldsFragmentDoc = gql`
    fragment NewMarketProductFields on Proposal {
  terms {
    change {
      ... on NewMarket {
        instrument {
          product {
            __typename
          }
        }
      }
    }
  }
}
    `;
export const UpdateMarketStatesFragmentDoc = gql`
    fragment UpdateMarketStates on Proposal {
  terms {
    change {
      ... on UpdateMarketState {
        updateType
        market {
          decimalPlaces
          id
          tradableInstrument {
            instrument {
              product {
                __typename
                ... on Future {
                  quoteName
                }
                ... on Perpetual {
                  quoteName
                }
              }
              name
              code
            }
          }
        }
        updateType
        price
      }
    }
  }
}
    `;
export const UpdateReferralProgramsFragmentDoc = gql`
    fragment UpdateReferralPrograms on Proposal {
  terms {
    change {
      ... on UpdateReferralProgram {
        benefitTiers {
          minimumEpochs
          minimumRunningNotionalTakerVolume
          referralDiscountFactor
          referralRewardFactor
        }
        endOfProgram: endOfProgramTimestamp
        windowLength
        stakingTiers {
          minimumStakedTokens
          referralRewardMultiplier
        }
      }
    }
  }
}
    `;
export const UpdateVolumeDiscountProgramsFragmentDoc = gql`
    fragment UpdateVolumeDiscountPrograms on Proposal {
  terms {
    change {
      ... on UpdateVolumeDiscountProgram {
        benefitTiers {
          minimumRunningNotionalTakerVolume
          volumeDiscountFactor
        }
        endOfProgramTimestamp
        windowLength
      }
    }
  }
}
    `;
export const ProposalFieldsFragmentDoc = gql`
    fragment ProposalFields on Proposal {
  id
  rationale {
    title
    description
  }
  reference
  state
  datetime
  rejectionReason
  party {
    id
  }
  errorDetails
  terms {
    closingDatetime
    enactmentDatetime
    change {
      ... on NewMarket {
        instrument {
          name
          code
          product {
            ... on FutureProduct {
              settlementAsset {
                symbol
              }
            }
            ... on PerpetualProduct {
              settlementAsset {
                symbol
              }
            }
          }
        }
      }
      ... on UpdateMarket {
        marketId
      }
      ... on NewAsset {
        __typename
        name
        symbol
        decimals
        quantum
        source {
          ... on BuiltinAsset {
            maxFaucetAmountMint
          }
          ... on ERC20 {
            contractAddress
            withdrawThreshold
            lifetimeLimit
          }
        }
      }
      ... on UpdateNetworkParameter {
        networkParameter {
          key
          value
        }
      }
      ... on UpdateAsset {
        quantum
        assetId
        source {
          ... on UpdateERC20 {
            lifetimeLimit
            withdrawThreshold
          }
        }
      }
    }
  }
  votes {
    yes {
      totalTokens
      totalNumber
      totalEquityLikeShareWeight
    }
    no {
      totalTokens
      totalNumber
      totalEquityLikeShareWeight
    }
  }
}
    `;
export const ProposalsDocument = gql`
    query Proposals($includeNewMarketProductFields: Boolean!, $includeUpdateMarketStates: Boolean!, $includeUpdateReferralPrograms: Boolean!) {
  proposalsConnection {
    edges {
      node {
        ...ProposalFields
        ...NewMarketProductFields @include(if: $includeNewMarketProductFields)
        ...UpdateMarketStates @include(if: $includeUpdateMarketStates)
        ...UpdateReferralPrograms @include(if: $includeUpdateReferralPrograms)
        ...UpdateVolumeDiscountPrograms
      }
    }
  }
}
    ${ProposalFieldsFragmentDoc}
${NewMarketProductFieldsFragmentDoc}
${UpdateMarketStatesFragmentDoc}
${UpdateReferralProgramsFragmentDoc}
${UpdateVolumeDiscountProgramsFragmentDoc}`;

/**
 * __useProposalsQuery__
 *
 * To run a query within a React component, call `useProposalsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProposalsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProposalsQuery({
 *   variables: {
 *      includeNewMarketProductFields: // value for 'includeNewMarketProductFields'
 *      includeUpdateMarketStates: // value for 'includeUpdateMarketStates'
 *      includeUpdateReferralPrograms: // value for 'includeUpdateReferralPrograms'
 *   },
 * });
 */
export function useProposalsQuery(baseOptions: Apollo.QueryHookOptions<ProposalsQuery, ProposalsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProposalsQuery, ProposalsQueryVariables>(ProposalsDocument, options);
      }
export function useProposalsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProposalsQuery, ProposalsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProposalsQuery, ProposalsQueryVariables>(ProposalsDocument, options);
        }
export type ProposalsQueryHookResult = ReturnType<typeof useProposalsQuery>;
export type ProposalsLazyQueryHookResult = ReturnType<typeof useProposalsLazyQuery>;
export type ProposalsQueryResult = Apollo.QueryResult<ProposalsQuery, ProposalsQueryVariables>;