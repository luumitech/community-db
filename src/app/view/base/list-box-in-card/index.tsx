'use client';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Skeleton,
  cn,
} from '@heroui/react';
import React from 'react';
import {
  ListBox,
  type ListBoxItemProps,
  type ListBoxProps,
} from '~/view/base/list-box';

export type { ListBoxItemProps } from '~/view/base/list-box';

interface Props extends Omit<ListBoxProps, 'ref' | 'children'> {
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  items: ListBoxItemProps[];
  loading?: boolean;
}

export const ListBoxInCard: React.FC<Props> = ({
  className,
  header,
  footer,
  items,
  loading,
  ...listBoxProps
}) => {
  return (
    <Card className={cn(className)}>
      {!!header && (
        <>
          <CardHeader className="text-lg">{header}</CardHeader>
          <Divider />
        </>
      )}
      <CardBody>
        <Skeleton className="rounded-lg" isLoaded={!loading}>
          <ListBox aria-label="main menu" {...listBoxProps}>
            {items.map(({ key, ...itemProps }) => (
              <ListBox.Item key={key} {...itemProps} />
            ))}
          </ListBox>
        </Skeleton>
      </CardBody>
      {!!footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};
