import {
  Switch as NextUISwitch,
  type SwitchProps as NextUISwitchProps,
} from '@heroui/react';
import React from 'react';

export interface PlainSwitchProps extends NextUISwitchProps {}

export const PlainSwitch = React.forwardRef<HTMLInputElement, PlainSwitchProps>(
  ({ ...props }, ref) => {
    return <NextUISwitch ref={ref} {...props} />;
  }
);

PlainSwitch.displayName = 'PlainSwitch';
