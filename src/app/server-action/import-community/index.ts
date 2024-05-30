'use server';
import { getServerSession } from 'next-auth/next';
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
  const propertyList = importLcraDB(workbook);

  await prisma.community.update({
    where: {
      id: form.communityId,
    },
    data: {
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
