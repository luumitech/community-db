import { Button } from '@heroui/react';
import React from 'react';
import * as XLSX from 'xlsx';
import { XlsxView } from '~/community/[communityId]/common/xlsx-view';
import { startDownloadBlob } from '~/lib/dom';
import { Icon } from '~/view/base/icon';

/** Filename of the sample xlsx */
const SAMPLE_XLSX_FN = 'sample.xlsx';

interface Props {
  className?: string;
}

export const SampleXlsx: React.FC<Props> = ({ className }) => {
  const workbook = React.useMemo(() => {
    const aoa = [
      ['Address', 'StreetNo', 'StreetName', 'PostalCode'],
      ['123 Adventure Drive', '123', 'Adventure Drive', 'A0A0A0'],
      ['99 Fortune Drive', '99', 'Fortune Drive', 'A0A0A0'],
      ['7723 Galvin Street', '7723', 'Galvin Street', 'A0A0A0'],
      ['64 Leatherwood St', '64', 'Leatherwood St', 'A0A0A0'],
      ['36 North King Dr', '36', 'North King Dr', 'A0A0A0'],
    ];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    return XLSX.utils.book_new(ws, 'Sample');
  }, []);

  const onDownload = React.useCallback(() => {
    const buffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
      bookSST: false,
      compression: true,
    });
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
    });
    startDownloadBlob(blob, SAMPLE_XLSX_FN);
  }, [workbook]);

  return (
    <div className={className}>
      <XlsxView workbook={workbook} />
      <Button
        className="mt-4"
        endContent={<Icon icon="download" />}
        color="primary"
        variant="bordered"
        onPress={onDownload}
      >
        Download {SAMPLE_XLSX_FN}
      </Button>
    </div>
  );
};
