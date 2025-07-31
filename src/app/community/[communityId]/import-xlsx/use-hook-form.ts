import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import * as GQL from '~/graphql/generated/graphql';
import { z, zz } from '~/lib/zod';

const ONE_SQUARE_KILOMETER = 1000000; // 1 km² in square meters
const SQUARE_KILOMETER_LIMIT = 3; // Maximum area of drawn boundary in km²

function schema() {
  return z
    .object({
      id: zz.string.nonEmpty(),
      method: z.nativeEnum(GQL.ImportMethod),
      map: z
        .array(
          z.object({
            lat: z.number(),
            lon: z.number(),
          })
        )
        .nullable(),
      hidden: z.object({
        // To be mapped to xlsx argument later
        importList: zz.coerce.toFileArray({
          message: 'Please upload a valid xlsx file',
        }),
        /** Area of the map drawn by user */
        mapArea: z.number(),
      }),
    })
    .refine(
      (form) => {
        if (form.method !== GQL.ImportMethod.Xlsx) {
          return true;
        }
        return form.hidden.importList.length > 0;
      },
      {
        message: 'Please upload a valid xlsx file',
        path: ['hidden', 'importList'],
      }
    )
    .refine(
      (form) => {
        if (form.method !== GQL.ImportMethod.Map) {
          return true;
        }
        return form.map && form.map.length > 0;
      },
      {
        message: 'Please draw a boundary containing properties to import',
        path: ['map'],
      }
    )
    .refine(
      (form) => {
        if (form.method !== GQL.ImportMethod.Map) {
          return true;
        }
        const { mapArea } = form.hidden;

        return (
          mapArea > 0 && mapArea < SQUARE_KILOMETER_LIMIT * ONE_SQUARE_KILOMETER
        );
      },
      {
        message: `Boundary exceeded ${SQUARE_KILOMETER_LIMIT} km², please reduce the area`,
        path: ['map'],
      }
    );
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(communityId: string): InputData {
  return {
    id: communityId,
    method: GQL.ImportMethod.Xlsx,
    map: null,
    hidden: {
      importList: [],
      mapArea: 0,
    },
  };
}

export function useHookForm(communityId: string) {
  const defaultValues = React.useMemo(
    () => defaultInputData(communityId),
    [communityId]
  );
  const formMethods = useForm({
    /**
     * Due to the way confirmation dialog handles submission, manual validation
     * can happen before form submission. Because we don't know when manual
     * validation may occur, attach 'onChange' event listeners will make the
     * form more closely behave like 'onSubmit'
     */
    mode: 'onChange',
    defaultValues,
    resolver: zodResolver(schema()),
  });
  const { reset } = formMethods;

  React.useEffect(() => {
    // After form is submitted, update the form with new defaults
    reset(defaultValues);
  }, [reset, defaultValues]);

  return { formMethods };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
