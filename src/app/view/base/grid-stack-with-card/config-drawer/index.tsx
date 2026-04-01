import { Drawer } from '@heroui/react';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { useGridStackContext } from '~/view/base/grid-stack';
import type { WidgetInfo } from '../_type';
import { ConfigForm, type DrawerArg } from './config-form';
import { DrawerButton } from './drawer-button';

const useDrawerControl = useDisclosureWithArg<DrawerArg>;

interface Props {
  widgetInfo: Record<string, WidgetInfo>;
}

export const ConfigDrawer: React.FC<Props> = ({ widgetInfo }) => {
  const { arg, disclosure, open } = useDrawerControl();
  const { isOpen, onOpenChange } = disclosure;
  const { grid } = useGridStackContext();

  const openDrawer = React.useCallback(() => {
    if (grid) {
      open({ grid, widgetInfo });
    }
  }, [grid, open, widgetInfo]);

  return (
    <>
      <div className="mb-2 flex items-center justify-center">
        <DrawerButton onOpen={openDrawer} />
      </div>
      {arg != null && grid != null && (
        <Drawer isOpen={isOpen} placement="bottom" onOpenChange={onOpenChange}>
          <ConfigForm {...arg} disclosure={disclosure} />
        </Drawer>
      )}
    </>
  );
};
