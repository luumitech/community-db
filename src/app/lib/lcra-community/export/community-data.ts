import prisma from '~/lib/prisma';

/**
 * Get property list for a given community from database
 *
 * @param communityId community ID
 * @param email context email
 * @returns
 */
export async function communityData(communityId: string, email: string) {
  const data = await prisma.community.findUniqueOrThrow({
    where: {
      id: communityId,
      accessList: {
        some: {
          user: { email },
        },
      },
    },
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
