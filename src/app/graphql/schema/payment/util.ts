import { env } from '~/lib/env-cfg';
import { HelcimApi } from '~/lib/helcim-api';
import type { HelcimSubscriptionEntry } from '~/lib/helcim-api/_type';
import { userRef } from '../user/object';

/**
 * Get information on Helcim subscription entry
 *
 * @param subscriptionId Helcim Subscription ID
 * @returns
 */
export async function getSubscriptionEntry(
  user: typeof userRef.$inferType
): Promise<HelcimSubscriptionEntry | null> {
  const { subscriptionId } = user;
  if (subscriptionId == null) {
    return null;
  }
  if (subscriptionId <= 0) {
    return {
      id: subscriptionId,
      status: 'active',
      dateActivated: '',
      dateBilling: '',
      recurringAmount: env().nextPublic.plan.cost,
    } as HelcimSubscriptionEntry;
  }

  try {
    const api = await HelcimApi.fromConfig();
    const subResult = await api.subscriptions.getSingle({ subscriptionId });
    return subResult.data;
  } catch (err) {
    // Unable to find subscription entry
    return null;
  }
}
