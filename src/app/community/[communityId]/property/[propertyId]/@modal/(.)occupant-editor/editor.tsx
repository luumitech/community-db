import { cn, Tab, Tabs } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { useMediaQuery } from 'usehooks-ts';
import { ContactEditor } from './contact-editor';
import { ContactName } from './contact-name';
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
  const [selectedKey, setSelectedKey] = React.useState(fields?.[0].id);

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

  return (
    <Tabs
      // Note tabs styling currently broken
      // See: https://github.com/heroui-inc/heroui/issues/5657
      classNames={{
        panel: 'flex-grow',
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
            <ContactEditor
              controlNamePrefix={controlNamePrefix}
              onRemove={() => remove(idx)}
            />
          </Tab>
        );
      })}
    </Tabs>
  );
};
