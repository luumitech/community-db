import { type Membership } from '@prisma/client';

export interface Property {
  membershipList: Pick<Membership, 'paymentMethod'>[];
}

/**
 * Process property list and extract ALL payment methods from all membership
 * information
 */
export function extractPaymentMethodList(propertyList: Property[]): string[] {
  const methodSet = new Set<string>();

  const membershipList = propertyList.flatMap((entry) => entry.membershipList);
  membershipList.forEach((entry) => {
    if (entry.paymentMethod) {
      methodSet.add(entry.paymentMethod);
    }
  });

  return [...methodSet];
}
