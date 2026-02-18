import { Card, CardBody, cn, type CardProps } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import { CLASS_DEFAULT, COMMON_PROPS } from '../_config';
import type { CommonProps, ItemRenderer, ItemWithId } from '../_type';

/** Properties in BodyContainerProps */
export const BODY_CONTAINER_PROPS = ['renderItem'] as const;

export interface BodyContainerProps<
  ColumnKey extends Readonly<string>,
  ItemT extends ItemWithId,
> {
  renderItem: ItemRenderer<ColumnKey, ItemT>;
}

interface Props<ColumnKey extends Readonly<string>, ItemT extends ItemWithId>
  extends
    CardProps,
    BodyContainerProps<ColumnKey, ItemT>,
    CommonProps<ColumnKey> {
  item: ItemT;
}

export function BodyContainer<
  ColumnKey extends Readonly<string>,
  ItemT extends ItemWithId,
>(props: Props<ColumnKey, ItemT>) {
  const { item, ...otherProps } = props;
  const bodyContainerProps = R.pick(props, BODY_CONTAINER_PROPS);
  const commonProps = R.pick(props, COMMON_PROPS);
  const cardProps = R.omit(otherProps, [
    ...COMMON_PROPS,
    ...BODY_CONTAINER_PROPS,
  ]);
  const { config, columnKeys, columnConfig } = commonProps;
  const { renderItem } = bodyContainerProps;

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
