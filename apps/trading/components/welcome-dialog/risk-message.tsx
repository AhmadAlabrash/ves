import { VegaIcon, VegaIconNames } from '@vegaprotocol/ui-toolkit';
import { Link } from 'react-router-dom';
import { Links } from '../../lib/links';
import { useT } from '../../lib/use-t';
import { Trans } from 'react-i18next';

const DisclaimerLink = ({ children }: { children?: string[] }) => (
  <Link className="underline" to={Links.DISCLAIMER()} target="_blank">
    <span className="flex items-center gap-1">
      <span>{children}</span>
      <VegaIcon name={VegaIconNames.OPEN_EXTERNAL} />
    </span>
  </Link>
);

export const RiskMessage = () => {
  const t = useT();
  return (
    <>
      <div className="p-6 mb-6 bg-vega-light-100 dark:bg-vega-dark-100">
        <ul className="list-[square] ml-4">
          <li className="mb-1">
            {t(
              'Conduct your own due diligence and consult your financial advisor before making any investment decisions.'
            )}
          </li>
          <li className="mb-1">
            {t(
              'You may encounter bugs, loss of functionality or loss of assets.'
            )}
          </li>
          <li>
            {t('No party accepts any liability for any losses whatsoever.')}
          </li>
        </ul>
      </div>
      <p className="mb-8">
        <Trans
          defaults="By using the Vega Console, you acknowledge that you have read and understood the <0>Vega Console Disclaimer</0>"
          components={[<DisclaimerLink key="link" />]}
        />
      </p>
    </>
  );
};
