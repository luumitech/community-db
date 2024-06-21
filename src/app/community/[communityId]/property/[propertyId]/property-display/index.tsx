import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import React from 'react';
import { useTableData } from '~/community/[communityId]/property-list/use-table-data';
import { graphql, useFragment } from '~/graphql/generated';
import { type PropertyEntry } from '../_type';

const PropertyDisplayFragment = graphql(/* GraphQL */ `
  fragment PropertyId_PropertyDisplay on Property {
    id
    ...PropertyList_Address
    ...PropertyList_Occupant
    ...PropertyList_Membership
  }
`);

interface Props {
  className?: string;
  fragment: PropertyEntry;
}

export const PropertyDisplay: React.FC<Props> = ({ className, fragment }) => {
  const entry = useFragment(PropertyDisplayFragment, fragment);
  const { columns, renderCell } = useTableData();
  const rows = [{ key: entry.id, ...entry }];

  return (
    <Table className={className} aria-label="Property Info" removeWrapper>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key} className={column.className}>
            {column.label}
          </TableColumn>
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
  );
};
