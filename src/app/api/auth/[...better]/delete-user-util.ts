import { Community } from '@prisma/client';
import prisma from '~/lib/prisma';

/**
 * Find list of communities where:
 *
 * - You are not the owner
 * - But you are the sole administrator
 *
 * For these communities, you need to give administrator role to others before
 * you can remove your user account, otherwise, no one will be able to
 * administer the community after the user account is removed
 *
 * @param userId User ID to be deleted
 * @returns List of communities
 */
export async function communityNonOwnerSoleAdministrator(
  userId: string
): Promise<Community[]> {
  /**
   * Find list of communities where you have admin access but are not the owner
   * of the community
   *
   * For these communities, you need to give administrator role to others before
   * you can remove your user account
   */
  const accessList = await prisma.access.findMany({
    where: {
      userId,
      role: 'ADMIN',
      community: {
        NOT: [{ ownerId: userId }],
      },
    },
    include: {
      community: {
        include: {
          accessList: true,
        },
      },
    },
  });
  const communityList = accessList
    .map(({ community }) => community)
    .filter((community) => {
      // Only return communities where you are the sole administrator
      return community.accessList.some((access) => {
        return access.role !== 'ADMIN' && access.userId !== userId;
      });
    });

  return communityList;
}

export async function performUserDelete(userId: string) {}
