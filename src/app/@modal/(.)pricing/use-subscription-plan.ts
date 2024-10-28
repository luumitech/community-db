'use client';
import { useQuery } from '@apollo/client';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import type { SubscriptionPlan } from './_type';

const UserSubscriptionQuery = graphql(/* GraphQL */ `
  query userSubscription {
    userCurrent {
      id
      subscription {
        id
        status
        dateActivated
        dateBilling
        recurringAmount
      }
    }
  }
`);

export function useSubscriptionPlan() {
  const result = useQuery(UserSubscriptionQuery, {
    fetchPolicy: 'cache-and-network',
  });
  useGraphqlErrorHandler(result);

  const subPlan = React.useMemo<SubscriptionPlan | undefined>(() => {
    if (result.loading) {
      return;
    }

    const plan = result.data?.userCurrent.subscription;
    if (!plan) {
      return {
        isActive: false,
        recurringAmount: '0',
      };
    }

    return {
      isActive: plan.status === 'active',
      recurringAmount: plan.recurringAmount.toString(),
      nextBillingDate: plan.dateBilling,
    };
  }, [result]);

  return subPlan;
}
