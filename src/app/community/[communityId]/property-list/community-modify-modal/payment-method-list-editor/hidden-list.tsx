import React from 'react';
import { type HiddenPaymentMethodListFieldArray } from '../use-hook-form';
import { HiddenListItem } from './hidden-list-item';

interface Props {
  className?: string;
  fieldArray: HiddenPaymentMethodListFieldArray;
  onRemove?: (label: string) => void;
}

export const HiddenList: React.FC<Props> = ({
  className,
  fieldArray,
  onRemove,
}) => {
  const { fields, remove } = fieldArray;

  const removeItem = React.useCallback(
    (label: string, idx: number) => {
      onRemove?.(label);
      remove(idx);
    },
    [remove, onRemove]
  );

  if (fields.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <p className="text-sm mb-4">Removed payment methods:</p>
      <ul className="grid auto-cols-max gap-1">
        {fields.map((field, index) => (
          <HiddenListItem
            key={field.id}
            id={field.id}
            label={field.name}
            onRemove={(label) => removeItem(label, index)}
          />
        ))}
      </ul>
      <p className="text-sm mt-4">
        NOTE: Removed payment methods will not be shown in payment selection
        list. The removed methods will remain in the database until they are no
        longer being referenced.
      </p>
    </div>
  );
};
