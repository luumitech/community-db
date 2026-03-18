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
import { useGridStackContext, useLayoutUtil } from '~/view/base/grid-stack';
import { useWidgetDefinition, widgetIdList } from '../widget-definition';
import { useHookFormContext, type InputData } from './use-hook-form';

export interface DrawerArg {}

interface Props extends DrawerArg {
  disclosure: UseDisclosureReturn;
}

export const ConfigContent: React.FC<Props> = ({ disclosure }) => {
  const { onClose } = disclosure;
  const { formMethods, canReset } = useHookFormContext();
  const { widgets } = useGridStackContext();
  const { widgetList } = useWidgetDefinition();
  const { saveLayout, getLayout, resetLayout } = useLayoutUtil('dashboard');
  const { formState, control, watch, reset } = formMethods;
  const { isDirty } = formState;
  const widgetIdLst = watch('widgetIdList');

  return (
    <DrawerContent>
      {(closeDrawer) => (
        <>
          <DrawerHeader>Configuration</DrawerHeader>
          <DrawerBody className="flex flex-col gap-4">
            <div className="flex flex-col">
              <CheckboxGroup<InputData> controlName="widgetIdList">
                {Object.values(widgetList).map(({ id, name }) => (
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
              isDisabled={!isDirty}
              // onPress={saveLayout}
            >
              Save Layout
            </Button>
          </DrawerFooter>
        </>
      )}
    </DrawerContent>
  );
};
