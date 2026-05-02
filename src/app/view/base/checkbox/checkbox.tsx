import {
  Checkbox as NextUICheckbox,
  type CheckboxProps as NextUICheckboxProps,
} from '@heroui/react';
import React from 'react';

export interface CheckboxProps extends NextUICheckboxProps {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ ...props }, ref) => {
    return <NextUICheckbox ref={ref} {...props} />;
  }
);

Checkbox.displayName = 'Checkbox';
