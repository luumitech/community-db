import * as XLSX from 'xlsx';
import type { PropertyEntry } from '../../_type';

/**
 * Convert property list into Google Custom Map CSV
 *
 * @param propertyList PropertyList obtained after filtering
 * @returns Google Custom Map CSV
 */
export function toGoogleCustomMapCSV(propertyList: PropertyEntry[]) {
  const aoa = [
    ['Address', 'latitude', 'longitude'],
    ...propertyList.map((entry) => [entry.address, entry.lat, entry.lon]),
  ];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const csv = XLSX.utils.sheet_to_csv(ws);
  return csv;
}
