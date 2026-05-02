import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { PleaseConfigurePaymentMethods } from '~/community/[communityId]/layout-util/render-select';
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

  const emptyContent = React.useMemo(() => {
    return <PleaseConfigurePaymentMethods communityId={communityId} />;
  }, [communityId]);

  return (
    <div className={className}>
      <Select
        className="max-w-xs min-w-32"
        aria-label="Transaction Total Payment Method"
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
