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

export const HouseholdArchiveButton: React.FC<Props> = ({
  className,
  occupancyInfoListMethods,
  occupancyFieldId,
  onPress,
}) => {
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
