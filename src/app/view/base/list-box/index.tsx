'use client';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Listbox,
  ListboxItem,
  ListboxItemProps,
  ListboxProps,
  Skeleton,
  cn,
} from '@heroui/react';
import React from 'react';

export { type ListboxItemProps } from '@heroui/react';

interface Props extends Omit<ListboxProps, 'children'> {
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  items: ListboxItemProps[];
  loading?: boolean;
}

export const ListBox: React.FC<Props> = ({
  className,
  header,
  footer,
  items,
  loading,
  ...listBoxProps
}) => {
  return (
    <div className={cn(className, 'flex flex-row justify-center items-center')}>
      <Card className="w-80 md:w-96">
        {!!header && (
          <>
            <CardHeader className="text-lg">{header}</CardHeader>
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
        {!!footer && <CardFooter>{footer}</CardFooter>}
      </Card>
    </div>
  );
};
