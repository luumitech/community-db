import { cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import {
  PleaseConfigurePaymentMethods,
  renderEmptyResult,
  renderItems,
  renderSections,
} from '~/community/[communityId]/layout-util/render-select';
import { Select, type SelectProps } from '~/view/base/select';

type CustomSelectProps = Omit<SelectProps, 'items' | 'children'>;

export interface Props extends CustomSelectProps {
  className?: string;
  includeHiddenFields?: boolean;
}

export const TransactionTotalPaymentSelect: React.FC<Props> = ({
  className,
  includeHiddenFields,
  ...props
}) => {
  const { communityId, selectPaymentMethodSections, visiblePaymentMethods } =
    useLayoutContext();

  const hasNoItems = React.useMemo(() => {
    return includeHiddenFields
      ? selectPaymentMethodSections.length === 0
      : visiblePaymentMethods.length === 0;
  }, [includeHiddenFields, selectPaymentMethodSections, visiblePaymentMethods]);

  return (
    <div className={cn(className)}>
      <Select
        className="min-w-32 max-w-xs"
        aria-label="Transaction Total Payment Method"
        variant="underlined"
        selectionMode="single"
        {...props}
      >
        <>
          {hasNoItems &&
            renderEmptyResult(
              <PleaseConfigurePaymentMethods communityId={communityId} />
            )}
          {includeHiddenFields
            ? renderSections(selectPaymentMethodSections)
            : renderItems(visiblePaymentMethods)}
        </>
      </Select>
    </div>
  );
};
