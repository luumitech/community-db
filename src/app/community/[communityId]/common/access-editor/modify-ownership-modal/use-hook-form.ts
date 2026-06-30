import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/types';
import { z, zz } from '~/lib/zod';

const ModifyFragment = graphql(/* GraphQL */ `
  fragment CommunityOwner_Modify on Community {
    id
    updatedAt
    owner {
      id
    }
    access {
      id
      user {
        id
        email
      }
    }
    otherAccessList {
      id
      user {
        id
        email
      }
    }
  }
`);
export type ModifyFragmentType = FragmentType<typeof ModifyFragment>;

function schema() {
  return z.object({
    self: z.object({
      id: zz.string.nonEmpty(),
      updatedAt: zz.string.nonEmpty(),
    }),
    ownerId: zz.string.nonEmpty(),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(
  community: GQL.CommunityOwner_ModifyFragment
): InputData {
  return {
    self: {
      id: community.id,
      updatedAt: community.updatedAt,
    },
    ownerId: community.owner.id,
  };
}

export function useHookForm(fragment: ModifyFragmentType) {
  const community = getFragment(ModifyFragment, fragment);
  const defaultValues = React.useMemo(
    () => defaultInputData(community),
    [community]
  );
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods, community };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
