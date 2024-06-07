'use server';
import { getServerSession } from 'next-auth/next';
import * as R from 'remeda';
import * as XLSX from 'xlsx';
import { authOptions } from '~/api/auth/[...nextauth]/auth-options';
import { importLcraDB } from '~/lib/lcra-community/import';
import prisma from '~/lib/prisma';
import { schema } from './_type';

/**
 * Import community information
 */
export async function importCommunity(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Not authorized');
  }
  const form = await schema.validate({
    communityId: formData.get('communityId'),
    xlsx: formData.get('xlsx'),
  });
  const bytes = await form.xlsx.arrayBuffer();
  const xlsxBuf = Buffer.from(bytes);
  const workbook = XLSX.read(xlsxBuf);
  const { propertyList, eventList } = importLcraDB(workbook);

  const { eventList: existingEventList } =
    await prisma.community.findFirstOrThrow({
      where: { id: form.communityId },
      select: { eventList: true },
    });
  // Only keep existing event list, if imported event list
  // has exact same event (but can be in different order)
  const keepExistingEventList =
    eventList.length === existingEventList.length &&
    R.difference.multiset(existingEventList, eventList).length === 0;

  await prisma.community.update({
    where: { id: form.communityId },
    data: {
      ...(!keepExistingEventList && { eventList }),
      propertyList: {
        // Remove existing property list
        deleteMany: {},
        // Add new imported property list
        createMany: {
          data: propertyList,
        },
      },
    },
  });
}
