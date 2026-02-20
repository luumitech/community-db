import { type FieldArrayPath } from 'react-hook-form';
import { useFieldArray, useFormContext } from '~/custom-hooks/hook-form';
import * as GQL from '~/graphql/generated/graphql';
import { z, zz } from '~/lib/zod';

/** Expected InputData format for editing the occupantList */
export const occupantListSchema = z.array(
  z.object({
    firstName: z.string(),
    lastName: z.string(),
    optOut: z.boolean(),
    infoList: z.array(
      z
        .object({
          type: z.nativeEnum(GQL.ContactInfoType),
          label: zz.string.nonEmpty('Must specify a label'),
          value: zz.string.nonEmpty('Must specify a value'),
        })
        .superRefine((form, ctx) => {
          switch (form.type) {
            case GQL.ContactInfoType.Email:
              if (!z.string().email().safeParse(form.value).success) {
                return ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: 'Invalid email',
                  path: ['value'],
                });
              }
              break;

            case GQL.ContactInfoType.Phone:
              break;

            default:
              break;
          }
        })
    ),
  })
);

export interface InputData {
  occupantList: z.infer<typeof occupantListSchema>;
}

export const occupantDefault: InputData['occupantList'][number] = {
  firstName: '',
  lastName: '',
  optOut: false,
  infoList: [],
};

export function useHookFormContext() {
  return useFormContext<InputData>();
}

export function useOccupantListMethods(controlName: string) {
  const { control } = useHookFormContext();
  const occupantListMethods = useFieldArray({
    control,
    name: controlName as unknown as 'occupantList',
  });
  return occupantListMethods;
}

export function useOccupantInfoListMethods(controlName: string) {
  const { control } = useHookFormContext();
  const occupantInfoListtMethods = useFieldArray({
    control,
    name: controlName as unknown as `occupantList.${number}.infoList`,
  });
  return occupantInfoListtMethods;
}
