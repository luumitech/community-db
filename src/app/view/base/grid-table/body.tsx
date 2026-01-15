import { Card, CardBody, cn, type CardProps } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { CLASS_DEFAULT } from './_config';
import type { CommonProps, ItemRenderer, ItemWithId } from './_type';

interface Props<ItemT extends ItemWithId> extends CardProps, CommonProps {
  item: ItemT;
  renderItem: ItemRenderer<string, ItemT>;
}

export function Body<ItemT extends ItemWithId>(_props: Props<ItemT>) {
  const {
    config,
    columnKeys,
    columnConfig,
    item,
    renderItem,
    children,
    ...props
  } = _props;

  return (
    <Card
      {...props}
      classNames={{
        base: twMerge(CLASS_DEFAULT.inheritContainer),
      }}
      role="row"
      shadow="sm"
    >
      <CardBody
        className={twMerge(
          'items-start',
          CLASS_DEFAULT.inheritContainer,
          CLASS_DEFAULT.commonContainer,
          CLASS_DEFAULT.bodyContainer,
          config?.commonContainer,
          config?.bodyContainer
        )}
      >
        {columnKeys.map((key) => (
          <div
            key={`${key}-${item.id}`}
            className={twMerge(columnConfig?.[key])}
          >
            {renderItem(key, item)}
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
