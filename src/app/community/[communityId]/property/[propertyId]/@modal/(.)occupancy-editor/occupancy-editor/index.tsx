import { cn } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import * as GQL from '~/graphql/generated/graphql';
import { useOccupancyEditorContext } from '../occupancy-editor-context';
import { HouseholdArchiveButton } from './household-archive-button';
import { HouseholdDeleteButton } from './household-delete-button';
import { HouseholdEditor } from './household-editor';
import { HouseholdMakeCurrentButton } from './household-make-current-button';
import { HouseholdSelect } from './household-select';

interface Props {
  className?: string;
}

export const OccupancyEditor: React.FC<Props> = ({ className }) => {
  const { occupancyInfoListMethods, occupancyFieldId, setOccupancyFieldId } =
    useOccupancyEditorContext();
  const { fields } = occupancyInfoListMethods;

  const onRemove = React.useCallback(
    (removedIdx: number) => {
      // Always go to current occupants after removing an entry
      const fieldToSelect = fields[removedIdx === 0 ? 1 : 0];
      setOccupancyFieldId(fieldToSelect.id);
    },
    [fields, setOccupancyFieldId]
  );

  const isSelectedCurrentOccupant = React.useMemo(() => {
    return fields[0].id === occupancyFieldId;
  }, [fields, occupancyFieldId]);

  return (
    <div className={twMerge('flex flex-col gap-3', className)}>
      <div className={twMerge('flex flex-wrap items-start gap-2', className)}>
        <HouseholdSelect onSelect={setOccupancyFieldId} />
        {/* Split button control to next line in small media */}
        <div className="basis-full sm:basis-auto" />
        <div className="flex h-14 gap-2">
          {isSelectedCurrentOccupant ? (
            <HouseholdArchiveButton className="h-full" />
          ) : (
            <HouseholdMakeCurrentButton className="h-full" />
          )}
          <HouseholdDeleteButton className="h-full" onPress={onRemove} />
        </div>
      </div>
      {occupancyInfoListMethods.fields.map((entry, idx) => (
        <HouseholdEditor
          key={entry.id}
          className={cn(entry.id !== occupancyFieldId && 'hidden')}
          controlNamePrefix={`occupancyInfoList.${idx}`}
        />
      ))}
    </div>
  );
};
