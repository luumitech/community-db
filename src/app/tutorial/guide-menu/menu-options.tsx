import React from 'react';
import { ListBox } from '~/view/base/list-box';
import { GUIDE_ITEMS, type GuideItem } from './guide-items';
import { useCurrentItem } from './use-current-item';

interface Props {
  className?: string;
  onSelect?: (item: GuideItem) => void;
}

export const MenuOptions: React.FC<Props> = ({ className, onSelect }) => {
  const selectedItem = useCurrentItem();

  return (
    <ListBox
      className={className}
      aria-label="Tutorial options"
      selectionMode="single"
      selectedKeys={[selectedItem.key]}
      hideSelectedIcon
    >
      {GUIDE_ITEMS.map((item) => (
        <ListBox.Item
          classNames={{
            base: 'data-[selected=true]:bg-default',
          }}
          href={item.path}
          key={item.key}
          onPress={() => onSelect?.(item)}
        >
          {item.label}
        </ListBox.Item>
      ))}
    </ListBox>
  );
};
