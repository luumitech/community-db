import * as XLSX from 'xlsx';
import { importLcraDB } from './format-lcradb';
import { importMultisheet } from './format-multisheet';

/** Can be used on client side */
export type { CommunityEntry } from './_type';

export function importXlsx(wb: XLSX.WorkBook) {
  const { SheetNames } = wb;

  const communityCreateInput =
    SheetNames.length > 1 ? importMultisheet(wb) : importLcraDB(wb);

  return communityCreateInput;
}
