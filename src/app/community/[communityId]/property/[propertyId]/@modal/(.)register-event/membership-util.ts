import { useHookFormContext } from './use-hook-form';

/**
 * Provide membership related information, helpful for rendering the membership
 * registration editor
 */
export function useMembershipUtil() {
  const { watch, getValues } = useHookFormContext();
  const canPayMembership = getValues('hidden.canPayMembership');
  const existingMembership = getValues('hidden.existingMembership');
  const isMember = watch('membership.isMember');

  /** Does the membership Fee entry exist in the current transaction */
  const hasMembershipEntry = canPayMembership && !!isMember;

  return {
    /**
     * Should the current transaction allow adding or editing membership fee
     * information
     */
    canPayMembership,
    /**
     * Does the current transaction has an membership fee entry. This is useful
     * for deteriming if the total amount should include membership fee
     */
    hasMembershipEntry,
    /** Show membership information in previous transaction section */
    existingMembership,
  };
}
