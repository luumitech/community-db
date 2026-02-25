import { Button, cn } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import {
  OccupancyInfoListFieldArray,
  occupancyInfoDefault,
} from '../use-hook-form';

interface Props {
  className?: string;
  occupancyInfoListMethods: OccupancyInfoListFieldArray;
  occupancyFieldId: string;
  onPress?: () => void;
}

export const HouseholdMakeCurrentButton: React.FC<Props> = ({
  className,
  occupancyInfoListMethods,
  occupancyFieldId,
  onPress,
}) => {
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
