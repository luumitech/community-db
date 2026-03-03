import { ButtonGroup, Card, CardBody } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useHookFormContext } from '~/community/[communityId]/property/[propertyId]/@modal/(.)occupancy-editor/use-hook-form';
import { Button } from '~/view/base/button';
import { DragHandle } from '~/view/base/drag-reorder';
import { Icon } from '~/view/base/icon';
import { ItemDescription } from '../household-select/item-description';
import { ItemLabel } from '../household-select/item-label';

interface Props {
  className?: string;
  /** OccupancyList hook-form control name prefix */
  controlNamePrefix: `occupancyInfoList.${number}`;
  isCurrent: boolean;
  /** Allow to remove entry */
  canRemove?: boolean;
  onRemove: () => void;
  onEdit: () => void;
}

export const HouseholdRow: React.FC<Props> = ({
  className,
  controlNamePrefix,
  isCurrent,
  canRemove,
  onRemove,
  onEdit,
}) => {
  const { watch } = useHookFormContext();
  const entry = watch(controlNamePrefix);

  return (
    <Card shadow="sm" role="rowgroup">
      <CardBody
        className={twMerge(
          'grid grid-cols-[minmax(0,1fr)_auto]',
          'items-center gap-2',
          'overflow-hidden',
          className
        )}
      >
        <DragHandle className="col-start-1 flex items-center gap-2">
          <div className="flex grow flex-col gap-0.5 overflow-hidden text-xs">
            <ItemLabel occupancyInfo={entry} isCurrent={isCurrent} />
            <ItemDescription occupancyInfo={entry} />
          </div>
        </DragHandle>
        <ButtonGroup variant="light">
          <Button
            isIconOnly
            startContent={<Icon icon="edit" size={18} />}
            tooltip="Edit"
            onClick={onEdit}
          />
          <Button
            isIconOnly
            startContent={<Icon icon="cross" size={18} />}
            color="danger"
            tooltip="Remove"
            isDisabled={!canRemove}
            onClick={onRemove}
          />
        </ButtonGroup>
      </CardBody>
    </Card>
  );
};
