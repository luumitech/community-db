import { WorkSheet, utils } from 'xlsx';

/**
 * Get the range containing data for the specified sheet.
 *
 * @param sheet sheet to get range for
 * @returns range containing data
 */
export function getSheetRange(sheet: WorkSheet) {
  let range;

  const ref = sheet['!ref'];
  if (ref) {
    range = utils.decode_range(ref);
  } else {
    // if no range is specified, find the range of cells that have data
    let minRow = 0,
      minCol = 0,
      maxRow = 0,
      maxCol = 0;
    for (const cell_name in sheet) {
      const cellAddr = utils.decode_cell(cell_name);
      minRow = Math.min(minRow, cellAddr.r);
      minCol = Math.min(minCol, cellAddr.c);
      maxRow = Math.max(maxRow, cellAddr.r);
      maxCol = Math.max(maxCol, cellAddr.c);
    }

    range = {
      s: { r: minRow, c: minCol },
      e: { r: maxRow, c: maxCol },
    };
  }
  return range;
}
