import { Listbox, ListboxItem } from '@heroui/react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { GUIDE_ITEMS, type GuideItem } from './guide-items';
import { useCurrentItem } from './use-current-item';

interface Props {
  className?: string;
  onSelect?: (item: GuideItem) => void;
}

export const MenuOptions: React.FC<Props> = ({ className, onSelect }) => {
  const listboxRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const selectedItem = useCurrentItem();

  React.useEffect(() => {
    if (listboxRef.current) {
      /**
       * There is likely a NextUI bug in ListBox, i.e:
       *
       * - Select 2nd entry in the list item
       * - Navigate to default route (i.e. /tutorial)
       * - The first item in the listbox is highlighted, as expected
       * - But the 2nd entry is also highlighted, due to the fact that it retained
       *   the focus css effect. (But clicking elsewhere should have cleared it
       *   already)
       *
       * To mitigate this problem, it's necessary to add additional logic to
       * clear the focus state programmatically.
       */
      listboxRef.current
        .querySelectorAll('a[role="option"]')
        .forEach((elem) => {
          if (elem instanceof HTMLAnchorElement) {
            elem.blur();
          }
        });
    }
  }, [pathname]);

  return (
    <Listbox
      ref={listboxRef}
      className={className}
      aria-label="Tutorial options"
      selectionMode="single"
      selectedKeys={[selectedItem.key]}
      hideSelectedIcon
    >
      {GUIDE_ITEMS.map((item) => (
        <ListboxItem
          classNames={{
            base: 'data-[selected=true]:bg-default',
          }}
          href={item.path}
          key={item.key}
          onPress={() => onSelect?.(item)}
        >
          {item.label}
        </ListboxItem>
      ))}
    </Listbox>
  );
};
