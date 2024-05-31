import prisma from '~/lib/prisma';

/**
 * Get property list for a given community from database
 *
 * @param communityId community ID
 * @param ctxEmail context email
 * @returns
 */
export async function communityData(communityId: string, ctxEmail: string) {
  const data = await prisma.community.findUniqueOrThrow({
    where: {
      id: communityId,
      OR: [
        {
          accessList: {
            some: {
              user: {
                email: ctxEmail,
              },
            },
          },
        },
      ],
    },
    include: {
      propertyList: true,
    },
  });
  return data;
}

/**
 * Data type returned from communityData
 */
export type Community = Awaited<ReturnType<typeof communityData>>;
export type Property = Community['propertyList'][0];
