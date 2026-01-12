import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { useSelector } from '~/custom-hooks/redux';
import * as GQL from '~/graphql/generated/graphql';
import { initialState, isFilterSpecified } from '~/lib/reducers/mailchimp';
import { z, zz } from '~/lib/zod';
function schema() {
  return z.object({
    subscriberStatusList:
      zz.coerce.toStringList<GQL.MailchimpSubscriberStatus>(),
    optOut: zz.coerce.toBoolean({ nullable: true }),
    warning: zz.coerce.toBoolean({ nullable: true }),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

export function useHookForm() {
  const mailchimp = useSelector((state) => state.mailchimp);
  const defaultValues = React.useMemo(
    () => mailchimp.filter,
    [mailchimp.filter]
  );
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });
  const { setValue, watch } = formMethods;
  const formValues = watch();

  /** Check if the form can be reset to its original state */
  const canReset = React.useMemo(() => {
    const result = schema().safeParse(formValues);
    if (!result.success) {
      return true;
    }
    return isFilterSpecified(result.data);
  }, [formValues]);

  const reset = React.useCallback(() => {
    const { subscriberStatusList, optOut, warning } = initialState.filter;
    setValue('subscriberStatusList', subscriberStatusList, {
      shouldDirty: true,
    });
    setValue('optOut', optOut, { shouldDirty: true });
    setValue('warning', warning, { shouldDirty: true });
  }, [setValue]);

  return { formMethods, canReset, reset };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
