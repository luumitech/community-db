import { Button, cn } from '@heroui/react';
import React from 'react';
import { useOccupancyEditorContext } from '~/community/[communityId]/property/[propertyId]/@modal/(.)occupancy-editor/occupancy-editor-context';
import { occupancyInfoDefault } from '~/community/[communityId]/property/[propertyId]/@modal/(.)occupancy-editor/use-hook-form';
import { ReorderGroup, ReorderItem } from '~/view/base/drag-reorder';
import { Icon } from '~/view/base/icon';
import { Wizard } from '../wizard';
import { HouseholdRow } from './household-row';
import { Instruction } from './instruction';

interface Props {
  className?: string;
}

export const HouseholdManager: React.FC<Props> = ({ className }) => {
  const { goTo } = Wizard.useWizard();
  const { occupancyInfoListMethods, setOccupancyFieldId } =
    useOccupancyEditorContext();
  const { fields, prepend, remove, move } = occupancyInfoListMethods;

  const onRemove = React.useCallback(
    (removedIdx: number) => {
      // Always go to current occupants after removing an entry
      const fieldToSelect = fields[removedIdx === 0 ? 1 : 0];
      setOccupancyFieldId(fieldToSelect.id);
      remove(removedIdx);
    },
    [fields, remove, setOccupancyFieldId]
  );

  const onEdit = React.useCallback(
    (fieldId: string) => {
      setOccupancyFieldId(fieldId);
      goTo('editor', {});
    },
    [goTo, setOccupancyFieldId]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          className="shrink-0 self-start"
          startContent={<Icon icon="add" />}
          color="primary"
          variant="faded"
          onPress={() => {
            prepend(occupancyInfoDefault);
          }}
        >
          Add new occupancy
        </Button>
      </div>
      <Instruction />
      <ReorderGroup axis="vertical" items={fields} onMove={move}>
        {fields.map((field, idx) => {
          return (
            <ReorderItem key={`occupancyInfoList-${field.id}`} id={field.id}>
              <HouseholdRow
                controlNamePrefix={`occupancyInfoList.${idx}`}
                isCurrent={idx === 0}
                canRemove={fields.length > 1}
                onRemove={() => onRemove(idx)}
                onEdit={() => onEdit(field.id)}
              />
            </ReorderItem>
          );
        })}
      </ReorderGroup>
    </div>
  );
};
