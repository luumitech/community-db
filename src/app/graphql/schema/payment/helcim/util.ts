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
  const { paymentType } = subscription;
  if (paymentType !== 'HELCIM') {
    return null;
  }

  // Helcim expects subscription ID to be numeric
  const subscriptionId = parseInt(subscription.subscriptionId, 10);

  try {
    const api = await HelcimApi.fromConfig();
    const subResult = await api.subscriptions.getSingle({ subscriptionId });
    return {
      ...subResult.data,
      id: `helcim-${subscriptionId}`,
      paymentType,
    };
  } catch (err) {
    // Unable to find subscription entry
    return null;
  }
}
