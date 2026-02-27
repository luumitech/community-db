import { Button, cn } from '@heroui/react';
import React from 'react';
import { useOccupancyEditorContext } from '../../occupancy-editor-context';
import { HouseholdEditor } from '../household-editor';
import { HouseholdSelect } from '../household-select';
import { Wizard } from './';

export interface Step0Props {}

export const Step0: React.FC<Step0Props> = () => {
  const { goNext, goTo } = Wizard.useWizard();
  const { occupancyInfoListMethods, occupancyFieldId, setOccupancyFieldId } =
    useOccupancyEditorContext();

  return (
    <div className={cn('flex flex-col gap-3')}>
      <div className={cn('flex items-start gap-2')}>
        <HouseholdSelect onSelect={setOccupancyFieldId} />
        <Button
          className="h-14"
          onPress={() => goTo('manager', { anotherProp: 3 })}
        >
          manage
        </Button>
      </div>
      {occupancyInfoListMethods.fields.map((entry, idx) => (
        <HouseholdEditor
          key={entry.id}
          className={cn(
            // 'm-1.5 mt-0',
            entry.id !== occupancyFieldId && 'hidden'
          )}
          controlNamePrefix={`occupancyInfoList.${idx}`}
        />
      ))}
    </div>
  );
};
