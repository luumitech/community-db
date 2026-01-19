import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  cn,
} from '@heroui/react';
import React from 'react';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';
import { Loading } from '~/view/base/loading';
import { usePageContext } from '../../page-context';
import { AudienceListSelect } from './audience-list-select';
import { AudienceTable } from './audience-table';
import { SearchBar } from './search-bar';
import { useAudienceList } from './use-audience-list';
import { useTableData } from './use-table-data';

interface Props {}

export const AudienceList: React.FC<Props> = () => {
  const { community } = usePageContext();
  const dispatch = useDispatch();
  const { audienceListId } = useSelector((state) => state.mailchimp);
  const { loading, audienceList, refetch, doSort, sortDescriptor } =
    useAudienceList({ communityId: community.id, listId: audienceListId });
  const { columns, renderCell } = useTableData();

  const emptyContent = React.useMemo(() => {
    return (
      <div
        className={cn(
          'flex flex-col items-center',
          'mt-6 mb-2 font-semibold text-default-400'
        )}
      >
        <p className="mb-2">No data to display.</p>
        {audienceListId == null && <p>Please select an audience list.</p>}
      </div>
    );
  }, [audienceListId]);

  const topContent = React.useMemo(() => {
    const warningItem = audienceList.filter((item) => !!item.warning);

    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[repeat(2,max-content)] gap-3">
          <AudienceListSelect
            communityId={community.id}
            selectedKeys={audienceListId ? [audienceListId] : []}
            onSelectionChange={(keys) => {
              const [listId] = keys;
              dispatch(actions.mailchimp.setAudienceListId(listId?.toString()));
            }}
          />
          <Button
            className="aspect-square h-auto w-auto"
            variant="bordered"
            isDisabled={!audienceListId}
            isLoading={loading}
            isIconOnly
            tooltip="Refresh List"
            onPress={() => refetch()}
          >
            <Icon icon="refresh" size={20} />
          </Button>
        </div>
        <SearchBar
          {...(!audienceListId && {
            placeholder: 'Select an audience list above',
          })}
          isDisabled={!audienceListId || loading}
          description={
            <span className="text-xs text-default-400">
              Total {audienceList.length} entries ({warningItem.length} with
              warnings)
            </span>
          }
        />
      </div>
    );
  }, [audienceList, community.id, audienceListId, loading, dispatch, refetch]);

  return (
    <>
      {topContent}
      <div className="mt-2 h-full overflow-auto">
        <AudienceTable
          items={audienceList}
          isLoading={loading}
          emptyContent={emptyContent}
        />
      </div>
    </>
  );

  return (
    <Table
      aria-label="Mailchimp Audience List"
      classNames={{
        base: ['h-full'],
        wrapper: 'p-0 rounded-none shadow-none grow',
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
