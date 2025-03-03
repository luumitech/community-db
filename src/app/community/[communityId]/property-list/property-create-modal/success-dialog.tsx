import { Button, Link, cn } from '@heroui/react';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { appPath } from '~/lib/app-path';

interface Props {
  className?: string;
  communityId: string;
  property?: GQL.PropertyCreateMutation['propertyCreate'];
}

export const SuccessDialog: React.FC<Props> = ({
  className,
  communityId,
  property,
}) => {
  if (!property) {
    return null;
  }

  return (
    <div className={cn(className, 'flex items-center gap-2 text-sm')}>
      Created
      <Button
        as={Link}
        color="primary"
        variant="faded"
        size="sm"
        href={appPath('property', {
          path: {
            communityId,
            propertyId: property.id,
          },
        })}
      >
        {property.address}
      </Button>
    </div>
  );
};
