import { Button, cn } from '@heroui/react';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { OccupancyInfoListFieldArray } from '../use-hook-form';

interface Props {
  className?: string;
  occupancyInfoListMethods: OccupancyInfoListFieldArray;
  occupancyFieldId: string;
  onPress?: (removedIdx: number) => void;
}

export const HouseholdDeleteButton: React.FC<Props> = ({
  className,
  occupancyInfoListMethods,
  occupancyFieldId,
  onPress,
}) => {
  const { fields, remove } = occupancyInfoListMethods;

  const onRemove = React.useCallback(() => {
    const currentIdx = fields.findIndex(({ id }) => id === occupancyFieldId);
    if (currentIdx !== -1) {
      remove(currentIdx);
      onPress?.(currentIdx);
    }
  }, [fields, occupancyFieldId, onPress, remove]);

  return (
    <Button
      className={className}
      color="danger"
      endContent={<Icon icon="trash" />}
      // At least one group should be visible at all times
      isDisabled={fields.length === 1}
      onPress={onRemove}
    >
      Delete Group
    </Button>
  );
};
