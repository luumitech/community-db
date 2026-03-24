import { Drawer } from '@heroui/react';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { useGridStackContext } from '~/view/base/grid-stack';
import { type WidgetId } from '../widget-definition';
import { ConfigForm, type DrawerArg } from './config-form';
import { DrawerButton } from './drawer-button';

const useDrawerControl = useDisclosureWithArg<DrawerArg>;

interface Props {
  widgetIdsShown: WidgetId[];
  setWidgets: (idList: WidgetId[]) => void;
}

export const ConfigDrawer: React.FC<Props> = ({
  widgetIdsShown,
  setWidgets,
}) => {
  const { arg, disclosure, open } = useDrawerControl();
  const { isOpen, onOpenChange } = disclosure;
  const { grid } = useGridStackContext();

  const openDrawer = React.useCallback(() => {
    if (grid) {
      open({ grid });
    }
  }, [grid, open]);

  return (
    <>
      <DrawerButton onOpen={openDrawer} />
      {arg != null && grid != null && (
        <Drawer isOpen={isOpen} placement="left" onOpenChange={onOpenChange}>
          <ConfigForm
            {...arg}
            disclosure={disclosure}
            widgetIdsShown={widgetIdsShown}
            setWidgets={setWidgets}
          />
        </Drawer>
      )}
    </>
  );
};
