import { cn } from '@heroui/react';
import React from 'react';
import { NumericFormat, type NumericFormatProps } from 'react-number-format';
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from '~/custom-hooks/hook-form';
import { mergeRefs } from '~/custom-hooks/merge-ref';
import { PlainInput, type PlainInputProps } from '~/view/base/input';

export { SelectItem, SelectSection } from '@heroui/react';

type CustomNumericFormatProps = Omit<NumericFormatProps, ''>;
type CustomInputProps = Omit<PlainInputProps, keyof CustomNumericFormatProps>;

export interface CurrencyInputProps<P extends FieldValues = FieldValues>
  extends CustomNumericFormatProps, CustomInputProps {
  controlName: Path<P>;
  /**
   * Force component into a controlled component, useful if you need setValue to
   * work properly
   */
  isControlled?: boolean;
}

export const CurrencyInput = React.forwardRef(
  <P extends FieldValues = FieldValues>(
    {
      classNames,
      controlName,
      isControlled,
      onBlur,
      onChange,
      ...props
    }: CurrencyInputProps<P>,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const { control } = useFormContext<P>();

    return (
      <Controller
        control={control}
        name={controlName}
        render={({ field, fieldState }) => (
          <NumericFormat
            ref={mergeRefs(field.ref, ref)}
            classNames={{
              ...classNames,
              // Render readonly field by removing all input decoration
              base: cn(
                classNames?.base,
                // Enough space for $99.99
                'min-w-20'
              ),
            }}
            // @ts-expect-error conflicting arg 'size' between PlainInput and NumericFormat
            customInput={PlainInput}
            {...(isControlled
              ? { value: field.value ?? '' }
              : { defaultValue: field.value ?? '' })}
            onBlur={(evt) => {
              field.onBlur();
              onBlur?.(evt);
            }}
            onChange={(evt) => {
              field.onChange(evt);
              onChange?.(evt);
            }}
            errorMessage={fieldState.error?.message}
            isInvalid={fieldState.invalid}
            thousandSeparator=","
            decimalSeparator="."
            decimalScale={2}
            fixedDecimalScale
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-sm text-foreground/60">$</span>
              </div>
            }
            onKeyDown={(e) => {
              // Prevent Enter key inside input from submitting form
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
            {...props}
          />
        )}
      />
    );
  }
) as (<P extends FieldValues>(
  props: CurrencyInputProps<P> & {
    ref?: React.ForwardedRef<HTMLInputElement>;
  }
) => React.ReactElement) & { displayName?: string };

CurrencyInput.displayName = 'CurrencyInput';

/**
 * A component factory that takes the FieldValues as generic to produce a
 * component that would provide type assistance to controlName property
 */
export function createCurrencyInput<P extends FieldValues>() {
  type Props = CurrencyInputProps<P>;

  const component = CurrencyInput as (
    props: Props & { ref?: React.ForwardedRef<HTMLInputElement> }
  ) => React.ReactElement;

  return component;
}
