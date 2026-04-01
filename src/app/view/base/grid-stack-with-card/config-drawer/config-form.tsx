import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import { GridStack } from 'gridstack';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { Form } from '~/view/base/form';
import { useLayoutManagerContext } from '~/view/base/grid-stack-with-card';
import type { WidgetInfo } from '../_type';
import { ConfigContent } from './config-content';
import { useHookForm, type InputData } from './use-hook-form';

export interface DrawerArg {
  grid: GridStack;
  widgetInfo: Record<string, WidgetInfo>;
}

interface Props extends DrawerArg {
  disclosure: UseDisclosureReturn;
}

export const ConfigForm: React.FC<Props> = ({ disclosure, ...arg }) => {
  const { onClose } = disclosure;
  const { widgetIdList, setWidgets } = useLayoutManagerContext<string>();
  const { formMethods } = useHookForm(arg.grid, widgetIdList);
  const { handleSubmit } = formMethods;

  const onSubmit = React.useCallback(
    async (input: InputData) => {
      setWidgets(input.widgetIdList);
      onClose();
    },
    [onClose, setWidgets]
  );

  return (
    <FormProvider {...formMethods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ConfigContent {...arg} disclosure={disclosure} />
      </Form>
    </FormProvider>
  );
};
