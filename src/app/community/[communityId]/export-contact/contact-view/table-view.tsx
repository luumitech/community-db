import {
  cn,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
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
    <Table
      aria-label="Contact List"
      classNames={{
        base: ['p-1 h-full'],
        wrapper: 'p-0',
      }}
      isHeaderSticky
      isVirtualized
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
  );
}
