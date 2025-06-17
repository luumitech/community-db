import { useMutation } from '@apollo/client';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/react';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { graphql } from '~/graphql/generated';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import { toast } from '~/view/base/toastify';
import { usePageContext } from '../../page-context';
import { ApiKey } from './api-key';
import { useHookForm, type InputData } from './use-hook-form';

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

interface Props {}

export const Settings: React.FC<Props> = () => {
  const { community: fragment } = usePageContext();
  const [updateCommunity, result] = useMutation(
    ThirdPartyIntegrationMailchimpSettingsMutation
  );
  const { formMethods, community } = useHookForm(fragment);
  const { formState, handleSubmit } = formMethods;
  const { isDirty } = formState;

  const onSubmit = React.useCallback(
    async (input: InputData) => {
      await toast.promise(
        updateCommunity({
          variables: {
            input: {
              self: {
                id: community.id,
                updatedAt: community.updatedAt,
              },
              ...input,
            },
          },
        }),
        {
          pending: 'Saving...',
          // success: 'Saved',
        }
      );
    },
    [updateCommunity, community]
  );

  return (
    <FormProvider {...formMethods}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Card shadow="none">
          <CardHeader className="flex justify-between">
            Mailchimp Integration Settings
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4">
              <p className="text-foreground-500 text-sm">
                Adding a Mailchimp API key enables reading of Mailchimp audience
                list.
              </p>
              <ApiKey />
            </div>
          </CardBody>
          <CardFooter className="flex items-center">
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                color="primary"
                isDisabled={!isDirty}
                isLoading={result.loading}
              >
                Update
              </Button>
            </div>
          </CardFooter>
        </Card>
      </Form>
    </FormProvider>
  );
};
