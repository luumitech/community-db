import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { z, zz } from '~/lib/zod';
import { type DrawerArg } from './filter-drawer';

function schema() {
  return z.object({
    memberYearList: zz.coerce.toNumberList(),
    nonMemberYearList: zz.coerce.toNumberList(),
    memberEventList: zz.coerce.toStringList(),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

export function defaultInputData(drawerArg: DrawerArg): InputData {
  return {
    memberYearList: drawerArg.memberYearList,
    nonMemberYearList: drawerArg.nonMemberYearList,
    memberEventList: drawerArg.memberEventList,
  };
}

export function useHookForm(drawerArg: DrawerArg) {
  const defaultValues = React.useMemo(
    () => defaultInputData(drawerArg),
    [drawerArg]
  );
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
