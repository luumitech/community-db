import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  cn,
} from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { Loading } from '~/view/base/loading';
import { usePageContext } from '../../page-context';
import { AudienceListSelect } from './audience-list-select';
import { StatusFilter, useStatusFilter } from './status-filter';
import { useAudienceList } from './use-audience-list';
import { useTableData } from './use-table-data';

interface Props {}

export const AudienceList: React.FC<Props> = () => {
  const { community } = usePageContext();
  const [listId, setListId] = React.useState<string>();
  const [statusFilter, setStatusFilter] = useStatusFilter();
  const { loading, audienceList, refetch, doSort, sortDescriptor } =
    useAudienceList({
      communityId: community.id,
      listId,
      statusFilter,
    });
  const { columns, renderCell } = useTableData();

  const emptyContent = React.useMemo(() => {
    return (
      <div>
        <p className="mb-2">No data to display.</p>
        {listId == null && <p>Please select an audience list.</p>}
      </div>
    );
  }, [listId]);

  const topContent = React.useMemo(() => {
    const warningItem = audienceList.filter((item) => !!item.warning);

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          <AudienceListSelect communityId={community.id} onSelect={setListId} />
          <StatusFilter selected={statusFilter} onSelect={setStatusFilter} />
          <Button
            className="h-14"
            endContent={<Icon icon="refresh" />}
            onPress={() => refetch()}
          >
            Refresh
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-xs">
            Total {audienceList.length} emails ({warningItem.length} with
            warnings)
          </span>
        </div>
      </div>
    );
  }, [community.id, statusFilter, setStatusFilter, audienceList, refetch]);

  return (
    <Table
      aria-label="Mailchimp Audience List"
      classNames={{
        base: ['h-full'],
        wrapper: 'p-0 rounded-none shadow-none',
      }}
      isHeaderSticky
      isVirtualized
      topContent={topContent}
      topContentPlacement="outside"
      sortDescriptor={sortDescriptor}
      onSortChange={doSort}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key}
            className={column.className}
            allowsSorting={column.allowsSorting}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        isLoading={loading}
        loadingContent={<Loading />}
        emptyContent={emptyContent}
        items={audienceList}
      >
        {(entry) => (
          <TableRow key={entry.email}>
            {(columnKey) => (
              <TableCell>{renderCell(entry, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
