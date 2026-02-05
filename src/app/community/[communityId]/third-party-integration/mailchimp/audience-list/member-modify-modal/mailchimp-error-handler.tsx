import { ApolloError } from '@apollo/client';
import * as R from 'remeda';

interface MailchimpError {
  field: string;
  message: string;
}

/**
 * This function returns all mailchimp errors array content stored in
 * ApolloError
 *
 * Mailchimp can provide errors in the errors array like this: See:
 * ~/lib/mailchimp/resource/resource.ts
 *
 * ```jsonc
 * [
 *   {
 *     field: 'email address',
 *     message:
 *       'This member\'s status is "cleaned." You can only update email addresses for members with a status of "subscribed."',
 *   },
 * ];
 * ```
 *
 * @param err Error object from graphQL
 * @returns A tuple containing:
 *
 *   - An array of MailchimpErrors that are handled by form
 *   - An array of MailchimpErrros that are not handled by form
 */
export function extractMailchimpError(err: ApolloError) {
  const { graphQLErrors } = err;
  const apiErrors = graphQLErrors.flatMap(({ extensions }) => {
    const errors = extensions?.errors as MailchimpError[] | undefined;
    return errors ?? [];
  });
  return R.partition(apiErrors, ({ field }) => field === 'email address');
}
