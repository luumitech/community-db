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
import { useGridStackContext } from '~/view/base/grid-stack';
import { useLayoutManagerContext } from '~/view/base/grid-stack-with-card';
import type { WidgetId } from '../widget-definition';
import { widgetInfo } from '../widget-definition';
import { type DrawerArg } from './config-form';
import { useHookFormContext, type InputData } from './use-hook-form';

interface Props extends DrawerArg {
  disclosure: UseDisclosureReturn;
}

export const ConfigContent: React.FC<Props> = ({ disclosure }) => {
  const { grid } = useGridStackContext();
  const { resetLayout } = useLayoutManagerContext<WidgetId>();
  const { formMethods } = useHookFormContext();
  const { reset, formState } = formMethods;
  const { isDirty } = formState;

  return (
    <DrawerContent>
      {(closeDrawer) => (
        <>
          <DrawerHeader>Configuration</DrawerHeader>
          <DrawerBody className="flex flex-col gap-4">
            <span className="font-bold">
              Select widgets to display in dashboard:
            </span>
            <CheckboxGroup<InputData> controlName="widgetIdList">
              {Object.entries(widgetInfo).map(([id, info]) => (
                <Checkbox key={id} value={id}>
                  <div>{info.label}</div>
                  <div>{info.description}</div>
                </Checkbox>
              ))}
            </CheckboxGroup>
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
              onPress={() => {
                resetLayout(grid);
                closeDrawer();
              }}
            >
              Restore To Default
            </Button>
            <Button type="submit" color="primary" isDisabled={!isDirty}>
              Apply Change
            </Button>
          </DrawerFooter>
        </>
      )}
    </DrawerContent>
  );
};
