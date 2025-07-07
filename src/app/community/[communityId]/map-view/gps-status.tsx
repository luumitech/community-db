import { useMutation } from '@apollo/client';
import { cn } from '@heroui/react';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { usePageContext } from './page-context';

const PropertyCompleteGpsMutation = graphql(/* GraphQL */ `
  mutation propertyCompleteGps($input: PropertyCompleteGpsInput!) {
    propertyCompleteGps(input: $input) {
      propertyList {
        id
        lat
        lon
        updatedAt
        updatedBy {
          ...User
        }
      }
    }
  }
`);

interface Props {
  className?: string;
}

export const GpsStatus: React.FC<Props> = ({ className }) => {
  const { community } = usePageContext();
  const [updateProperty] = useMutation(PropertyCompleteGpsMutation);

  const completeGps = React.useCallback(async () => {
    await toast.promise(
      updateProperty({
        variables: { input: { communityId: community.id } },
      }),
      {
        pending: 'Please wait...',
        // success: 'Saved',
      }
    );
  }, [community.id, updateProperty]);

  return (
    <div className={cn(className)}>
      <button onClick={() => completeGps()}>Get GPS coord</button>
    </div>
  );
};
