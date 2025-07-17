import {
  ScrollShadow,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import React from 'react';
import type { PropertyEntry } from '~/community/[communityId]/property-list/_type';
import { useTableData } from '~/community/[communityId]/property-list/use-table-data';
import { useSelector } from '~/custom-hooks/redux';
import { getFragment, graphql } from '~/graphql/generated';
import { insertIf } from '~/lib/insert-if';
import { Loading } from '~/view/base/loading';
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
  className?: string;
  isLoading?: boolean;
}

export const PropertyDisplay: React.FC<Props> = ({ className, isLoading }) => {
  const { property } = usePageContext();
  const { canEdit } = useSelector((state) => state.community);
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
    <div className={className}>
      <ScrollShadow className="overflow-y-hidden" orientation="horizontal">
        <Table
          classNames={{
            // Leave enough space for one row of data only
            emptyWrapper: 'h-[40px]',
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
            loadingContent={<Loading />}
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
      </ScrollShadow>
    </div>
  );
};
