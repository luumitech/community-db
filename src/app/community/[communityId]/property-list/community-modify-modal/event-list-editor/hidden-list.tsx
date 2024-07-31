import React from 'react';
import { type HiddenEventListFieldArray } from '../use-hook-form';
import { HiddenListItem } from './hidden-list-item';

interface Props {
  className?: string;
  fieldArray: HiddenEventListFieldArray;
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
        NOTE: Removed events will not be shown in event selection list or
        dashboard. The removed events will remain in the database until they are
        no longer being referenced.
      </p>
    </div>
  );
};
