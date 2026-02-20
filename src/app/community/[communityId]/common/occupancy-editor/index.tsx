import { cn, Divider, Tab, Tabs } from '@heroui/react';
import React from 'react';
import { usePreviousDistinct } from 'react-use';
import * as R from 'remeda';
import { useAppContext } from '~/custom-hooks/app-context';
import * as GQL from '~/graphql/generated/graphql';
import { Icon } from '~/view/base/icon';
import { ContactEditor } from './contact-editor';
import { ContactName } from './contact-name';
import { OccupancyDatesEditor } from './occupancy-dates-editor';
import {
  occupantDefault,
  useHookFormContext,
  useOccupantListMethods,
} from './use-hook-form';

interface Props {
  className?: string;
  /**
   * OccupancyList hook-form control name prefix
   *
   * I.e. `pastOccupancy.${yearIdx}.occupancyList`
   */
  controlNamePrefix: string;
  /** Open tab that contains this email on first render */
  defaultEmail?: string;
}

export const OccupancyEditor: React.FC<Props> = ({
  className,
  controlNamePrefix,
  defaultEmail,
}) => {
  const { isMdDevice } = useAppContext();
  const { formState } = useHookFormContext();
  const { errors } = formState;

  const { fields, remove, append } = useOccupantListMethods(controlNamePrefix);
  const prevFieldsLength = usePreviousDistinct(fields.length);
  const isVerticalTab = !isMdDevice;

  /** Find the tab that has the email specified in `defaultTab` */
  const defaultTabId = React.useMemo(() => {
    const firstTabId = fields?.[0]?.id;
    if (!defaultEmail) {
      return firstTabId;
    }
    const foundTab = fields.find(({ infoList }) =>
      infoList.find(
        ({ type, value }) =>
          type === GQL.ContactInfoType.Email && value === defaultEmail
      )
    );
    return foundTab?.id ?? firstTabId;
  }, [fields, defaultEmail]);

  const [selectedKey, setSelectedKey] = React.useState(defaultTabId);

  const errObj = R.pathOr(errors, R.stringToPath('occupantList'), {});
  React.useEffect(() => {
    // If there is a form validation error, select the tab that contains the error
    if (Array.isArray(errObj)) {
      const idx = errObj.findIndex((arr) => !R.isEmpty(arr));
      if (idx !== -1) {
        setSelectedKey(fields[idx]?.id);
      }
    }
    //
  }, [errObj, fields]);

  const onRemove = React.useCallback(
    (fieldIdx: number) => {
      remove(fieldIdx);
      const fieldToSelect = fields[fieldIdx > 0 ? fieldIdx - 1 : 1];
      setSelectedKey(fieldToSelect?.id ?? null);
    },
    [remove, fields, setSelectedKey]
  );

  const addContactButton = React.useMemo(() => {
    return (
      <div
        className="flex cursor-pointer items-center gap-2 text-primary"
        onClick={(evt) => {
          // Prevent default action, which is to switch to tab content
          evt.stopPropagation();
          append(occupantDefault);
        }}
      >
        Add Contact <Icon icon="person-add" />
      </div>
    );
  }, [append]);

  React.useEffect(() => {
    // Switch to the newly added tab after new contact is added
    if (prevFieldsLength != null && fields.length > prevFieldsLength) {
      const lastField = fields[fields.length - 1];
      if (lastField) {
        setSelectedKey(lastField.id);
      }
    }
  }, [fields, prevFieldsLength]);

  return (
    <Tabs
      classNames={{
        panel: 'grow',
        tab: cn('w-auto max-w-[150px] flex-none'),
        tabContent: cn('h-5 w-full'),
        tabList: cn('flex flex-wrap gap-1'),
      }}
      aria-label="Occupancy Editor"
      disabledKeys={['divider']}
      isVertical={isVerticalTab}
      selectedKey={selectedKey}
      onSelectionChange={(key) => setSelectedKey(key as string)}
    >
      {fields.map((field, idx) => {
        const cnPrefix =
          `${controlNamePrefix}.${idx}` as `occupantList.${number}`;
        return (
          <Tab
            key={field.id}
            title={<ContactName controlNamePrefix={cnPrefix} />}
          >
            <ContactEditor
              controlNamePrefix={cnPrefix}
              onRemove={() => onRemove(idx)}
            />
          </Tab>
        );
      })}
      {fields.length > 0 && (
        <Tab
          key="divider"
          className={cn(
            isVerticalTab && 'h-[10px] w-full',
            // Revert default styling when tab is disabled
            'data-[disabled=true]:cursor-default data-[disabled=true]:opacity-100'
          )}
          title={
            <Divider
              className={cn(isVerticalTab && 'absolute top-1/2')}
              orientation={isVerticalTab ? 'horizontal' : 'vertical'}
            />
          }
        />
      )}
      <Tab key="addContact" title={addContactButton} />
      <Tab key="summary" title="Occupancy Dates">
        <OccupancyDatesEditor startDateControlName="occupantStartDate" />
      </Tab>
    </Tabs>
  );
};
