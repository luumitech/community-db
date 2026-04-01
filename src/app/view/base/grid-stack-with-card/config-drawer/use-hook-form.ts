import { zodResolver } from '@hookform/resolvers/zod';
import { type GridStack } from 'gridstack';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { z, zz } from '~/lib/zod';

function schema() {
  return z.object({
    widgetIdList: z.array(z.string()),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(
  grid: GridStack,
  widgetsToShow: readonly string[]
): InputData {
  return {
    widgetIdList: [...widgetsToShow],
  };
}

export function useHookForm(grid: GridStack, widgetsToShow: readonly string[]) {
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

  return { formMethods };
}
