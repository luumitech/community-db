import { format } from 'date-fns';
import { type Community } from '~/lib/lcra-community/export';

/**
 * Get default xlsx filename when exporting a community
 *
 * @param community Community database content
 * @returns
 */
export function getDefaultXlsxFn(community: Community) {
  const { createdAt, updatedAt } = community;
  const dateStr = format(updatedAt ?? createdAt, 'yyyyMMdd');
  return `db-${dateStr}.xlsx`;
}
