'use server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/api/auth/[...nextauth]/auth-options';
import {
  InputData,
  schema,
} from '~/community/[communityId]/tool/export-xlsx/use-hook-form';
import { ExportHelper, communityData } from '~/lib/lcra-community/export';
import { XlsxCache } from './xlsx-cache';

/**
 * Export community information
 */
export async function exportCommunityAsUrl(input: InputData) {
  const session = await getServerSession(authOptions);
  const form = await schema.validate({
    ...input,
    ctxEmail: session?.user?.email,
  });

  const cache = await XlsxCache.fromForm(form);
  const url = await cache.downloadUrl();
  return url;
}

/**
 * Export community information
 *
 * @param input form input for generating xlsx
 * @returns xlsx buffer encoded in base64
 */
export async function exportCommunityAsBase64(input: InputData) {
  const session = await getServerSession(authOptions);
  const form = await schema.validate({
    ...input,
    ctxEmail: session?.user?.email,
  });

  const community = await communityData(form.communityId, form.ctxEmail);
  const helper = new ExportHelper(community.propertyList);
  const xlsxBuf = helper.toXlsx();
  return xlsxBuf.toString('base64');
}
