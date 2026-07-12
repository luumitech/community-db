import { cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import * as XLSX from 'xlsx';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { startDownloadBlob } from '~/lib/dom';
import { ToolbarButton } from '~/view/base/map';
import type { PropertyEntry } from '../_type';
import { usePageContext } from '../page-context';

/**
 * Convert blah into Google Custom Map CSV
 *
 * @param propertyList PropertyList obtained after filtering
 * @returns Google Custom Map CSV
 */
function toGoogleCustomMapCSV(propertyList: PropertyEntry[]) {
  const aoa = [
    ['Address', 'latitude', 'longitude'],
    ...propertyList.map((entry) => [entry.address, entry.lat, entry.lon]),
  ];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const csv = XLSX.utils.sheet_to_csv(ws);
  return csv;
}

interface Props {
  className?: string;
}

export const ExportGoogleMap: React.FC<Props> = ({ className }) => {
  const { communityName } = useLayoutContext();
  const { community } = usePageContext();

  const onDownload = React.useCallback(() => {
    const csv = toGoogleCustomMapCSV(community.rawPropertyList);
    const blob = new Blob([csv], { type: 'text/csv' });
    const fn = R.toKebabCase(`${communityName ?? ''}-google-map.csv`);
    startDownloadBlob(blob, fn);
  }, [community, communityName]);

  return (
    <ToolbarButton
      icon="googleMap"
      title="Export to Google Custom map"
      onClick={onDownload}
    />
  );
};
