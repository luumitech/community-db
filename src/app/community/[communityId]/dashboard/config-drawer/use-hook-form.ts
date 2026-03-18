import { zodResolver } from '@hookform/resolvers/zod';
import { type GridStack } from 'gridstack';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { z, zz } from '~/lib/zod';
import { useGridStackContext } from '~/view/base/grid-stack';
import { widgetIdList } from '../widget-definition';

function schema() {
  return z.object({
    widgetIdList: z.array(z.enum(widgetIdList)),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(grid?: GridStack): InputData {
  return {
    widgetIdList: [...widgetIdList],
  };
}

export function useHookForm() {
  const { grid } = useGridStackContext();
  const defaultValues = React.useMemo(() => {
    return defaultInputData(grid);
  }, [grid]);
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
