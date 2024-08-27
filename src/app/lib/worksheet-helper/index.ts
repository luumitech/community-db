import * as XLSX from 'xlsx';
import { getSheetRange } from './util';

export interface IterOptions {
  excludeHidden?: boolean;
}

export class WorksheetHelper {
  public ws: XLSX.WorkSheet;

  /** Range of cell values within the worksheet */
  public range: XLSX.Range;
  /** First cell with value in worksheet (i.e. "A1") */
  public rangeStart: string;
  /** Last cell with value in worksheet (i.e. "Q50") */
  public rangeEnd: string;
  /** Number of columns in the sheet */
  public colCount: number;
  /** Number of rows in the sheet */
  public rowCount: number;

  constructor(
    public wb: XLSX.WorkBook,
    public sheetName: string
  ) {
    this.ws = wb.Sheets[sheetName];
    if (!this.ws) {
      throw new Error(`${wb} does not contain sheet: ${sheetName}`);
    }
    this.range = getSheetRange(this.ws);

    this.rangeStart = XLSX.utils.encode_cell(this.range.s);
    this.rangeEnd = XLSX.utils.encode_cell(this.range.e);
    this.colCount = WorksheetHelper.decodeCol(this.rangeEnd) + 1;
    this.rowCount = WorksheetHelper.decodeRow(this.rangeEnd) + 1;
  }

  /** Construct a worksheet helper object using the first sheet in the workbook */
  static fromFirstSheet(wb: XLSX.WorkBook) {
    const firstSheetName = wb.SheetNames[0];
    return new WorksheetHelper(wb, firstSheetName);
  }

  /**
   * Construct a worksheet helper object using JSON data
   *
   * @param json Json data
   * @param sheetName Worksheet name
   */
  static fromJson(json: unknown[], sheetName: string) {
    const worksheet = XLSX.utils.json_to_sheet(json);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    return new WorksheetHelper(workbook, sheetName);
  }

  /** Iterator for looping through all worksheet within workbook */
  static *iter(wb: XLSX.WorkBook, options?: IterOptions) {
    for (const sheetName of wb.SheetNames) {
      const ws = new WorksheetHelper(wb, sheetName);
      if (options?.excludeHidden && !ws.isVisible()) {
        continue;
      }
      yield ws;
    }
  }

  /** Convert excel row name or row index into row index */
  static decodeRow(row: number | string): number {
    return typeof row === 'string' ? XLSX.utils.decode_cell(row).r : row;
  }

  /** Convert excel column name or column index into column index */
  static decodeCol(col: number | string): number {
    return typeof col === 'string' ? XLSX.utils.decode_cell(col).c : col;
  }

  /**
   * Encode cell address to excel cell coordiante format (i.e. 'A1')
   *
   * @example
   *
   * ```js
   * // The following are equivalent to 'A1'
   * encodeCell('A', '1');
   * encodeCell(0, 0);
   * encodeCell('A1');
   * encodeCell({ c: 0, r: 0 });
   * ```
   *
   * @param col Column index (0-based number) or excel column name (string) or
   *   excel cell address
   * @param row Row index (0-based number) or excel row name (string)
   */
  static encodeCell(
    col: number | XLSX.CellAddress | string,
    row?: number | string
  ): string {
    let cellAddr: string;
    if (typeof col === 'object') {
      cellAddr = XLSX.utils.encode_cell(col);
    } else if (row == null) {
      if (typeof col === 'string') {
        cellAddr = col;
      } else {
        throw new Error(
          'When specifying col with a number, row must also be specified'
        );
      }
    } else {
      // Both col and row specifed
      const c = this.decodeCol(col);
      const r = this.decodeRow(row);
      cellAddr = XLSX.utils.encode_cell({ c, r });
    }

    return cellAddr;
  }

  /** Decode cell address to numeric row/column index format */
  static decodeCell(addr: XLSX.CellAddress | string): XLSX.CellAddress {
    return typeof addr === 'string' ? XLSX.utils.decode_cell(addr) : addr;
  }

  /** Iterator for looping through columns of worksheet */
  *iterColumn(row: number | string) {
    const rowIdx = WorksheetHelper.decodeRow(row);
    for (let colIdx = 0; colIdx < this.colCount; colIdx++) {
      const cell = this.cell(colIdx, rowIdx);
      yield { rowIdx, colIdx, ...cell };
    }
  }

  /**
   * Retrieve the cell object at a given cell coordinate
   *
   * @example
   *
   * ```js
   * // The following are equivalent cell('A', '1')
   * cell(0, 0);
   * cell('A1');
   * cell({ c: 0, r: 0 });
   * ```
   *
   * @param col Column index (0-based number) or excel column name (string)
   * @param row Row index (0-based number) or excel row name (string)
   */
  cell(
    col: number | XLSX.CellAddress | string,
    row?: number | string
  ): XLSX.CellObject {
    const cellAddr = WorksheetHelper.encodeCell(col, row);
    const cell: XLSX.CellObject = this.ws[cellAddr];
    return cell ?? {};
  }

  /**
   * Returns array of array of cell values (string) from this worksheet
   *
   * @param rangeStr Range of cells to return (i.e. 'A1:E10')
   * @returns Array of array of string
   */
  getCellValues(rangeStr: string) {
    // If raw: true, then return type would be XLSX.CellObject['v'][][]
    const valueArr: string[][] = XLSX.utils.sheet_to_json(this.ws, {
      header: 1, // return array of values (not JSON objects)
      defval: '',
      range: rangeStr,
      // when raw is false, display formatted value (i.e. `w`) if available
      raw: false,
    });
    return valueArr;
  }

  isVisible() {
    return (
      this.wb.Workbook?.Sheets?.find(
        (sheetProp) =>
          sheetProp.name === this.sheetName && sheetProp.Hidden === 0
      ) != null
    );
  }
}
