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
  const { createdAt, updatedAt } = community;
  const dateStr = formatLocalDate(
    updatedAt ?? createdAt ?? new Date(),
    'yyyyMMdd'
  );
  return `${R.toKebabCase(community.name)}-${dateStr}.xlsx`;
}
