import { Button, cn } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import * as GQL from '~/graphql/generated/graphql';
import { useFieldArray, useHookFormContext } from '../use-hook-form';
import { HouseholdArchiveButton } from './household-archive-button';
import { HouseholdDeleteButton } from './household-delete-button';
import { HouseholdEditor } from './household-editor';
import { HouseholdMakeCurrentButton } from './household-make-current-button';
import { HouseholdSelect } from './household-select';

interface Props {
  className?: string;
  /** Email to highlight in contact list on first render */
  defaultEmail?: string;
}

export const OccupancyEditor: React.FC<Props> = ({
  className,
  defaultEmail,
}) => {
  const { control } = useHookFormContext();
  const occupancyInfoListMethods = useFieldArray({
    control,
    name: 'occupancyInfoList',
  });
  const { fields } = occupancyInfoListMethods;

  /** Find the household that has the email specified in `defaultTab` */
  const defaultHouseholdId = React.useMemo(() => {
    const firstFieldId = fields[0].id;
    if (!defaultEmail) {
      return firstFieldId;
    }
    const found = fields.find(({ occupantList }) => {
      return occupantList.find(({ infoList }) =>
        infoList.find(
          ({ type, value }) =>
            type === GQL.ContactInfoType.Email && value === defaultEmail
        )
      );
    });
    return found?.id ?? firstFieldId;
  }, [fields, defaultEmail]);

  const [occupancyFieldId, setOccupancyFieldId] =
    React.useState(defaultHouseholdId);

  const onRemove = React.useCallback(
    (removedIdx: number) => {
      // Always go to current occupants after removing an entry
      const fieldToSelect = fields[removedIdx === 0 ? 1 : 0];
      setOccupancyFieldId(fieldToSelect.id);
    },
    [fields]
  );

  const isSelectedCurrentOccupant = React.useMemo(() => {
    return fields[0].id === occupancyFieldId;
  }, [fields, occupancyFieldId]);

  return (
    <div className={twMerge('flex flex-col gap-3', className)}>
      <div className={twMerge('flex items-start gap-2', className)}>
        <HouseholdSelect
          occupancyInfoListMethods={occupancyInfoListMethods}
          occupancyFieldId={occupancyFieldId}
          onSelect={setOccupancyFieldId}
        />
        <div className="flex h-14 gap-2">
          {isSelectedCurrentOccupant ? (
            <HouseholdArchiveButton
              className="h-full"
              occupancyInfoListMethods={occupancyInfoListMethods}
              occupancyFieldId={occupancyFieldId}
            />
          ) : (
            <HouseholdMakeCurrentButton
              className="h-full"
              occupancyInfoListMethods={occupancyInfoListMethods}
              occupancyFieldId={occupancyFieldId}
            />
          )}
          <HouseholdDeleteButton
            className="h-full"
            occupancyInfoListMethods={occupancyInfoListMethods}
            occupancyFieldId={occupancyFieldId}
            onPress={onRemove}
          />
        </div>
      </div>
      {occupancyInfoListMethods.fields.map((entry, idx) => (
        <HouseholdEditor
          key={entry.id}
          className={cn(entry.id !== occupancyFieldId && 'hidden')}
          controlNamePrefix={`occupancyInfoList.${idx}`}
          defaultEmail={defaultEmail}
        />
      ))}
    </div>
  );
};
