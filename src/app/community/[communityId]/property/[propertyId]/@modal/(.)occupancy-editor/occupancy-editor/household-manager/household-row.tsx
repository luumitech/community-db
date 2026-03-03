import { Card, CardBody } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useHookFormContext } from '~/community/[communityId]/property/[propertyId]/@modal/(.)occupancy-editor/use-hook-form';
import { DragHandle } from '~/view/base/drag-reorder';
import { FlatButton } from '~/view/base/flat-button';
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
          'grid grid-cols-[minmax(0,1fr)_20px_20px]',
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
        <FlatButton icon="edit" tooltip="Edit" onClick={onEdit} />
        <FlatButton
          className="text-danger"
          icon="cross"
          tooltip="Remove"
          disabled={!canRemove}
          onClick={onRemove}
        />
      </CardBody>
    </Card>
  );
};
