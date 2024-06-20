import { type Context } from '~/graphql/context';
import { getCommunityEntry } from '~/graphql/schema/community/util';

/**
 * Get property list for a given community from database
 *
 * @param user context user performing search
 * @param communityId community shortID
 * @returns
 */
export async function communityData(
  user: Context['user'],
  communityId: string
) {
  const data = await getCommunityEntry(user, communityId, {
    include: {
      propertyList: {
        include: {
          updatedBy: true,
        },
      },
    },
  });
  return data;
}

/**
 * Data type returned from communityData
 */
export type Community = Awaited<ReturnType<typeof communityData>>;
export type Property = Community['propertyList'][0];
