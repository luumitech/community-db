import { Button, cn } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { useOccupancyEditorContext } from '../occupancy-editor-context';

interface Props {
  className?: string;
  onPress?: () => void;
}

export const HouseholdMakeCurrentButton: React.FC<Props> = ({
  className,
  onPress,
}) => {
  const { occupancyInfoListMethods, occupancyFieldId } =
    useOccupancyEditorContext();
  const { fields, move } = occupancyInfoListMethods;

  const makeIntoCurrentOccupant = React.useCallback(() => {
    const currentIdx = fields.findIndex(({ id }) => id === occupancyFieldId);
    if (currentIdx !== -1) {
      move(currentIdx, 0);
      onPress?.();
    }
  }, [fields, occupancyFieldId, move, onPress]);

  return (
    <Button className={className} onPress={makeIntoCurrentOccupant}>
      Into Current
    </Button>
  );
};
