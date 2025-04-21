import { Button } from '@heroui/react';
import { env } from 'next-runtime-env';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { Icon } from '~/view/base/icon';
import { usePlanContext } from '../plan-context';
import { PricePlanWithDescription } from '../price-plan-with-description';

interface Props {
  className?: string;
}

export const PremiumPlan: React.FC<Props> = ({ className }) => {
  const { plan, goToPanel } = usePlanContext();

  const planName = env('NEXT_PUBLIC_PLAN_PREMIUM_NAME')!;
  const planCost = env('NEXT_PUBLIC_PLAN_PREMIUM_COST')!;
  const maxCommunity = env('NEXT_PUBLIC_PLAN_PREMIUM_MAX_COMMUNITY');
  const maxProperty = env('NEXT_PUBLIC_PLAN_PREMIUM_MAX_PROPERTY');

  const SwitchPlan = React.useCallback(() => {
    if (plan == null) {
      return null;
    } else if (plan.isLoading) {
      return <Button isLoading />;
    } else if (plan.isActive) {
      if (plan.paymentType === GQL.PaymentType.Granted) {
        return <Button isDisabled>You are on a custom plan</Button>;
      }
      // Already subscribed to a plan
      return <Button isDisabled>Your current plan</Button>;
    } else {
      return (
        <Button onPress={() => goToPanel('premium')}>
          Upgrade to {planName}
        </Button>
      );
    }
  }, [plan, goToPanel, planName]);

  return (
    <PricePlanWithDescription
      className={className}
      planName={
        <div className="flex items-center gap-1">
          <Icon className="text-yellow-600" icon="premium-plan" width={20} />
          {planName}
        </div>
      }
      planCost={planCost ?? 'n/a'}
      maxCommunity={maxCommunity}
      maxProperty={maxProperty}
      button={<SwitchPlan />}
    />
  );
};
