import { GraphQLError } from 'graphql';
import { userRef } from '~/graphql/schema/user/object';
import { env } from '~/lib/env-cfg';
import prisma from '~/lib/prisma';
import { getHelcimSubscriptionEntry } from './helcim/util';
import type { SubscriptionEntry } from './object';

interface ApplicationConfig {
  /** Maximum number of community to display */
  communityLimit?: number;
  /** Maximum number of property to display */
  propertyLimit?: number;
}

const GRANTED_PLAN: SubscriptionEntry & ApplicationConfig = {
  paymentType: 'GRANTED',
  status: 'ACTIVE',
  dateActivated: '',
  dateBilling: '',
  recurringAmount: 0,
  // No limits
  /** Maximum number of communities one can create */
  communityLimit: undefined,
  /** Maximum number of properties one can create */
  propertyLimit: undefined,
};

/** Default configuration when client has not paid for subscription */
const DEFAULT_APP_CONFIG: ApplicationConfig = {
  communityLimit: 2,
  propertyLimit: 10,
};

/**
 * Get detail information on user's subscription entry
 *
 * @param user Prisma user document
 * @returns Detail subscription information
 */
export async function getSubscriptionEntry(
  user: typeof userRef.$inferType
): Promise<SubscriptionEntry & ApplicationConfig> {
  const { subscription } = user;
  const { paymentType } = subscription ?? {};

  /**
   * When Subscription Plan is disabled in the app, allow client use of full
   * capability
   */
  if (!env.NEXT_PUBLIC_PLAN_ENABLE) {
    return GRANTED_PLAN;
  }

  switch (paymentType) {
    case 'GRANTED':
      return GRANTED_PLAN;

    case 'HELCIM': {
      const subEntry = await getHelcimSubscriptionEntry(user);
      if (subEntry) {
        return {
          ...subEntry,
          ...(subEntry.status === 'INACTIVE'
            ? DEFAULT_APP_CONFIG
            : {
                communityLimit: 5,
                propertyLimit: undefined,
              }),
        };
      }
    }
  }

  // No subscription plan
  return {
    paymentType: 'NONE',
    status: 'INACTIVE',
    dateActivated: '',
    dateBilling: '',
    recurringAmount: 0,
    ...DEFAULT_APP_CONFIG,
  };
}

/**
 * Get detail information on user's subscription entry (by userId)
 *
 * @param userId UserId to lookup
 * @returns Detail subscription information
 */
export async function getCommunityOwnerSubscriptionEntry(
  communityId: string
): Promise<SubscriptionEntry & ApplicationConfig> {
  const communityDoc = await prisma.community.findUniqueOrThrow({
    where: { id: communityId },
    select: { owner: true },
  });
  const subPlan = await getSubscriptionEntry(communityDoc.owner);
  return subPlan;
}
