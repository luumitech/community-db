import { useMutation } from '@apollo/client';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { ModifyModal, type ModalArg } from './modify-modal';
import { InputData } from './use-hook-form';

export { type ModalArg } from './modify-modal';
export const useModalControl = useDisclosureWithArg<ModalArg>;
export type ModalControl = ReturnType<typeof useModalControl>;

const ThirdPartyIntegrationMailchimpSettingsMutation = graphql(/* GraphQL */ `
  mutation thirdPartyIntegration_mailchimp_communityModify(
    $input: CommunityModifyInput!
  ) {
    communityModify(input: $input) {
      id
      ...ThirdPartyIntegration_Mailchimp_Settings
    }
  }
`);

interface Props {
  modalControl: ModalControl;
}

export const SettingsModal: React.FC<Props> = ({ modalControl }) => {
  const [updateCommunity] = useMutation(
    ThirdPartyIntegrationMailchimpSettingsMutation
  );
  const { arg, disclosure } = modalControl;

  const onSave = React.useCallback(
    async (input: InputData) => {
      await toast.promise(
        updateCommunity({
          variables: { input },
        }),
        {
          pending: 'Saving...',
          // success: 'Saved',
        }
      );
    },
    [updateCommunity]
  );

  if (arg == null) {
    return null;
  }

  return <ModifyModal {...arg} disclosure={disclosure} onSave={onSave} />;
};
