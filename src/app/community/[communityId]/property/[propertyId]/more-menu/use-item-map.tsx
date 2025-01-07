import React from 'react';
import { useItemMap as useBaseItemMap } from '~/community/[communityId]/more-menu/use-item-map';
import { type MenuItemEntry } from '~/view/header';
import { usePageContext } from '../page-context';

/** Configure all possible menu items */
export function useItemMap() {
  const {
    community,
    occupantEditor,
    propertyModify,
    membershipEditor,
    propertyDelete,
  } = usePageContext();
  const baseItemMap = useBaseItemMap({ communityId: community.id });

  const itemMap = React.useMemo(() => {
    const result = new Map<string, MenuItemEntry>(baseItemMap);

    result.set('membershipEditor', {
      key: 'membershipEditor',
      onPress: membershipEditor.disclosure.onOpen,
      children: 'Edit Membership Info',
    });

    result.set('occupantEditor', {
      key: 'occupantEditor',
      onPress: occupantEditor.disclosure.onOpen,
      children: 'Edit Member Details',
      showDivider: true,
    });

    result.set('modifyProperty', {
      key: 'modifyProperty',
      onPress: propertyModify.disclosure.onOpen,
      children: 'Modify Property',
    });

    result.set('deleteProperty', {
      key: 'deleteProperty',
      className: 'text-danger',
      onPress: propertyDelete.disclosure.onOpen,
      children: 'Delete Property',
    });

    return result;
  }, [
    baseItemMap,
    occupantEditor,
    propertyModify,
    membershipEditor,
    propertyDelete,
  ]);

  return itemMap;
}
