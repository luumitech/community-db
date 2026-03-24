import { type UseDisclosureReturn } from '@heroui/use-disclosure';
import { GridStack } from 'gridstack';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { Form } from '~/view/base/form';
import { type WidgetId } from '../widget-definition';
import { ConfigContent } from './config-content';
import { useHookForm, type InputData } from './use-hook-form';

export interface DrawerArg {
  grid: GridStack;
}

interface Props extends DrawerArg {
  disclosure: UseDisclosureReturn;
  widgetIdsShown: WidgetId[];
  setWidgets: (idList: WidgetId[]) => void;
}

export const ConfigForm: React.FC<Props> = ({
  disclosure,
  widgetIdsShown,
  setWidgets,
  ...arg
}) => {
  const { onClose } = disclosure;
  const { formMethods } = useHookForm(arg.grid, widgetIdsShown);
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
