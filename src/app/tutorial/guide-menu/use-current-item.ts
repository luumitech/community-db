import { usePathname } from 'next/navigation';
import React from 'react';
import { GUIDE_ITEMS } from './guide-items';

/** Return currently selected item base on URL route */
export function useCurrentItem() {
  const pathname = usePathname();

  const selectedItem = React.useMemo(() => {
    const selected = GUIDE_ITEMS.find((item) => item.path === pathname);
    return selected ?? GUIDE_ITEMS[0];
  }, [pathname]);

  return selectedItem;
}
