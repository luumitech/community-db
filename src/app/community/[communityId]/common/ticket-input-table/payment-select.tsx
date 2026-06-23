import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { PleaseConfigurePaymentMethods } from '~/community/[communityId]/layout-util/render-select';
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

  const emptyContent = React.useMemo(() => {
    return <PleaseConfigurePaymentMethods communityId={communityId} />;
  }, [communityId]);

  return (
    <div className={className}>
      <Select
        className="max-w-xs min-w-32"
        controlName={`${controlNamePrefix}.paymentMethod`}
        aria-label="Payment Method"
        variant="underlined"
        selectionMode="single"
        {...(includeHiddenFields
          ? { sections: selectPaymentMethodSections }
          : { items: visiblePaymentMethods })}
        emptyContent={emptyContent}
        {...props}
      />
    </div>
  );
};
