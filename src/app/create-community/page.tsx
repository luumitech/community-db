'use client';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { MainMenu } from '~/view/main-menu';

interface InputData {
  name: string;
}

const defaultValues: InputData = {
  name: '',
};

const schema = yup.object().shape({
  name: yup.string().required('Please provide a name'),
});

const CommunityCreateMutation = graphql(/* GraphQL */ `
  mutation communityCreate($name: String!) {
    communityCreate(name: $name) {
      id
      name
    }
  }
`);

interface Props {}

const SelectCommunity: React.FC<Props> = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [create, result] = useMutation(CommunityCreateMutation);
  useGraphqlErrorHandler(result);
  const { handleSubmit, formState, register, reset } = useForm<InputData>({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  if (!session) {
    return null;
  }

  const createCommunity = async (form: InputData) => {
    const newCommunity = await create({ variables: form });
    const newId = newCommunity.data?.communityCreate.id;
    if (newId) {
      router.push(`/community/${newId}`);
    }
  };

  return (
    <div>
      <Input
        autoFocus
        label="Community name"
        placeholder="Enter community name"
        isRequired
        variant="faded"
        errorMessage={errors.name?.message}
        defaultValue={defaultValues.name}
        {...register('name')}
      />
      <Button
        className="mt-2"
        color="primary"
        type="submit"
        isLoading={result.loading}
        // @ts-expect-error
        onPress={handleSubmit(createCommunity)}
      >
        Create
      </Button>
    </div>
  );
};

export default SelectCommunity;
