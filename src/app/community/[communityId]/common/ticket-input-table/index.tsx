import { ScrollShadow } from '@heroui/react';
import clsx from 'clsx';
import React from 'react';
import * as R from 'remeda';
import { useFormContext } from '~/custom-hooks/hook-form';
import { type TicketListFieldArray } from './_type';
import { TicketRow, TicketRowHeader } from './ticket-row';

export * from './_type';
export { TicketAddButton } from './ticket-add-button';

interface Props {
  className?: string;
  /**
   * Ticket List hook-form control name prefix
   *
   * I.e. `membershipList.${yearIdx}.eventAttendedList.${eventIdx}.ticketList`
   */
  controlNamePrefix: string;
  fieldMethods: TicketListFieldArray;
  /**
   * When displaying select items, include hidden fields as well, applicable to:
   *
   * - Payment Methods
   * - Event Names
   */
  includeHiddenFields?: boolean;
  onRemove?: (ticketIdx: number) => void;
}

export const TicketInputTable: React.FC<Props> = ({
  className,
  controlNamePrefix,
  fieldMethods,
  includeHiddenFields,
  onRemove,
}) => {
  const { formState } = useFormContext();
  const { errors } = formState;
  const { fields } = fieldMethods;
  const errObj = R.pathOr(errors, R.stringToPath(controlNamePrefix), {});
  const error = React.useMemo<string | undefined>(() => {
    return errObj?.message as string;
  }, [errObj]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm text-danger">{error}</div>
      </div>
    );
  }, [error]);

  return (
    <div>
      <ScrollShadow
        className={clsx(className)}
        orientation="horizontal"
        hideScrollBar
      >
        <div className="grid grid-cols-[repeat(4,1fr)_75px] gap-2">
          <TicketRowHeader />
          {fields.map((row, ticketIdx) => (
            <TicketRow
              key={row.id}
              controlNamePrefix={`${controlNamePrefix}.${ticketIdx}`}
              includeHiddenFields={includeHiddenFields}
              onRemove={() => {
                fieldMethods.remove(ticketIdx);
                onRemove?.(ticketIdx);
              }}
            />
          ))}
        </div>
      </ScrollShadow>
      <div className="pt-3">{bottomContent}</div>
    </div>
  );
};
