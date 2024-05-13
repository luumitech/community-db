import React from 'react';
import { IoCheckmark } from 'react-icons/io5';
import { OccupantEntry } from './_type';

interface Props {
  className?: string;
  entry: OccupantEntry;
}

export const OptOut: React.FC<Props> = ({ className, entry }) => {
  return (
    <div className={className}>
      {!!entry.optOut && <IoCheckmark className="text-xl" />}
    </div>
  );
};
