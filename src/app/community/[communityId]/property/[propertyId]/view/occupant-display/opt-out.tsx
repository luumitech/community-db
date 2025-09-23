import React from 'react';
import { Icon } from '~/view/base/icon';
import { OccupantEntry } from './_type';

interface Props {
  className?: string;
  entry: OccupantEntry;
}

export const OptOut: React.FC<Props> = ({ className, entry }) => {
  return (
    <div className={className}>
      {!!entry.optOut && <Icon icon="checkmark" size={18} />}
    </div>
  );
};
