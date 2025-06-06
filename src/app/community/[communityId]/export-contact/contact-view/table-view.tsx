import {
  ScrollShadow,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  cn,
} from '@heroui/react';
import React from 'react';
import { Loading } from '~/view/base/loading';
import { type ContactInfo } from '../contact-util';
import { useTableData } from './use-table-data';

export interface TableViewProps {
  className?: string;
  contactList?: ContactInfo['contactList'];
  isLoading?: boolean;
}

export function TableView({
  className,
  contactList,
  isLoading,
}: TableViewProps) {
  const { columns, renderCell } = useTableData();

  const emptyContent = React.useMemo(() => {
    return (
      <div>
        <p className="mb-2">No data to display.</p>
      </div>
    );
  }, []);

  return (
    <ScrollShadow className="h-full" orientation="horizontal">
      <Table
        aria-label="Contact List"
        classNames={{
          base: ['h-full'],
        }}
        isHeaderSticky
        isVirtualized
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
          isLoading={isLoading}
          loadingContent={<Loading />}
          emptyContent={emptyContent}
          items={contactList ?? []}
        >
          {(entry) => (
            <TableRow key={entry.id}>
              {(columnKey) => (
                <TableCell>{renderCell(entry, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollShadow>
  );
}
