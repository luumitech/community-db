import { cn } from '@heroui/react';
import React from 'react';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';
import { usePageContext } from '../../page-context';
import { AudienceListSelect } from './audience-list-select';
import { AudienceTable } from './audience-table';
import { SearchBar } from './search-bar';
import { useAudienceList } from './use-audience-list';

interface Props {}

export const AudienceList: React.FC<Props> = () => {
  const { community } = usePageContext();
  const dispatch = useDispatch();
  const { audienceListId } = useSelector((state) => state.mailchimp);
  const { loading, audienceList, refetch, doSort, sortDescriptor } =
    useAudienceList({ communityId: community.id, listId: audienceListId });

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
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <AudienceListSelect
            communityId={community.id}
            selectedKeys={audienceListId ? [audienceListId] : []}
            onSelectionChange={(keys) => {
              const [listId] = keys;
              dispatch(actions.mailchimp.setAudienceListId(listId?.toString()));
            }}
          />
          <Button
            className="aspect-square h-full w-auto"
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
      <div className="mt-2 h-full overflow-x-hidden overflow-y-auto">
        <AudienceTable
          audienceListId={audienceListId}
          items={audienceList}
          isLoading={loading}
          emptyContent={emptyContent}
          sortDescriptor={sortDescriptor}
          onSortChange={doSort}
        />
      </div>
    </>
  );
};
