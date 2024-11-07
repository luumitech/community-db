import { GraphQLError } from 'graphql';
import { userRef } from '~/graphql/schema/user/object';
import { env } from '~/lib/env-cfg';
import { getHelcimSubscriptionEntry } from './helcim/util';
import type { SubscriptionEntry } from './object';

/**
 * Get detail information on user's subscription entry
 *
 * @param user Prisma user document
 * @returns
 */
export async function getSubscriptionEntry(
  user: typeof userRef.$inferType
): Promise<SubscriptionEntry | null> {
  const { subscription } = user;
  if (subscription == null) {
    return null;
  }
  const { paymentType } = subscription;
  switch (paymentType) {
    case 'GRANTED':
      return {
        paymentType: 'GRANTED',
        id: 'granted-1',
        status: 'active',
        dateActivated: '',
        dateBilling: '',
        recurringAmount: env().NEXT_PUBLIC_PLAN_COST,
      };

    case 'HELCIM': {
      const entry = await getHelcimSubscriptionEntry(user);
      return entry;
    }

    default:
      throw new GraphQLError(`Unrecognized payment type ${paymentType}`);
  }
}
