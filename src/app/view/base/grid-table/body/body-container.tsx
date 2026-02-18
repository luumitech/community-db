import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import { CLASS_DEFAULT, COMMON_PROPS } from '../_config';
import type {
  CommonProps,
  ItemContainerRenderer,
  ItemRenderer,
  ItemWithId,
} from '../_type';

/** Properties in BodyContainerProps */
export const BODY_CONTAINER_PROPS = [
  'renderItemContainer',
  'renderItem',
] as const;

export interface BodyContainerProps<
  ColumnKey extends Readonly<string>,
  ItemT extends ItemWithId,
> {
  /**
   * Optional row container component. By default, it renders a simple div
   * component with minimal styling
   */
  renderItemContainer?: ItemContainerRenderer<ItemT>;
  renderItem: ItemRenderer<ColumnKey, ItemT>;
}

interface Props<ColumnKey extends Readonly<string>, ItemT extends ItemWithId>
  extends BodyContainerProps<ColumnKey, ItemT>, CommonProps<ColumnKey> {
  item: ItemT;
}

export function BodyContainer<
  ColumnKey extends Readonly<string>,
  ItemT extends ItemWithId,
>(props: Props<ColumnKey, ItemT>) {
  const { item } = props;
  const bodyContainerProps = R.pick(props, BODY_CONTAINER_PROPS);
  const commonProps = R.pick(props, COMMON_PROPS);
  const { config, columnKeys, columnConfig } = commonProps;
  const { renderItemContainer, renderItem } = bodyContainerProps;

  const defaultContainer = React.useCallback<ItemContainerRenderer<ItemT>>(
    (_, arg) => <div {...arg} />,
    []
  );

  return (renderItemContainer ?? defaultContainer)(item, {
    className: twMerge(
      CLASS_DEFAULT.inheritContainer,
      CLASS_DEFAULT.commonContainer,
      CLASS_DEFAULT.bodyContainer,
      config?.commonContainer,
      config?.bodyContainer
    ),
    role: 'row',
    children: columnKeys.map((key) => (
      <div key={`${key}-${item.id}`} className={twMerge(columnConfig?.[key])}>
        {renderItem(key, item)}
      </div>
    )),
  });
}
