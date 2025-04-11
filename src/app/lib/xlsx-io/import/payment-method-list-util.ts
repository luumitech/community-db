import type { PropertyEntry } from './_type';

/**
 * Process property list and extract ALL payment methods from all membership
 * information
 */
export function extractPaymentMethodList(
  propertyList: PropertyEntry[]
): string[] {
  const methodSet = new Set<string>();

  const membershipList = propertyList.flatMap((entry) => entry.membershipList);
  membershipList.forEach((entry) => {
    if (entry.paymentMethod) {
      methodSet.add(entry.paymentMethod);
    }
  });

  return [...methodSet];
}
