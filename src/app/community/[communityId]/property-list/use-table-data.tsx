import { getKeyValue } from '@nextui-org/react';
import React from 'react';
import { getCurrentYear } from '~/lib/date-util';
import { PropertyEntry } from './_type';
import { Membership } from './membership';
import { Occupant } from './occupant';
import { PropertyAddress } from './property-address';

export function useTableData() {
  const curYear = getCurrentYear();
  const prevYear = curYear - 1;

  const columns = [
    { key: 'address', label: 'Address', className: 'w-1/6' },
    { key: 'occupant', label: 'Members' },
    { key: 'curYear', label: curYear, className: 'w-10' },
    { key: 'prevYear', label: prevYear, className: 'w-10' },
  ];

  const renderCell = React.useCallback(
    (fragment: PropertyEntry, columnKey: string | number) => {
      switch (columnKey) {
        case 'address':
          return <PropertyAddress fragment={fragment} />;
        case 'occupant':
          return <Occupant fragment={fragment} />;
        case 'curYear':
          return (
            <Membership
              className="text-success"
              fragment={fragment}
              year={curYear}
            />
          );
        case 'prevYear':
          return <Membership fragment={fragment} year={prevYear} />;
        default:
          return getKeyValue(fragment, columnKey);
      }
    },
    [curYear, prevYear]
  );

  return { columns, renderCell };
}
