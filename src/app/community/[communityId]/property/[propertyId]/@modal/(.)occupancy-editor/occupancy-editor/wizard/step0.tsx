import { Button, cn } from '@heroui/react';
import React from 'react';
import { useAnimatedWizardContext } from '~/view/base/animated-wizard';
import { useOccupancyEditorContext } from '../../occupancy-editor-context';
import { HouseholdEditor } from '../household-editor';
import { HouseholdSelect } from '../household-select';
import { type StepKeys } from './step-name';

interface Props {}

export const Step0: React.FC<Props> = ({}) => {
  const { goNext, goTo } = useAnimatedWizardContext<StepKeys>();
  const { occupancyInfoListMethods, occupancyFieldId, setOccupancyFieldId } =
    useOccupancyEditorContext();

  return (
    <div className={cn('flex flex-col gap-3')}>
      <div className={cn('flex items-start gap-2')}>
        <HouseholdSelect onSelect={setOccupancyFieldId} />
        <Button
          className="h-14"
          onPress={() => goTo('manager', { arg1: 'hey' })}
        >
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
