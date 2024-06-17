'use server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/api/auth/[...nextauth]/auth-options';
import { ExportHelper, communityData } from '~/lib/lcra-community/export';
import { schema } from './_type';
import { getDefaultXlsxFn } from './util';
import { XlsxCache } from './xlsx-cache';

/**
 * Export community information
 */
export async function exportCommunityAsUrl(communityId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Not authorized');
  }
  const form = await schema.validate({
    email: session.user.email,
    communityId,
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
export async function exportCommunityAsBase64(communityId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Not authorized');
  }
  const form = await schema.validate({
    email: session.user.email,
    communityId,
  });
  const community = await communityData(session.user, form.communityId);
  const helper = new ExportHelper(community.propertyList);
  const xlsxBuf = helper.toXlsx();
  return {
    base64: xlsxBuf.toString('base64'),
    fn: getDefaultXlsxFn(community),
  };
}
