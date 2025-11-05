import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import {
  PleaseConfigurePaymentMethods,
  renderEmptyResult,
  renderItems,
  renderSections,
} from '~/community/[communityId]/layout-util/render-select';
import { Select, type SelectProps } from '~/view/base/select';

type CustomSelectProps = Omit<
  SelectProps,
  'controlName' | 'items' | 'children'
>;

interface Props extends CustomSelectProps {
  className?: string;
  controlNamePrefix: string;
  includeHiddenFields?: boolean;
}

export const PaymentSelect: React.FC<Props> = ({
  className,
  controlNamePrefix,
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
    <div className={className}>
      <Select
        className="min-w-32 max-w-xs"
        controlName={`${controlNamePrefix}.paymentMethod`}
        // This is being controlled by the transaction total payment select
        isControlled
        aria-label="Payment Method"
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
