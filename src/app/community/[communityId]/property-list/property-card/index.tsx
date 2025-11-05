import { Card, CardBody, cn, type CardProps } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import type { PropertyEntry } from '../_type';
import { Membership } from './membership';
import { Occupant } from './occupant';
import { PropertyAddress } from './property-address';
import { useMemberYear } from './use-member-year';

// variable name must be `className` for tailwindcss intellisense to work
const className = {
  container: cn(
    'grid gap-2',
    'grid-cols-[repeat(3,1fr),_max-content]',
    'sm:grid-cols-[repeat(6,1fr),_max-content]'
  ),
  inheritContainer: 'col-span-full grid grid-cols-subgrid gap-1',
  address: 'col-span-3 sm:col-span-2',
  member: 'col-span-3 sm:col-span-4',
  // Always last column
  memberYear: 'row-start-1 -col-start-1',
};

interface ContainerProps {
  className?: string;
}

const Container: React.FC<React.PropsWithChildren<ContainerProps>> = ({
  ...props
}) => {
  return (
    <div {...props} className={twMerge(className.container, props.className)} />
  );
};

interface EntryProps extends Omit<CardProps, 'property'> {
  className?: string;
  property: PropertyEntry;
  /** Show header row showing membership year status */
  showHeader?: boolean;
}

const Entry: React.FC<EntryProps> = ({
  property,
  showHeader,
  children,
  ...props
}) => {
  const yearsToShow = useMemberYear();

  return (
    <Card
      {...props}
      classNames={{
        base: twMerge(className.inheritContainer, props.className),
      }}
      role="row"
      shadow="sm"
    >
      <CardBody className={twMerge('items-start', className.inheritContainer)}>
        <PropertyAddress className={className.address} fragment={property} />
        <Occupant className={className.member} fragment={property} />
        <div
          className={twMerge(
            className.memberYear,
            'grid grid-flow-col grid-rows-[auto_1fr]',
            showHeader ? 'row-span-2 grid-rows-[auto_1fr]' : 'grid-rows-1',
            'items-center gap-2'
          )}
        >
          {yearsToShow.map((year) => (
            <React.Fragment key={`${property.id}-${year}`}>
              {showHeader && (
                <span className="whitespace-nowrap text-xs text-default-400">
                  {year}
                </span>
              )}
              <Membership fragment={property} year={year} />
            </React.Fragment>
          ))}
          {children}
        </div>
      </CardBody>
    </Card>
  );
};

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ ...props }) => {
  const yearsToShow = useMemberYear();

  return (
    <Card
      className={twMerge(
        'bg-default-200/50',
        className.inheritContainer,
        props.className
      )}
      role="rowheader"
      shadow="none"
      radius="sm"
    >
      <CardBody
        className={twMerge('items-center py-2', className.inheritContainer)}
      >
        <div
          className={twMerge(
            'text-sm font-semibold text-default-500',
            className.address
          )}
        >
          Address
        </div>
        <div
          className={twMerge(
            'text-sm font-semibold text-default-500',
            className.member
          )}
        />
        <div
          className={twMerge(
            className.memberYear,
            'grid grid-cols-2',
            'items-center gap-2'
          )}
        >
          {yearsToShow.map((year) => (
            <span key={year} className="m-auto text-xs text-default-400">
              {year}
            </span>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export const PropertyCard = {
  Container,
  Header,
  Entry,
};
