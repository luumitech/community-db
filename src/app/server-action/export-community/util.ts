import * as R from 'remeda';
import { formatLocalDate } from '~/lib/date-util';
import { type Community } from '~/lib/xlsx-io/export';

/**
 * Get default xlsx filename when exporting a community
 *
 * @param community Community database content
 * @returns
 */
export function getDefaultXlsxFn(community: Community) {
  /**
   * Originally wanted to use community updatedAt date to name the export file,
   * but that is not enough to capture changes made to property only. Ideally,
   * we want the date to reflect the date when last change was made to either
   * property or community document.
   */
  // const { createdAt, updatedAt } = community;
  const dateStr = formatLocalDate(new Date(), 'yyyyMMdd');
  return `${R.toKebabCase(community.name)}-${dateStr}.xlsx`;
}
