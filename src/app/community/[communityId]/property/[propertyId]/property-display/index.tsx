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
import type { PropertyEntry } from '~/community/[communityId]/property-list/_type';
import { useTableData } from '~/community/[communityId]/property-list/use-table-data';
import { useAppContext } from '~/custom-hooks/app-context';
import { getFragment, graphql } from '~/graphql/generated';
import { insertIf } from '~/lib/insert-if';
import { usePageContext } from '../page-context';
import { EditMembershipButton } from './edit-membership-button';

const PropertyDisplayFragment = graphql(/* GraphQL */ `
  fragment PropertyId_PropertyDisplay on Property {
    id
    ...PropertyList_Address
    ...PropertyList_Occupant
    ...PropertyList_Membership
  }
`);

interface Props {
  classNames?: SlotsToClasses<TableSlots>;
  isLoading?: boolean;
}

export const PropertyDisplay: React.FC<Props> = ({ classNames, isLoading }) => {
  const { property } = usePageContext();
  const { canEdit } = useAppContext();
  const entry = getFragment(PropertyDisplayFragment, property);
  const tableData = useTableData();
  const rows = entry ? [{ key: entry.id, ...entry }] : [];

  const columns = React.useMemo(() => {
    return [
      ...tableData.columns,
      ...insertIf(canEdit, { key: 'action', label: '', className: 'w-10' }),
    ];
  }, [tableData.columns, canEdit]);

  const renderCell = React.useCallback(
    (fragment: PropertyEntry, columnKey: string | number) => {
      switch (columnKey) {
        case 'action':
          return <EditMembershipButton />;
        default:
          return tableData.renderCell(fragment, columnKey);
      }
    },
    [tableData]
  );

  return (
    <Table
      classNames={{
        // Leave enough space for one row of data only
        emptyWrapper: 'h-[40px]',
        base: 'overflow-x-auto overflow-y-hidden',
        ...classNames,
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
