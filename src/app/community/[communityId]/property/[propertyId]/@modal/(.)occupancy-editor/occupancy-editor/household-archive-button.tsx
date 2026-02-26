import { Button, cn } from '@heroui/react';
import React from 'react';
import { useOccupancyEditorContext } from '../occupancy-editor-context';
import { occupancyInfoDefault } from '../use-hook-form';

interface Props {
  className?: string;
  onPress?: () => void;
}

export const HouseholdArchiveButton: React.FC<Props> = ({
  className,
  onPress,
}) => {
  const { occupancyInfoListMethods } = useOccupancyEditorContext();
  const { fields, prepend } = occupancyInfoListMethods;

  const makeIntoPastOccupant = React.useCallback(() => {
    prepend(occupancyInfoDefault);
    onPress?.();
  }, [prepend, onPress]);

  return (
    <Button className={className} onPress={makeIntoPastOccupant}>
      Archive
    </Button>
  );
};
