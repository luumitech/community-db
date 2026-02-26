import { Button, cn } from '@heroui/react';
import React from 'react';
import { useWizard } from 'react-use-wizard';
import { useOccupancyEditorContext } from '../../occupancy-editor-context';
import { HouseholdEditor } from '../household-editor';
import { HouseholdSelect } from '../household-select';

interface Props {}

export const Step0: React.FC<Props> = ({}) => {
  const { nextStep } = useWizard();
  const { occupancyInfoListMethods, occupancyFieldId, setOccupancyFieldId } =
    useOccupancyEditorContext();

  return (
    <div className={cn('flex flex-col gap-3')}>
      <div className={cn('flex items-start gap-2')}>
        <HouseholdSelect onSelect={setOccupancyFieldId} />
        <Button className="h-14" onPress={nextStep}>
          manage
        </Button>
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
