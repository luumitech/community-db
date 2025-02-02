import {
  ScrollShadow,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
  type TableProps,
} from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { OccupantEntry } from './_type';
import { OptOut } from './opt-out';

/**
 * Converts a 10 digit phone number to (xxx)xxx-xxxx format
 *
 * @param {any} phoneNumber
 */
function formatPhoneNumber(phoneNumber: string) {
  if (!phoneNumber) {
    return null;
  }
  const cleaned = phoneNumber.toString().replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  return !match ? phoneNumber : `(${match[1]}) ${match[2]}-${match[3]}`;
}

interface Props {
  className?: string;
  occupantList: OccupantEntry[];
  bottomContent?: TableProps['bottomContent'];
}

export const OccupantTable: React.FC<Props> = ({
  className,
  occupantList,
  bottomContent,
}) => {
  const rows = occupantList.map((occupant, idx) => ({
    key: idx,
    ...occupant,
  }));

  const columns = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'optOut', label: 'Opt out' },
    {
      key: 'email',
      label: (
        <div className="flex items-center gap-1">
          <Icon icon="email" /> Email
        </div>
      ),
    },
    { key: 'cell', label: 'Cell' },
    { key: 'work', label: 'Work' },
    { key: 'home', label: 'Home' },
  ];

  const renderCell = React.useCallback(
    (occupant: OccupantEntry, columnKey: string | number) => {
      switch (columnKey) {
        case 'optOut':
          return <OptOut entry={occupant} />;
        case 'cell':
        case 'work':
        case 'home':
          return formatPhoneNumber(getKeyValue(occupant, columnKey));
        default:
          return getKeyValue(occupant, columnKey);
      }
    },
    []
  );

  return (
    <div className={className}>
      <ScrollShadow className="overflow-y-hidden" orientation="horizontal">
        <Table
          aria-label="Occupant Table"
          removeWrapper
          bottomContent={bottomContent}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={rows}>
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollShadow>
    </div>
  );
};
