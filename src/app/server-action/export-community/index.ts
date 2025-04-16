'use server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/api/auth/[...nextauth]/auth-options';
import {
  ExportLcra,
  ExportMultisheet,
  communityData,
} from '~/lib/xlsx-io/export';
import { ExportMethod, schema } from './_type';
import { getDefaultXlsxFn } from './util';
import { XlsxCache } from './xlsx-cache';

/** Export community information */
export async function exportCommunityAsUrl(communityId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Not authorized');
  }
  const form = schema.parse({
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
 * @param input Form input for generating xlsx
 * @returns Xlsx buffer encoded in base64
 */
export async function exportCommunityAsBase64(
  communityId: string,
  exportMethod: ExportMethod
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Not authorized');
  }
  const form = schema.parse({
    email: session.user.email,
    communityId,
    exportMethod,
  });
  const community = await communityData(session.user, form.communityId);
  let xlsxBuf: Buffer;
  switch (exportMethod) {
    case ExportMethod.Singlesheet:
      {
        const helper = new ExportLcra(community);
        xlsxBuf = helper.toXlsx();
      }
      break;

    case ExportMethod.Multisheet:
      {
        const helper = new ExportMultisheet(community);
        xlsxBuf = helper.toXlsx();
      }
      break;

    default:
      throw new Error(`Unsupported export method ${exportMethod}`);
  }

  return {
    base64: xlsxBuf.toString('base64'),
    fn: getDefaultXlsxFn(community),
  };
}
