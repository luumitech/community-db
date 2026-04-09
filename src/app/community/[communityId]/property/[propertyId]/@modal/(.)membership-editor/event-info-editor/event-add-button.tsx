import { Dropdown, DropdownMenu, DropdownTrigger, cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import {
  PleaseConfigureEvents,
  renderDropdownItems,
  renderDropdownSections,
  type SelectItemT,
} from '~/community/[communityId]/layout-util/render-select';
import { getCurrentDateAsISOString } from '~/lib/date-util';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';
import { InputData } from '../use-hook-form';

type Event = InputData['membershipList'][number]['eventAttendedList'][number];

interface Props {
  className?: string;
  /** When displaying select items, include hidden fields as well, applicable to: */
  includeHiddenFields?: boolean;
  /** List of event names to exclude from the selection list */
  excludeEvents?: string[];
  onAppend?: (event: Event) => void;
}

export const EventAddButton: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  includeHiddenFields,
  excludeEvents,
  onAppend,
  children,
}) => {
  const { communityId, selectEventSections, visibleEventItems } =
    useLayoutContext();

  const eventItems = React.useCallback(
    (selectItems: SelectItemT[]) => {
      if (excludeEvents == null) {
        return selectItems;
      }
      return selectItems.filter((item) => !excludeEvents.includes(item.value));
    },
    [excludeEvents]
  );

  const eventSections = React.useCallback(() => {
    return selectEventSections.map((section) => {
      return {
        ...section,
        items: eventItems(section.items),
      };
    });
  }, [selectEventSections, eventItems]);

  const emptyContent = React.useMemo(() => {
    if (excludeEvents == null) {
      return <PleaseConfigureEvents communityId={communityId} />;
    }
    return <span>All possible event types have been added</span>;
  }, [communityId, excludeEvents]);

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        {children ?? (
          <Button
            className={cn(className)}
            color="primary"
            variant="bordered"
            radius="sm"
            size="sm"
            startContent={<Icon icon="add" />}
          >
            Add Event
          </Button>
        )}
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Add Event"
        emptyContent={emptyContent}
        onAction={(key) => {
          const eventName = key as string;
          onAppend?.({
            eventName,
            eventDate: getCurrentDateAsISOString(),
            ticketList: [],
          });
        }}
      >
        {includeHiddenFields
          ? renderDropdownSections(eventSections())
          : renderDropdownItems(eventItems(visibleEventItems))}
      </DropdownMenu>
    </Dropdown>
  );
};
