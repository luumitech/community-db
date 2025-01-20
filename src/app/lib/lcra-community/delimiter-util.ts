/** Items (i.e. events, dates) are delimited by this character */
export const ITEM_DELIMITER = ';';

/**
 * Names that goes into excel that are delimited should not contain delimiting
 * characters
 *
 * If they are encountered, filter them out.
 */
export function removeDelimiter(input: string) {
  const delimiterCharList = [ITEM_DELIMITER].join('');
  return input.replace(new RegExp(`[${delimiterCharList}]`, 'g'), '');
}
