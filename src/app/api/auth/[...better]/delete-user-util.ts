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
  const accessList = await prisma.access.findMany({
    where: {
      userId,
      role: 'ADMIN',
      community: {
        NOT: [{ ownerId: userId }],
        accessList: {
          // No other users have admin priviledge to this community
          none: {
            role: 'ADMIN',
            userId: { not: userId },
          },
        },
      },
    },
    include: {
      community: true,
    },
  });

  const communityList = accessList.map(({ community }) => community);
  return communityList;
}

export async function performUserDelete(userId: string) {
  /**
   * Delete the user
   *
   * Prisma will cascade deletion to all referencing entities, like any
   * Community, Property and Access documents that this user owns
   */
  await prisma.user.delete({ where: { id: userId } });
}
