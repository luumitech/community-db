import {
  AutocompleteItem,
  AutocompleteSection,
  Autocomplete as NextUIAutocomplete,
  AutocompleteProps as NextUIAutocompleteProps,
  cn,
} from '@heroui/react';
import React from 'react';

export type { AutocompleteItemProps as ComboBoxItemProps } from '@heroui/react';

type PlainComboBox = typeof PlainComboBoxImpl & {
  Item: typeof AutocompleteItem;
  Section: typeof AutocompleteSection;
};

export interface PlainComboBoxProps<
  T extends object = object,
> extends NextUIAutocompleteProps<T> {}

const PlainComboBoxImpl = React.forwardRef(
  <T extends object>(
    { classNames, ...props }: PlainComboBoxProps<T>,
    ref: React.ForwardedRef<HTMLElement>
  ) => {
    return (
      <NextUIAutocomplete<T>
        ref={ref as NextUIAutocompleteProps<T>['ref']}
        {...props}
      />
    );
  }
) as (<T extends object>(
  props: PlainComboBoxProps<T> & {
    ref?: React.ForwardedRef<HTMLElement>;
  }
) => React.ReactElement) & { displayName?: string };

PlainComboBoxImpl.displayName = 'PlainComboBox';

export const PlainComboBox = PlainComboBoxImpl as PlainComboBox;
PlainComboBox.Item = AutocompleteItem;
PlainComboBox.Section = AutocompleteSection;
