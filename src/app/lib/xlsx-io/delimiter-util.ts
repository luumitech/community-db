/** Items (i.e. events, dates) are delimited by this character */
export const ITEM_DELIMITER = ';';

/**
 * Names that goes into excel that are delimited should not contain delimiting
 * characters. This function removes delimiter characters from the input string
 *
 * @param input Input string
 * @param delimiterList List of delimiter characters
 * @returns String without delimiter characters
 */
export function removeDelimiter(input: string, delimiterList: string[] = []) {
  const delimiterCharList = [ITEM_DELIMITER, ...delimiterList].join('');
  return input.replace(new RegExp(`[${delimiterCharList}]`, 'g'), '');
}
