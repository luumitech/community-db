import { useMutation } from '@apollo/client';
import { Button, ButtonProps } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';

const HelcimCancelSubscription = graphql(/* GraphQL */ `
  mutation helcimCancelSubscription {
    helcimCancelSubscription {
      id
      subscription {
        id
        paymentType
        status
      }
    }
  }
`);

interface Props extends ButtonProps {
  className?: string;
  /** Called when subscription has been successfully cancelled */
  onSuccess?: () => void;
}

export const CancelSubscriptionButton: React.FC<Props> = ({
  className,
  onSuccess,
  ...buttonProps
}) => {
  const [cancelSub, cancelSubResult] = useMutation(HelcimCancelSubscription, {
    update: (cache, result) => {
      if (result.data?.helcimCancelSubscription.subscription) {
        const subId = result.data.helcimCancelSubscription.subscription.id;
        evictCache(cache, 'Subscription', subId);
      }
    },
  });

  const cancel = React.useCallback(async () => {
    try {
      const result = await cancelSub();
      onSuccess?.();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  }, [cancelSub, onSuccess]);

  return (
    <Button
      className={className}
      onPress={cancel}
      isLoading={cancelSubResult.loading}
      {...buttonProps}
    />
  );
};
