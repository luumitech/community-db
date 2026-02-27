import { Button, cn } from '@heroui/react';
import React from 'react';
import { useOccupancyEditorContext } from '../../occupancy-editor-context';
import { HouseholdArchiveButton } from '../household-archive-button';
import { HouseholdDeleteButton } from '../household-delete-button';
import { HouseholdMakeCurrentButton } from '../household-make-current-button';
import { HouseholdSelect } from '../household-select';
import { Wizard } from './';

export interface Step1Props {
  arg: string;
}

export const Step1: React.FC<Step1Props> = (props) => {
  const { goBack, goTo } = Wizard.useWizard();
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
    <div className={cn('flex flex-col gap-3')}>
      <div className={cn('flex flex-wrap items-start gap-2')}>
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
      <Button className="h-14" onPress={() => goTo('editor', {})}>
        previous
      </Button>
    </div>
  );
};
