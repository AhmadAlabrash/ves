import {
  Input,
  InputError,
  Loader,
  VegaIcon,
  VegaIconNames,
} from '@vegaprotocol/ui-toolkit';
import type { FieldValues } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import classNames from 'classnames';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import type { ButtonHTMLAttributes, MouseEventHandler } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { RainbowButton } from './buttons';
import { useVegaWallet, useVegaWalletDialogStore } from '@vegaprotocol/wallet';
import { useIsInReferralSet, useReferral } from './hooks/use-referral';
import { Routes } from '../../lib/links';
import { useTransactionEventSubscription } from '@vegaprotocol/web3';
import { Statistics, useStats } from './referral-statistics';
import { useReferralProgram } from './hooks/use-referral-program';
import { ns, useT } from '../../lib/use-t';
import { useFundsAvailable } from './hooks/use-funds-available';
import { ViewType, useSidebar } from '../../components/sidebar';
import { useGetCurrentRouteId } from '../../lib/hooks/use-get-current-route-id';
import { QUSDTooltip } from './qusd-tooltip';
import { Trans } from 'react-i18next';

const RELOAD_DELAY = 3000;

const SPAM_PROTECTION_ERR = 'SPAM_PROTECTION_ERR';
const SpamProtectionErr = ({
  requiredFunds,
}: {
  requiredFunds?: string | number | bigint;
}) => {
  if (!requiredFunds) return null;
  // eslint-disable-next-line react/jsx-no-undef
  return (
    <Trans
      defaults="To protect the network from spam, you must have at least {{requiredFunds}} <0>qUSD</0> of any asset on the network to proceed."
      values={{
        requiredFunds,
      }}
      components={[<QUSDTooltip key="qusd" />]}
      ns={ns}
    />
  );
};

const validateCode = (value: string, t: ReturnType<typeof useT>) => {
  const number = +`0x${value}`;
  if (!value || value.length !== 64) {
    return t('Code must be 64 characters in length');
  } else if (Number.isNaN(number)) {
    return t('Code must be be valid hex');
  }
  return true;
};

export const ApplyCodeFormContainer = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const { pubKey } = useVegaWallet();
  const isInReferralSet = useIsInReferralSet(pubKey);

  // Navigate to the index page when already in the referral set.
  if (isInReferralSet) {
    return <Navigate to={Routes.REFERRALS} />;
  }

  return <ApplyCodeForm onSuccess={onSuccess} />;
};

export const ApplyCodeForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const t = useT();
  const program = useReferralProgram();
  const navigate = useNavigate();
  const openWalletDialog = useVegaWalletDialogStore(
    (store) => store.openVegaWalletDialog
  );

  const [status, setStatus] = useState<
    'requested' | 'no-funds' | 'successful' | null
  >(null);
  const txHash = useRef<string | null>(null);
  const { isReadOnly, pubKey, sendTx } = useVegaWallet();
  const { isEligible, requiredFunds } = useFundsAvailable();

  const currentRouteId = useGetCurrentRouteId();
  const setViews = useSidebar((s) => s.setViews);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    watch,
  } = useForm();
  const [params] = useSearchParams();

  const codeField = watch('code');
  const { data: previewData, loading: previewLoading } = useReferral({
    code: validateCode(codeField, t) ? codeField : undefined,
  });

  /**
   * Validates if a connected party can apply a code (min funds span protection)
   */
  const validateFundsAvailable = useCallback(() => {
    if (requiredFunds && !isEligible) {
      const err = SPAM_PROTECTION_ERR;
      return err;
    }
    return true;
  }, [isEligible, requiredFunds]);

  /**
   * Validates the set a user tries to apply to.
   */
  const validateSet = useCallback(() => {
    if (
      codeField &&
      !previewLoading &&
      previewData &&
      !previewData.isEligible
    ) {
      return t('The code is no longer valid.');
    }
    if (codeField && !previewLoading && !previewData) {
      return t('The code is invalid');
    }
    return true;
  }, [codeField, previewData, previewLoading, t]);

  useEffect(() => {
    const code = params.get('code');
    if (code) setValue('code', code);
  }, [params, setValue]);

  useEffect(() => {
    const err = validateFundsAvailable();
    if (err !== true) {
      setStatus('no-funds');
    } else {
      setStatus(null);
    }
  }, [isEligible, validateFundsAvailable]);

  const onSubmit = ({ code }: FieldValues) => {
    if (isReadOnly || !pubKey || !code || code.length === 0) {
      return;
    }

    setStatus('requested');

    sendTx(pubKey, {
      applyReferralCode: {
        id: code as string,
      },
    })
      .then((res) => {
        if (!res) {
          setError('code', {
            type: 'required',
            message: t('The transaction could not be sent'),
          });
        }
        if (res) {
          txHash.current = res.transactionHash.toLowerCase();
        }
      })
      .catch((err) => {
        if (err.message.includes('user rejected')) {
          setStatus(null);
        } else {
          setStatus(null);
          setError('code', {
            type: 'required',
            message:
              err instanceof Error
                ? err.message
                : t('Your code has been rejected'),
          });
        }
      });
  };

  useTransactionEventSubscription({
    variables: { partyId: pubKey || '' },
    skip: !pubKey,
    fetchPolicy: 'no-cache',
    onData: ({ data: result }) =>
      result.data?.busEvents?.forEach((event) => {
        if (event.event.__typename === 'TransactionResult') {
          const hash = event.event.hash.toLowerCase();
          if (txHash.current && txHash.current === hash) {
            const err = event.event.error;
            const status = event.event.status;
            if (err) {
              setStatus(null);
              setError('code', {
                type: 'required',
                message: err,
              });
            }
            if (status && !err) {
              setStatus('successful');
            }
          }
        }
      }),
  });

  const { epochsValue, nextBenefitTierValue } = useStats({ program });

  // go to main page when successfully applied
  useEffect(() => {
    if (status === 'successful') {
      setTimeout(() => {
        if (onSuccess) onSuccess();
        navigate(Routes.REFERRALS);
      }, RELOAD_DELAY);
    }
  }, [navigate, onSuccess, status]);

  // show "code applied" message when successfully applied
  if (status === 'successful') {
    return (
      <div className="mx-auto w-1/2">
        <h3 className="calt mb-5 flex flex-row items-center justify-center gap-2 text-center text-xl uppercase">
          <span className="text-vega-green-500">
            <VegaIcon name={VegaIconNames.TICK} size={20} />
          </span>{' '}
          <span className="pt-1">{t('Code applied')}</span>
        </h3>
      </div>
    );
  }

  const getButtonProps = () => {
    if (!pubKey) {
      return {
        disabled: false,
        children: t('Connect wallet'),
        type: 'button' as ButtonHTMLAttributes<HTMLButtonElement>['type'],
        onClick: ((event) => {
          event.preventDefault();
          openWalletDialog();
        }) as MouseEventHandler,
      };
    }

    if (isReadOnly) {
      return {
        disabled: true,
        children: t('Apply a code'),
        type: 'submit' as ButtonHTMLAttributes<HTMLButtonElement>['type'],
      };
    }

    if (status === 'no-funds') {
      return {
        disabled: false,
        children: t('Deposit funds'),
        type: 'button' as ButtonHTMLAttributes<HTMLButtonElement>['type'],
        onClick: ((event) => {
          event.preventDefault();
          setViews({ type: ViewType.Deposit }, currentRouteId);
        }) as MouseEventHandler,
      };
    }

    if (status === 'requested') {
      return {
        disabled: true,
        children: t('Confirm in wallet...'),
        type: 'submit' as ButtonHTMLAttributes<HTMLButtonElement>['type'],
      };
    }

    return {
      disabled: false,
      children: t('Apply a code'),
      type: 'submit' as ButtonHTMLAttributes<HTMLButtonElement>['type'],
    };
  };

  const nextBenefitTierEpochsValue = nextBenefitTierValue
    ? nextBenefitTierValue.epochs - epochsValue
    : 0;

  return (
    <>
      <div
        data-testid="referral-apply-code-form"
        className="bg-vega-clight-800 dark:bg-vega-cdark-800 mx-auto w-2/3 max-w-md rounded-lg p-8"
      >
        <h3 className="calt mb-4 text-center text-2xl">
          {t('Apply a referral code')}
        </h3>
        <p className="mb-4 text-center text-base">
          {t(
            'Apply a referral code to access the discount benefits of the current program.'
          )}
        </p>
        <form
          className={classNames('flex w-full flex-col gap-4', {
            'animate-shake': Boolean(errors.code),
          })}
          onSubmit={handleSubmit(onSubmit)}
        >
          <label>
            <span className="sr-only">{t('Your referral code')}</span>
            <Input
              hasError={Boolean(errors.code)}
              {...register('code', {
                required: t('You have to provide a code to apply it.'),
                validate: (value) => {
                  const codeErr = validateCode(value, t);
                  if (codeErr !== true) return codeErr;
                  const fundsErr = validateFundsAvailable();
                  if (fundsErr !== true) return fundsErr;
                  return validateSet();
                },
              })}
              placeholder="Enter a code"
              className="bg-vega-clight-900 dark:bg-vega-cdark-700 mb-2"
            />
          </label>
          <RainbowButton variant="border" {...getButtonProps()} />
        </form>
        {status === 'no-funds' ? (
          <InputError intent="warning" className="overflow-auto break-words">
            <span>
              <SpamProtectionErr requiredFunds={requiredFunds?.toString()} />
            </span>
          </InputError>
        ) : (
          errors.code && (
            <InputError intent="warning" className="overflow-auto break-words">
              {errors.code.message === SPAM_PROTECTION_ERR ? (
                <span>
                  <SpamProtectionErr
                    requiredFunds={requiredFunds?.toString()}
                  />
                </span>
              ) : (
                errors.code.message?.toString()
              )}
            </InputError>
          )
        )}
      </div>
      {validateCode(codeField, t) === true && previewLoading && !previewData ? (
        <div className="mt-10">
          <Loader />
        </div>
      ) : null}
      {/* TODO: Re-check plural forms once i18n is updated */}
      {previewData && previewData.isEligible ? (
        <div className="mt-10">
          <h2 className="mb-5 text-2xl">
            {t(
              'youAreJoiningTheGroup',
              'You are joining the group shown, but will not have access to benefits until you have completed at least {{count}} epochs.',
              { count: nextBenefitTierEpochsValue }
            )}
          </h2>
          <Statistics data={previewData} program={program} as="referee" />
        </div>
      ) : null}
    </>
  );
};
