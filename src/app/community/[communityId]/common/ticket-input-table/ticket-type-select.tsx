import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
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
    <div className={className}>
      <Select
        className="max-w-xs min-w-32"
        controlName={`${controlNamePrefix}.ticketName`}
        aria-label="Ticket Name"
        variant="underlined"
        selectionMode="single"
        {...(includeHiddenFields
          ? { sections: selectTicketSections }
          : { items: visibleTicketItems })}
        {...props}
      />
    </div>
  );
};
