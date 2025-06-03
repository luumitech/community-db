import { useQuery } from '@apollo/client';
import { Button, cn } from '@heroui/react';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { Icon } from '~/view/base/icon';
import { usePageContext } from '../page-context';
import { AudienceListSelect } from './audience-list-select';
import {
  SettingsModal,
  useModalControl,
  type ModalArg,
} from './settings-modal';

const ThirdPartyIntegration_MailchimpMemberListQuery = graphql(/* GraphQL */ `
  query mailchimpMemberList($input: MailchimpMemberListInput!) {
    mailchimpMemberList(input: $input) {
      email
      fullName
      status
    }
  }
`);

interface Props {
  className?: string;
}

export const Mailchimp: React.FC<Props> = ({ className }) => {
  const { community } = usePageContext();
  const modalControl = useModalControl();
  const result = useQuery(ThirdPartyIntegration_MailchimpMemberListQuery, {
    variables: {
      input: {
        communityId: community.id,
        listId: '9e1f03ec3e',
      },
    },
  });
  useGraphqlErrorHandler(result);

  return (
    <div className={cn(className, 'flex flex-col gap-4')}>
      <p className="text-foreground-500 text-sm">
        Adding a Mailchimp API key enables synchronization between the Mailchimp
        audience list and the community contact list.
      </p>
      <div>
        <Button
          size="sm"
          startContent={<Icon icon="settings" />}
          onPress={() => modalControl.open({ community })}
        >
          Configure Mailchimp Settings
        </Button>
      </div>
      <AudienceListSelect />
      <SettingsModal modalControl={modalControl} />
    </div>
  );
};
