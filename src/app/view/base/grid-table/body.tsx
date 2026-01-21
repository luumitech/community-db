import { Card, CardBody, cn, type CardProps } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import { CLASS_DEFAULT, COMMON_PROPS } from './_config';
import type { CommonProps, ItemRenderer, ItemWithId } from './_type';

interface Props<ItemT extends ItemWithId> extends CardProps, CommonProps {
  item: ItemT;
  renderItem: ItemRenderer<string, ItemT>;
}

export function Body<ItemT extends ItemWithId>(props: Props<ItemT>) {
  const { item, renderItem, ...otherProps } = props;
  const commonProps = R.pick(props, COMMON_PROPS);
  const cardProps = R.omit(otherProps, COMMON_PROPS);
  const { config, columnKeys, columnConfig } = commonProps;

  return (
    <Card
      classNames={{
        base: twMerge(
          CLASS_DEFAULT.inheritContainer,
          CLASS_DEFAULT.commonContainer,
          CLASS_DEFAULT.bodyContainer,
          config?.commonContainer,
          config?.bodyContainer
        ),
      }}
      role="row"
      shadow="sm"
      {...cardProps}
    >
      <CardBody
        className={twMerge(
          // Override default padding in CardBody
          'p-0',
          CLASS_DEFAULT.inheritContainer,
          CLASS_DEFAULT.bodyGrid,
          config?.bodyGrid
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
