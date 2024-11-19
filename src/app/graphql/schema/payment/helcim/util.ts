import { userRef } from '~/graphql/schema/user/object';
import { HelcimApi } from '~/lib/helcim-api';
import type { SubscriptionEntry } from '../object';

/**
 * Get information on user's subscription entry
 *
 * @param user Prisma user document
 * @returns
 */
export async function getHelcimSubscriptionEntry(
  user: typeof userRef.$inferType
): Promise<SubscriptionEntry | null> {
  const { subscription } = user;
  if (subscription == null) {
    return null;
  }
  const { paymentType, subscriptionId: subIdStr } = subscription;
  if (paymentType !== 'HELCIM' || subIdStr == null) {
    return null;
  }

  // Helcim expects subscription ID to be numeric
  const subscriptionId = parseInt(subIdStr, 10);

  try {
    const api = await HelcimApi.fromConfig();
    const subResult = await api.subscriptions.getSingle({ subscriptionId });
    const { status, ...subData } = subResult.data;

    let subStatus: SubscriptionEntry['status'];
    switch (status) {
      case 'active':
        subStatus = 'ACTIVE';
        break;

      case 'cancelled':
        /**
         * TODO: Need to check dateBilling to see if subscription is currently
         * active, if no dateBilling is already passed, the subscription status
         * should be inactive
         */
        subStatus = 'CANCELLED';
        break;

      case 'paused':
      default:
        subStatus = 'INACTIVE';
    }
    return {
      paymentType,
      subscriptionId: subIdStr,
      status: subStatus,
      ...subData,
    };
  } catch (err) {
    // Unable to find subscription entry
    return null;
  }
}
