import { useMutation } from '@apollo/client';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { graphql } from '~/graphql/generated';
import { CommunityFromIdDocument } from '~/graphql/generated/graphql';
import { toast } from '~/view/base/toastify';
import { useLayoutContext } from '../layout-context';
import { ModifyModal, type ModalArg } from './modify-modal';
import { InputData } from './use-hook-form';

export { type ModalArg } from './modify-modal';
export const useModalControl = useDisclosureWithArg<ModalArg>;
export type ModalControl = ReturnType<typeof useModalControl>;

const PropertyMutation = graphql(/* GraphQL */ `
  mutation propertyModify($input: PropertyModifyInput!) {
    propertyModify(input: $input) {
      property {
        ...PropertyId_PropertyEditor
      }
    }
  }
`);

interface Props {
  modalControl: ModalControl;
}

export const PropertyModifyModal: React.FC<Props> = ({ modalControl }) => {
  const [updateProperty] = useMutation(PropertyMutation);
  const { community } = useLayoutContext();
  const { arg, disclosure } = modalControl;

  const onSave = React.useCallback(
    async (_input: InputData) => {
      const { lat, lon, ...input } = _input;
      await toast.promise(
        updateProperty({
          variables: {
            input: {
              lat: lat?.toString() ?? null,
              lon: lon?.toString() ?? null,
              ...input,
            },
          },
          refetchQueries: [
            // Updating property address may cause property to change order within
            // the property list
            { query: CommunityFromIdDocument, variables: { id: community.id } },
          ],
        }),
        {
          pending: 'Saving...',
          // success: 'Saved',
        }
      );
    },
    [updateProperty, community]
  );

  if (arg == null) {
    return null;
  }

  return <ModifyModal {...arg} disclosure={disclosure} onSave={onSave} />;
};
