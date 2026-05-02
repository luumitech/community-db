'use client';
import { Divider, Skeleton, cn } from '@heroui/react';
import React from 'react';
import { Card } from '~/view/base/card';
import {
  ListBox,
  type ListBoxItemProps,
  type ListBoxProps,
} from '~/view/base/list-box';

export type { ListBoxItemProps } from '~/view/base/list-box';

interface Props extends Omit<ListBoxProps, 'children'> {
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
          <Card.Header className="text-lg">{header}</Card.Header>
          <Divider />
        </>
      )}
      <Card.Body>
        <Skeleton className="rounded-lg" isLoaded={!loading}>
          <ListBox aria-label="main menu" {...listBoxProps}>
            {items.map(({ key, ...itemProps }) => (
              <ListBox.Item key={key} {...itemProps} />
            ))}
          </ListBox>
        </Skeleton>
      </Card.Body>
      {!!footer && <Card.Footer>{footer}</Card.Footer>}
    </Card>
  );
};
