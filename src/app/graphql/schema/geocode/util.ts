import { GraphQLError } from 'graphql';
import { getCommunityEntry } from '~/graphql/schema/community/util';
import { type ContextUser } from '~/lib/context-user';
import { GeoapifyApi } from '~/lib/geoapify-api';

/**
 * Get geoapify API instance using the API key stored in user setting
 *
 * @param user Context user performing search
 * @param communityId Community shortID
 * @returns Geoapify API
 */
export async function getGeoapifyApi(user: ContextUser, communityId: string) {
  const entry = await getCommunityEntry(user, communityId, {
    select: {
      geoapifySetting: true,
    },
  });
  if (!entry.geoapifySetting?.apiKey) {
    throw new GraphQLError(`Geoapify API key not provided`);
  }
  const api = GeoapifyApi.fromEncryptedApiKey(entry.geoapifySetting.apiKey);
  return api;
}
