import { cn } from '@heroui/react';
import React from 'react';
import { OccupantEntry } from '../_type';

interface Props {
  className?: string;
  entry: OccupantEntry;
}

export const ContactName: React.FC<Props> = ({ className, entry }) => {
  const { firstName, lastName } = entry;
  return (
    <div
      className={cn(
        /**
         * Bold the name in small media size, so it's easier to differentiate
         * between rows
         */
        'font-semibold sm:font-normal'
      )}
    >
      {firstName} {lastName}
    </div>
  );
};
