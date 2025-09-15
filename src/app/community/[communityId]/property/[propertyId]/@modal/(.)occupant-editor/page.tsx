'use client';
import { useMutation } from '@apollo/client';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { ModalDialog } from './modal-dialog';
import { InputData } from './use-hook-form';

const OccupantMutation = graphql(/* GraphQL */ `
  mutation occupantModify($input: PropertyModifyInput!) {
    propertyModify(input: $input) {
      property {
        ...PropertyId_OccupantEditor
      }
    }
  }
`);

interface Params {
  communityId: string;
  propertyId: string;
}

interface RouteArgs {
  params: Promise<Params>;
}

export default function OccupantEditor(props: RouteArgs) {
  const [updateProperty] = useMutation(OccupantMutation);

  const onSave = async (input: InputData) => {
    await toast.promise(
      updateProperty({
        variables: { input },
      }),
      {
        pending: 'Saving...',
        // success: 'Saved',
      }
    );
  };

  return <ModalDialog onSave={onSave} />;
}
