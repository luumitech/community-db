import { cn } from '@heroui/react';
import React from 'react';
import { useHookFormContext } from '../use-hook-form';

interface Props {
  className?: string;
  editMode: boolean;
}

export const StatusBar: React.FC<Props> = ({ className, editMode }) => {
  const formMethods = useHookFormContext();
  const { watch } = formMethods;
  const area = watch('hidden.map.area');
  const shapeNo = watch('hidden.map.shapeNo');

  const StatusMsg = React.useCallback(() => {
    if (editMode) {
      return <span>Please finish editing before importing.</span>;
    }

    if (shapeNo === 0) {
      return <span>No boundaries drawn.</span>;
    }

    return (
      <span>
        {shapeNo} {shapeNo === 1 ? 'boundary' : 'boundaries'} drawn, total area:{' '}
        {area.toFixed(2)} km²
      </span>
    );
  }, [editMode, area, shapeNo]);

  return (
    <div
      className={cn(
        className,
        'bg-default-100 text-default-500 text-sm',
        'py-1 px-2 rounded-b-medium'
      )}
    >
      <StatusMsg />
    </div>
  );
};
