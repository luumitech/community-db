import React from 'react';
import * as XLSX from 'xlsx';
import { XlsxView } from '~/community/[communityId]/common/xlsx-view';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { useMakeXlsxData } from '../../common/make-xlsx-data';

interface Props {
  className?: string;
}

export const SampleXlsx: React.FC<Props> = ({ className }) => {
  const { data, columns, updateWorksheet } = useMakeXlsxData();

  React.useEffect(() => {
    const aoa = [
      ['Address', 'StreetNo', 'StreetName', 'PostalCode'],
      ['123 Adventure Drive', '123', 'Adventure Drive', 'A0A0A0'],
      ['99 Fortune Drive', '99', 'Fortune Drive', 'A0A0A0'],
      ['7723 Galvin Street', '7723', 'Galvin Street', 'A0A0A0'],
      ['64 Leatherwood St', '64', 'Leatherwood St', 'A0A0A0'],
      ['36 North King Dr', '36', 'North King Dr', 'A0A0A0'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const workbook = XLSX.utils.book_new(ws, 'sheet1');
    const worksheet = WorksheetHelper.fromFirstSheet(workbook);
    updateWorksheet(worksheet);
  }, [updateWorksheet]);

  return (
    <div className={className}>
      <XlsxView data={data} columns={columns} />
    </div>
  );
};
