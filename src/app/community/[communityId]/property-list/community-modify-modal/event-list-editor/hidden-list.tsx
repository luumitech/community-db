import React from 'react';
import { type HiddenEventListFieldArray } from '../use-hook-form';
import { HiddenListItem } from './hidden-list-item';

interface Props {
  className?: string;
  fieldMethod: HiddenEventListFieldArray;
  onRemove?: (label: string) => void;
}

export const HiddenList: React.FC<Props> = ({
  className,
  fieldMethod,
  onRemove,
}) => {
  const { fields, remove } = fieldMethod;

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
      <p className="text-sm mb-4">Removed event list items:</p>
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
        NOTE: Removed items will be removed when they are no longer being
        referenced within the database
      </p>
    </div>
  );
};
