import classNames from 'classnames';

import type { VegaIconNames } from './vega-icon-record';
import { VegaIconNameMap } from './vega-icon-record';

export interface VegaIconProps {
  name: VegaIconNames;
  size?: 8 | 10 | 12 | 13 | 14 | 16 | 18 | 20 | 24 | 28 | 32;
}

export const VegaIcon = ({ size = 16, name }: VegaIconProps) => {
  const effectiveClassName = classNames(
    'inline-block',
    'align-text-bottom',
    'fill-current stroke-none'
  );
  const Element = VegaIconNameMap[name];
  return (
    <span className={effectiveClassName} data-testid={`icon-${name}`}>
      <Element size={size} />
    </span>
  );
};
