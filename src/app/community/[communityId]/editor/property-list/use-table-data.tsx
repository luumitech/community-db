import { getKeyValue } from '@nextui-org/react';
import React from 'react';
import { PropertyEntry } from './_type';
import { Membership } from './membership';
import { Occupant } from './occupant';
import { PropertyAddress } from './property-address';

export function useTableData() {
  const curYear = new Date().getFullYear();
  const prevYear = curYear - 1;

  const columns = [
    { key: 'address', label: 'Address', className: 'w-1/6' },
    { key: 'occupant', label: 'Members' },
    { key: 'curYear', label: curYear, className: 'w-10' },
    { key: 'prevYear', label: prevYear, className: 'w-10' },
  ];

  const renderCell = React.useCallback(
    (entry: PropertyEntry, columnKey: string | number) => {
      switch (columnKey) {
        case 'address':
          return <PropertyAddress entry={entry} />;
        case 'occupant':
          return <Occupant entry={entry} />;
        case 'curYear':
          return (
            <Membership className="text-success" entry={entry} year={curYear} />
          );
        case 'prevYear':
          return <Membership entry={entry} year={prevYear} />;
        default:
          return getKeyValue(entry, columnKey);
      }
    },
    [curYear, prevYear]
  );

  return { columns, renderCell };
}
