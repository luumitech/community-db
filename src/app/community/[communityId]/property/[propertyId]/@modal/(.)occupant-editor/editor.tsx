import { Tab, Tabs } from '@heroui/react';
import { usePrevious } from '@uidotdev/usehooks';
import React from 'react';
import * as R from 'remeda';
import { useMediaQuery } from 'usehooks-ts';
import { ContactName } from './contact-name';
import { OccupantEditor } from './occupant-editor';
import {
  useHookFormContext,
  type OccupantFieldArrayReturn,
} from './use-hook-form';

interface Props {
  className?: string;
  occupantListMethods: OccupantFieldArrayReturn;
}

export const Editor: React.FC<Props> = ({ className, occupantListMethods }) => {
  const isSmallDevice = useMediaQuery('(max-width: 800px)');
  const { formState } = useHookFormContext();
  const { errors } = formState;
  const { fields, remove } = occupantListMethods;
  const [selectedKey, setSelectedKey] = React.useState(fields?.[0]?.id);
  const prevFieldsLength = usePrevious(fields.length);

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
      if (fieldToSelect) {
        setSelectedKey(fieldToSelect.id);
      }
    },
    [remove, fields, setSelectedKey]
  );

  React.useEffect(() => {
    // Switch to the newly added tab after new contact is added
    if (!!prevFieldsLength && fields.length > prevFieldsLength) {
      const lastField = fields[fields.length - 1];
      if (lastField) {
        setSelectedKey(lastField.id);
      }
    }
  }, [fields, prevFieldsLength]);

  return (
    <Tabs
      // Note tabs styling currently broken
      // See: https://github.com/heroui-inc/heroui/issues/5657
      classNames={{
        panel: 'grow',
        tab: 'justify-start',
        tabContent: 'w-full',
      }}
      aria-label="Options"
      isVertical={!isSmallDevice}
      selectedKey={selectedKey}
      onSelectionChange={(key) => setSelectedKey(key as string)}
    >
      {fields.map((field, idx) => {
        const controlNamePrefix = `occupantList.${idx}` as const;
        return (
          <Tab
            key={field.id}
            title={<ContactName controlNamePrefix={controlNamePrefix} />}
          >
            <OccupantEditor
              controlNamePrefix={controlNamePrefix}
              onRemove={() => onRemove(idx)}
            />
          </Tab>
        );
      })}
    </Tabs>
  );
};
