import React from 'react';
import { twMerge } from 'tailwind-merge';
import { CurrencyInput } from '~/view/base/currency-input';
import { DragHandle } from '~/view/base/drag-reorder';
import { FlatButton } from '~/view/base/flat-button';
import { NumberInput } from '~/view/base/number-input';

interface Props {
  className?: string;
  label: string;
  ticketIdx: number;
  onRemove?: (label: string) => void;
}

export const VisibleListItem: React.FC<Props> = ({
  className,
  label,
  ticketIdx,
  onRemove,
}) => {
  return (
    <div
      className={twMerge(
        'col-span-full grid grid-cols-subgrid',
        'mx-3 items-center',
        className
      )}
      role="row"
    >
      <DragHandle />
      <div className="text-sm">{label}</div>
      <CurrencyInput
        controlName={`ticketList.${ticketIdx}.unitPrice`}
        aria-label="Unit Price"
        allowNegative={false}
        variant="underlined"
      />
      <NumberInput
        controlName={`ticketList.${ticketIdx}.count`}
        aria-label="Ticket #"
        labelPlacement="outside"
        variant="underlined"
        hideStepper
        isWheelDisabled
      />
      <FlatButton
        className="text-danger"
        icon="cross"
        onClick={() => onRemove?.(label)}
      />
    </div>
  );
};
