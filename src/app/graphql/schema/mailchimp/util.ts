import { GraphQLError } from 'graphql';
import { getCommunityEntry } from '~/graphql/schema/community/util';
import { type ContextUser } from '~/lib/context-user';
import { MailchimpApi } from '~/lib/mailchimp';

/**
 * Get mailchimp API instance using the API key stored in user setting
 *
 * @param user Context user performing search
 * @param communityId Community shortID
 * @returns Mailchimp API
 */
export async function getMailchimpApi(user: ContextUser, communityId: string) {
  const entry = await getCommunityEntry(user, communityId, {
    select: {
      mailchimpSetting: true,
    },
  });
  if (!entry.mailchimpSetting?.apiKey) {
    throw new GraphQLError(`Mailchimp API key not provided`);
  }
  const api = MailchimpApi.fromEncryptedApiKey(entry.mailchimpSetting.apiKey);
  return api;
}
