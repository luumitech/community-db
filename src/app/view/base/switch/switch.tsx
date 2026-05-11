import React from 'react';
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from '~/custom-hooks/hook-form';
import { mergeRefs } from '~/custom-hooks/merge-ref';
import { PlainSwitch, type PlainSwitchProps } from './plain-switch';

export interface SwitchProps<
  P extends FieldValues = FieldValues,
> extends PlainSwitchProps {
  controlName: Path<P>;
  /**
   * Force component into a controlled component, useful if you need setValue to
   * work properly
   */
  isControlled?: boolean;
}

export const Switch = React.forwardRef(
  <P extends FieldValues = FieldValues>(
    { controlName, isControlled, onBlur, onChange, ...props }: SwitchProps<P>,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const { control } = useFormContext<P>();

    return (
      <Controller
        control={control}
        name={controlName}
        render={({ field, fieldState }) => (
          <PlainSwitch
            ref={mergeRefs(field.ref, ref)}
            {...(isControlled
              ? { isSelected: field.value ?? false }
              : { defaultSelected: field.value ?? false })}
            onBlur={(evt) => {
              field.onBlur();
              onBlur?.(evt);
            }}
            onChange={(evt) => {
              field.onChange(evt);
              onChange?.(evt);
            }}
            {...props}
          />
        )}
      />
    );
  }
) as (<P extends FieldValues>(
  props: SwitchProps<P> & {
    ref?: React.ForwardedRef<HTMLInputElement>;
  }
) => React.ReactElement) & { displayName?: string };

Switch.displayName = 'Switch';

/**
 * A component factory that takes the FieldValues as generic to produce a
 * component that would provide type assistance to controlName property
 */
export function createSwitch<P extends FieldValues>() {
  type Props = SwitchProps<P>;

  const component = Switch as (
    props: Props & { ref?: React.ForwardedRef<HTMLInputElement> }
  ) => React.ReactElement;

  return component;
}
