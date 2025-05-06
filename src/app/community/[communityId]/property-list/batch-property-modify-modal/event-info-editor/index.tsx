import { ScrollShadow, cn } from '@heroui/react';
import React from 'react';
import { useHookFormContext } from '../use-hook-form';
import { EventRow, EventRowHeader } from './event-row';

interface Props {
  className?: string;
}

export const EventInfoEditor: React.FC<Props> = ({ className }) => {
  const { watch } = useHookFormContext();
  const memberYear = watch('membership.year');

  const Keyword = ({ children }: React.PropsWithChildren) => (
    <span className="font-semibold text-foreground-500">{children}</span>
  );

  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <ScrollShadow className="overflow-y-hidden" orientation="horizontal">
        <div className={cn('grid grid-cols-[repeat(2,1fr)_80px]', 'gap-2')}>
          <EventRowHeader />
          <EventRow />
        </div>
      </ScrollShadow>
      <figure className="text-sm">
        <figcaption className="font-semibold">NOTE:</figcaption>
        <ul className="list-disc pl-8">
          <li>
            <Keyword>Membership Fee</Keyword> will only be applied to properties
            that do not have an existing membership in year {memberYear}.
          </li>
          <li>
            If a property has a <Keyword>Membership Fee</Keyword> entry, but
            does not have <Keyword>Price</Keyword> information specified, the
            record will be updated with the new <Keyword>Price</Keyword>{' '}
            information.
          </li>
        </ul>
      </figure>
    </div>
  );
};
