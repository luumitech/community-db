'use client';
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Listbox,
  ListboxItem,
  ListboxItemProps,
  ListboxProps,
  Skeleton,
} from '@heroui/react';
import clsx from 'clsx';
import React from 'react';

export { type ListboxItemProps } from '@heroui/react';

interface Props extends Omit<ListboxProps, 'children'> {
  className?: string;
  header?: string;
  items: ListboxItemProps[];
  loading?: boolean;
}

export const ListBox: React.FC<Props> = ({
  className,
  header,
  items,
  loading,
  ...listBoxProps
}) => {
  return (
    <div
      className={clsx(className, 'flex flex-row justify-center items-center')}
    >
      <Card className="w-80 md:w-96">
        {!!header && (
          <>
            <CardHeader>
              <p className="text-lg">{header}</p>
            </CardHeader>
            <Divider />
          </>
        )}
        <CardBody>
          {loading ? (
            <Skeleton className="rounded-lg">
              <div className="h-8 rounded-lg bg-default-300" />
            </Skeleton>
          ) : (
            <Listbox aria-label="main menu" {...listBoxProps}>
              {items.map(({ key, ...itemProps }) => (
                <ListboxItem key={key} {...itemProps} />
              ))}
            </Listbox>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
