import {
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Drawer as NextUIDrawer,
  type DrawerProps as NextUIDrawerProps,
} from '@heroui/react';
import React from 'react';

type Drawer = typeof DrawerImpl & {
  Content: typeof DrawerContent;
  Header: typeof DrawerHeader;
  Body: typeof DrawerBody;
  Footer: typeof DrawerFooter;
};

export interface DrawerProps extends NextUIDrawerProps {}

const DrawerImpl = React.forwardRef<HTMLElement, DrawerProps>(
  ({ ...props }, ref) => {
    return <NextUIDrawer ref={ref} {...props} />;
  }
);
DrawerImpl.displayName = 'Drawer';

export const Drawer = DrawerImpl as Drawer;
Drawer.Content = DrawerContent;
Drawer.Header = DrawerHeader;
Drawer.Body = DrawerBody;
Drawer.Footer = DrawerFooter;
