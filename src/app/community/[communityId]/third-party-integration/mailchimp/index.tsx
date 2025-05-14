import { useQuery } from '@apollo/client';
import { Button, cn } from '@heroui/react';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { usePageContext } from '../page-context';
import {
  SettingsModal,
  useModalControl,
  type ModalArg,
} from './settings-modal';

const ExportContact_MailchimpMemberListQuery = graphql(/* GraphQL */ `
  query exportContactMailchimpMemberList($input: MailchimpMemberListInput!) {
    mailchimpMemberList(input: $input) {
      email
      fullName
    }
  }
`);

interface Props {
  className?: string;
}

export const Mailchimp: React.FC<Props> = ({ className }) => {
  const { community } = usePageContext();
  const modalControl = useModalControl();
  // const result = useQuery(ExportContact_MailchimpMemberListQuery, {
  //   variables: {
  //     input: {
  //       communityId,
  //       listId: 'xxx',
  //     },
  //   },
  // });
  // useGraphqlErrorHandler(result);

  return (
    <div className={cn(className)}>
      <Button onPress={() => modalControl.open({ community })}>modal</Button>
      <SettingsModal modalControl={modalControl} />
    </div>
  );
};
