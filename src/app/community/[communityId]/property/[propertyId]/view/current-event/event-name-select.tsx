import { cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { PleaseConfigureEvents } from '~/community/[communityId]/layout-util/render-select';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { getCurrentDate } from '~/lib/date-util';
import { PlainSelect } from '~/view/base/select';

interface Props {
  className?: string;
}

export const EventNameSelect: React.FC<Props> = ({ className }) => {
  const { communityId, visibleEventItems } = useLayoutContext();
  const { lastEventSelected } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const emptyContent = React.useMemo(() => {
    return <PleaseConfigureEvents communityId={communityId} />;
  }, [communityId]);

  return (
    <PlainSelect
      className={cn(className, 'max-w-xs min-w-32')}
      aria-label="Current Event Name"
      placeholder="Select current event"
      description={getCurrentDate()}
      selectedKeys={lastEventSelected ? [lastEventSelected] : []}
      onSelectionChange={(keys) => {
        const [firstKey] = keys;
        dispatch(actions.ui.setLastEventSelected(firstKey?.toString()));
      }}
      emptyContent={emptyContent}
      items={visibleEventItems}
    />
  );
};
