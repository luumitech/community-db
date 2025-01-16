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
    <>
      {fields.map((field, index) => (
        <HiddenListItem
          key={field.id}
          id={field.id}
          label={field.name}
          onRemove={(label) => removeItem(label, index)}
        />
      ))}
    </>
  );
};
