import type { PropertyEntry } from './_type';

export type Property = Pick<PropertyEntry, 'membershipList'>;

/**
 * Process property list and extract ALL payment methods from all membership
 * information
 */
export function extractPaymentMethodList(propertyList: Property[]): string[] {
  const methodSet = new Set<string>();

  propertyList.forEach((property) => {
    property.membershipList.forEach((membership) => {
      if (membership.paymentMethod) {
        methodSet.add(membership.paymentMethod);
      }
    });
  });

  return [...methodSet];
}
