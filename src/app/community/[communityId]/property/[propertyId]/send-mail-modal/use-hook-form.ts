import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { z, zz } from '~/lib/zod';
import { type OccupantList } from './_type';

function schema() {
  return z.object({
    subject: zz.string.nonEmpty('Please enter a subject'),
    toEmail: zz.string.nonEmpty('Please select at least one recipient'),
    message: zz.string.nonEmpty('Please enter a message'),
    hidden: z.object({
      membershipYear: z.string(),
      /** SelectItems for To: email recipients */
      toItems: z.array(
        z.object({
          email: z.string(),
          firstName: z.string(),
          fullName: z.string(),
        })
      ),
    }),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(
  membershipYear: string,
  occupantList: OccupantList
): InputData {
  const toItems: InputData['hidden']['toItems'] = [];
  occupantList.forEach((entry) => {
    if (entry.email) {
      const fullName = `${entry.firstName ?? ''} ${
        entry.lastName ?? ''
      }`.trim();
      toItems.push({
        email: entry.email,
        firstName: (entry.firstName ?? '').trim(),
        fullName,
      });
    }
  });

  const message = [
    `Hi ${toItems.map(({ firstName }) => firstName).join(', ')},`,
    '',
    `Thank you for submitting your ${membershipYear} membership fee. We would like to confirm that we have received the payment and have successfully updated your membership status for ${membershipYear} in our records.`,
    '',
    'Please don’t hesitate to reach out if you have any questions.',
    '',
    'Best regards,',
  ].join('\n');

  return {
    subject: 'Membership Registration Confirmation',
    toEmail: toItems.map(({ email }) => email).join(','),
    message,
    hidden: {
      membershipYear,
      toItems,
    },
  };
}

export function useHookForm(
  membershipYear: string,
  occupantList: OccupantList
) {
  const defaultValues = React.useMemo(() => {
    return defaultInputData(membershipYear, occupantList);
  }, [membershipYear, occupantList]);
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
