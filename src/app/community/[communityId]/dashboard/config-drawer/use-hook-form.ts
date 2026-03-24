import { zodResolver } from '@hookform/resolvers/zod';
import { type GridStack } from 'gridstack';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { z, zz } from '~/lib/zod';
import { widgetIdList, type WidgetId } from '../widget-definition';

function schema() {
  return z.object({
    widgetIdList: z.array(z.enum(widgetIdList)),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(
  grid: GridStack,
  widgetsToShow: readonly WidgetId[]
): InputData {
  return {
    widgetIdList: [...widgetsToShow],
  };
}

export function useHookForm(
  grid: GridStack,
  widgetsToShow: readonly WidgetId[]
) {
  const defaultValues = React.useMemo(() => {
    return defaultInputData(grid, widgetsToShow);
  }, [grid, widgetsToShow]);
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods };
}

export function useHookFormContext() {
  const formMethods = useFormContext<InputData>();
  const { setValue, watch } = formMethods;
  const formValues = watch();

  /** Check if the form can be reset to its original state */
  const canReset = React.useMemo(() => {
    const result = schema().safeParse(formValues);
    if (!result.success) {
      return true;
    }
    // check if grid layout is saved?
    return true;
  }, [formValues]);

  return { formMethods, canReset };
}
