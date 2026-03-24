import {
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  cn,
} from '@heroui/react';
import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { Button } from '~/view/base/button';
import { Checkbox, CheckboxGroup } from '~/view/base/checkbox';
import { widgetName } from '../widget-definition';
import { type DrawerArg } from './config-form';
import { useHookFormContext, type InputData } from './use-hook-form';

interface Props extends DrawerArg {
  disclosure: UseDisclosureReturn;
}

export const ConfigContent: React.FC<Props> = ({ disclosure }) => {
  const { formMethods, canReset } = useHookFormContext();
  // const { widgetList } = useWidgetDefinition();
  const { reset } = formMethods;

  return (
    <DrawerContent>
      {(closeDrawer) => (
        <>
          <DrawerHeader>Configuration</DrawerHeader>
          <DrawerBody className="flex flex-col gap-4">
            <div className="flex flex-col">
              <CheckboxGroup<InputData> controlName="widgetIdList">
                {Object.entries(widgetName).map(([id, name]) => (
                  <Checkbox key={id} value={id}>
                    {name}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button
              variant="bordered"
              // isDisabled={pending}
              onPress={closeDrawer}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              variant="bordered"
              isDisabled={!canReset}
              onPress={() => reset()}
            >
              Reset
            </Button>
            <Button
              type="submit"
              color="primary"
              /**
               * Don't want to disable this button, even if there is no change
               * in the form, we still want to store the current layout into
               * localstorage
               */
              // isDisabled={!isDirty}
            >
              Apply Change
            </Button>
          </DrawerFooter>
        </>
      )}
    </DrawerContent>
  );
};
