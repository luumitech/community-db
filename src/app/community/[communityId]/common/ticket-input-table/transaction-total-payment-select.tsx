import {
  Select,
  SelectItem,
  SelectSection,
  type SelectProps,
} from '@heroui/react';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';

type CustomSelectProps = Omit<SelectProps, 'items' | 'children'>;

interface Props extends CustomSelectProps {
  className?: string;
  includeHiddenFields?: boolean;
}

export const TransactionTotalPaymentSelect: React.FC<Props> = ({
  className,
  includeHiddenFields,
  ...props
}) => {
  const { selectPaymentMethodSections, visiblePaymentMethods } =
    useAppContext();

  const items = includeHiddenFields
    ? selectPaymentMethodSections
    : [{ title: '', items: visiblePaymentMethods, showDivider: false }];

  return (
    <div className={clsx(className)}>
      <Select
        className="min-w-32 max-w-xs"
        aria-label="Transaction Total Payment Method"
        items={items}
        variant="underlined"
        selectionMode="single"
        {...props}
      >
        {(section) => (
          <SelectSection
            key={section.title}
            title={section.title}
            items={section.items}
            showDivider={section.showDivider}
          >
            {(item) => (
              <SelectItem key={item.value} textValue={item.label}>
                {item.label}
              </SelectItem>
            )}
          </SelectSection>
        )}
      </Select>
    </div>
  );
};
