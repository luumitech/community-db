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
}

export const PropertyCard: React.FC<Props> = ({
  className,
  property,
  children,
  ...props
}) => {
  const yearsToShow = useMemberYear();

  return (
    <Card shadow="sm" classNames={{ base: twMerge(className) }} {...props}>
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
            <Membership
              key={`${property.id}-${year}`}
              fragment={property}
              year={year}
            />
          ))}
          {children}
        </div>
      </CardBody>
    </Card>
  );
};
