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
import { type DrawerArg } from './config-form';
import { useHookFormContext, type InputData } from './use-hook-form';

interface Props extends DrawerArg {
  disclosure: UseDisclosureReturn;
}

export const ConfigContent: React.FC<Props> = ({ disclosure, ...arg }) => {
  const { grid } = useGridStackContext();
  const { resetLayout } = useLayoutManagerContext<string>();
  const { formMethods } = useHookFormContext();
  const { reset, formState } = formMethods;
  const { isDirty } = formState;
  const { widgetInfo } = arg;

  return (
    <DrawerContent>
      {(closeDrawer) => (
        <>
          <DrawerHeader>Dashboard Configuration</DrawerHeader>
          <DrawerBody className="flex flex-col gap-4">
            <span>Select widgets to display in dashboard:</span>
            <CheckboxGroup<InputData>
              controlName="widgetIdList"
              orientation="horizontal"
            >
              {Object.entries(widgetInfo).map(([id, info]) => (
                <Checkbox
                  aria-label={info.label}
                  classNames={{
                    base: cn(
                      'm-0 flex max-w-full bg-content1',
                      'items-center justify-start hover:bg-content2',
                      'gap-2 rounded-lg border-2 p-4',
                      'data-[selected=true]:border-primary'
                    ),
                    label: 'w-full',
                  }}
                  key={id}
                  value={id}
                >
                  <div className="flex flex-col">
                    {info.label}
                    <span className="text-tiny text-default-500">
                      {info.description}
                    </span>
                  </div>
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
