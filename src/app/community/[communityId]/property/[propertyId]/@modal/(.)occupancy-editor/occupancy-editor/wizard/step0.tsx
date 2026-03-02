import { ModalBody, cn } from '@heroui/react';
import React from 'react';
import { useOccupancyEditorContext } from '~/community/[communityId]/property/[propertyId]/@modal/(.)occupancy-editor/occupancy-editor-context';
import { Button } from '~/view/base/button';
import { ContactInfoEditor } from '../contact-info-editor';
import { HouseholdSelect } from '../household-select';
import { Wizard } from './';

export interface Step0Props {}

export const Step0: React.FC<Step0Props> = () => {
  const { goNext, goTo } = Wizard.useWizard();
  const { occupancyInfoListMethods, occupancyFieldId, setOccupancyFieldId } =
    useOccupancyEditorContext();

  return (
    <ModalBody className={cn('flex flex-col gap-3')}>
      <div className={cn('flex items-start gap-2')}>
        <HouseholdSelect onSelect={setOccupancyFieldId} />
        <Button
          className="h-14"
          tooltip="Manage households"
          onPress={() => goTo('manager', {})}
        >
          Manage
        </Button>
      </div>
      {occupancyInfoListMethods.fields.map((entry, idx) => (
        <ContactInfoEditor
          key={entry.id}
          className={cn('grow', entry.id !== occupancyFieldId && 'hidden')}
          controlNamePrefix={`occupancyInfoList.${idx}`}
        />
      ))}
    </ModalBody>
  );
};
