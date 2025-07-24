import { format } from 'date-fns';
import { type Community } from '~/lib/xlsx-io/export';

/**
 * Get default xlsx filename when exporting a community
 *
 * @param community Community database content
 * @returns
 */
export function getDefaultXlsxFn(community: Community) {
  const { createdAt, updatedAt } = community;
  const dateStr = format(updatedAt ?? createdAt ?? new Date(), 'yyyyMMdd');
  return `db-${dateStr}.xlsx`;
}
