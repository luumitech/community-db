import { ScrollShadow } from '@heroui/react';
import clsx from 'clsx';
import React from 'react';
import { useHookFormContext } from '../use-hook-form';
import { EventRow, EventRowHeader } from './event-row';

interface Props {
  className?: string;
}

export const EventInfoEditor: React.FC<Props> = ({ className }) => {
  const { watch } = useHookFormContext();
  const memberYear = watch('membership.year');

  return (
    <div className={clsx(className, 'flex flex-col gap-2')}>
      <ScrollShadow orientation="horizontal" hideScrollBar>
        <div className={clsx('grid grid-cols-[repeat(4,1fr)_80px]', 'gap-2')}>
          <EventRowHeader />
          <EventRow />
        </div>
      </ScrollShadow>
      <p className="text-sm">
        <span className="font-semibold">NOTE:</span> The event{' '}
        <span className="font-semibold text-foreground-500">Price</span> and{' '}
        <span className="font-semibold text-foreground-500">
          Payment Method
        </span>{' '}
        fields are only applicable to properties that do not have an existing
        membership in year {memberYear}.
      </p>
    </div>
  );
};
