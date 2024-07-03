import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  type SlotsToClasses,
  type TableSlots,
} from '@nextui-org/react';
import React from 'react';
import { useTableData } from '~/community/[communityId]/property-list/use-table-data';
import { getFragment, graphql } from '~/graphql/generated';
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
  className?: SlotsToClasses<TableSlots>;
  fragment?: PropertyEntry;
  isLoading?: boolean;
}

export const PropertyDisplay: React.FC<Props> = ({
  className,
  fragment,
  isLoading,
}) => {
  const entry = getFragment(PropertyDisplayFragment, fragment);
  const { columns, renderCell } = useTableData();
  const rows = entry ? [{ key: entry.id, ...entry }] : [];

  return (
    <Table
      classNames={{
        // Leave enough space for one row of data only
        emptyWrapper: 'h-[40px]',
        ...className,
      }}
      aria-label="Property Info"
      removeWrapper
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key} className={column.className}>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={rows}
        isLoading={isLoading}
        loadingContent={<Spinner />}
      >
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
