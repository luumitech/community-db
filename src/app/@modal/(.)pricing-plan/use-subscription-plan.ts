'use client';
import { useQuery } from '@apollo/client';
import React from 'react';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import type { SubscriptionPlan } from './_type';

const UserSubscriptionQuery = graphql(/* GraphQL */ `
  query userSubscription {
    userCurrent {
      id
      subscription {
        id
        paymentType
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

  const subPlan = React.useMemo<SubscriptionPlan | undefined>(() => {
    if (result.error) {
      return;
    }

    const plan = result.data?.userCurrent.subscription;
    if (!plan) {
      return {
        isLoading: result.loading,
        paymentType: GQL.PaymentType.None,
        isActive: false,
        recurringAmount: '0',
      };
    }

    return {
      isLoading: false,
      paymentType: plan.paymentType,
      isActive: plan.status !== GQL.SubscriptionStatus.Inactive,
      recurringAmount: plan.recurringAmount.toString(),
      nextBillingDate: plan.dateBilling,
    };
  }, [result]);

  return subPlan;
}
