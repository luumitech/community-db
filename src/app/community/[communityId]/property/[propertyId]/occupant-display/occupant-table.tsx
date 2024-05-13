import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from '@nextui-org/react';
import React from 'react';
import { MdEmail } from 'react-icons/md';
import { OccupantEntry } from './_type';
import { OptOut } from './opt-out';

interface Props {
  className?: string;
  occupantList: OccupantEntry[];
}

export const OccupantTable: React.FC<Props> = ({ className, occupantList }) => {
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
          <MdEmail /> Email
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
        default:
          return getKeyValue(occupant, columnKey);
      }
    },
    []
  );

  return (
    <Table className={className} aria-label="Occupant Table" removeWrapper>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
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
  );
};
