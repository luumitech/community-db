import { Card, CardBody, cn, type CardProps } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import type { PropertyEntry } from '../_type';
import { Membership } from './membership';
import { Occupant } from './occupant';
import { PropertyAddress } from './property-address';
import { useMemberYear } from './use-member-year';

interface Props extends Omit<CardProps, 'property'> {
  className?: string;
  property: PropertyEntry;
  /** Show header row showing membership year status */
  showHeader?: boolean;
}

export const PropertyCard: React.FC<Props> = ({
  className,
  property,
  showHeader,
  children,
  ...props
}) => {
  const yearsToShow = useMemberYear();

  return (
    <Card
      classNames={{ base: twMerge(className) }}
      role="row"
      shadow="sm"
      {...props}
    >
      <CardBody className="flex flex-row gap-2">
        <div className="flex flex-col gap-2">
          <PropertyAddress fragment={property} />
          <Occupant fragment={property} />
        </div>
        <div className="grow" />
        <div
          className={cn(
            'grid grid-flow-col grid-rows-[auto_1fr]',
            'items-center gap-2'
          )}
        >
          {yearsToShow.map((year) => (
            <React.Fragment key={`${property.id}-${year}`}>
              <span
                className={cn('text-xs text-default-400', {
                  'invisible h-0': !showHeader,
                })}
              >
                {year}
              </span>
              <Membership fragment={property} year={year} />
            </React.Fragment>
          ))}
          {children}
        </div>
      </CardBody>
    </Card>
  );
};

export const PropertyCardHeader: React.FC<unknown> = () => {
  const yearsToShow = useMemberYear();

  return (
    <Card className="mx-0.5 bg-default-200/50" shadow="none" radius="sm">
      <CardBody className="flex flex-row gap-2 py-2">
        <div className="grow text-sm font-semibold text-default-500">
          Address
        </div>
        <div className={cn('grid grid-flow-col', 'items-center gap-2')}>
          {yearsToShow.map((year) => (
            <span key={year} className="text-xs text-default-400">
              {year}
            </span>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
