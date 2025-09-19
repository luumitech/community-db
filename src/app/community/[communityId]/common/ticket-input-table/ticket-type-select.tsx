import { cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import {
  renderItems,
  renderSections,
} from '~/community/[communityId]/layout-util/render-select';
import { Select, type SelectProps } from '~/view/base/select';

type CustomSelectProps = Omit<
  SelectProps,
  'controlName' | 'items' | 'children'
>;

interface Props extends CustomSelectProps {
  className?: string;
  controlNamePrefix: string;
  includeHiddenFields?: boolean;
}

export const TicketTypeSelect: React.FC<Props> = ({
  className,
  controlNamePrefix,
  includeHiddenFields,
  ...props
}) => {
  const { selectTicketSections, visibleTicketItems } = useLayoutContext();

  /**
   * Due to the way the app is designed, when we show ticket selection box,
   * there should always be some ticket items to display (i.e. the items are
   * never empty, so not handling empty items)
   */

  return (
    <div className={cn(className)}>
      <Select
        className="min-w-32 max-w-xs"
        controlName={`${controlNamePrefix}.ticketName`}
        aria-label="Ticket Name"
        variant="underlined"
        selectionMode="single"
        {...props}
      >
        {includeHiddenFields
          ? renderSections(selectTicketSections)
          : renderItems(visibleTicketItems)}
      </Select>
    </div>
  );
};
