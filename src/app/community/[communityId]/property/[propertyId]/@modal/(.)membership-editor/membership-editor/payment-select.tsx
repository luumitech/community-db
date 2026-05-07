import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { PleaseConfigurePaymentMethods } from '~/community/[communityId]/layout-util/render-select';
import { createSelect, type SelectProps } from '~/view/base/select';
import { type InputData } from '../use-hook-form';

const Select = createSelect<InputData>();

type CustomSelectProps = Omit<
  SelectProps,
  'controlName' | 'items' | 'children'
>;

interface Props extends CustomSelectProps {
  className?: string;
  membershipPrefix: `membershipList.${number}`;
}

export const PaymentSelect: React.FC<Props> = ({
  className,
  membershipPrefix,
}) => {
  const { communityId, visiblePaymentMethods } = useLayoutContext();

  const emptyContent = React.useMemo(() => {
    return <PleaseConfigurePaymentMethods communityId={communityId} />;
  }, [communityId]);

  return (
    <Select
      className={className}
      controlName={`${membershipPrefix}.paymentMethod`}
      label="Payment Method"
      items={visiblePaymentMethods}
      emptyContent={emptyContent}
    />
  );
};
