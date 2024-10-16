import * as GQL from '~/graphql/generated/graphql';

export type SubscriptionPlan =
  GQL.UserSubscriptionQuery['userCurrent']['subscription'];
