import { useHookFormContext } from './use-hook-form';

/**
 * Provide membership related information, helpful for rendering the membership
 * registration editor
 */
export function useMembershipUtil() {
  const { watch, getValues } = useHookFormContext();
  const canPayMembership = getValues('hidden.canPayMembership');
  const hasMembershipInPreviousTransaction = getValues(
    'hidden.hasMembershipInPreviousTransaction'
  );
  const isMember = watch('membership.isMember');

  /** Does the membership Fee entry exist in the current transaction */
  const hasMembershipEntry = canPayMembership && !!isMember;

  return {
    canPayMembership,
    hasMembershipEntry,
    hasMembershipInPreviousTransaction,
  };
}
