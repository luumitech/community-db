import { getKeyValue } from '@nextui-org/react';
import React from 'react';
import { getCurrentYear } from '~/lib/date-util';
import { PropertyEntry } from './_type';
import { Membership } from './membership';
import { Occupant } from './occupant';
import { PropertyAddress } from './property-address';

export function useTableData(
  /** Year to show on the table */
  _year1?: number | null,
  /** Year to show on the table */
  _year2?: number | null
) {
  /** Sort _year1 and _year2, so yearCol1 always show the greater year */
  const year1 = _year1 ?? getCurrentYear();
  const year2 = _year2 ?? year1 - 1;
  const yearCol1 = Math.max(year1, year2);
  const yearCol2 = Math.min(year1, year2);

  const columns = [
    { key: 'address', label: 'Address', className: 'w-1/6' },
    { key: 'occupant', label: 'Members' },
    { key: 'yearCol1', label: yearCol1, className: 'w-10' },
    { key: 'yearCol2', label: yearCol2, className: 'w-10' },
  ];

  const renderCell = React.useCallback(
    (fragment: PropertyEntry, columnKey: string | number) => {
      switch (columnKey) {
        case 'address':
          return <PropertyAddress fragment={fragment} />;
        case 'occupant':
          return <Occupant fragment={fragment} />;
        case 'yearCol1':
          return (
            <Membership
              className="text-success"
              fragment={fragment}
              year={yearCol1}
            />
          );
        case 'yearCol2':
          return (
            <Membership
              className="text-success"
              fragment={fragment}
              year={yearCol2}
            />
          );
        default:
          return getKeyValue(fragment, columnKey);
      }
    },
    [yearCol1, yearCol2]
  );

  return { columns, renderCell };
}
