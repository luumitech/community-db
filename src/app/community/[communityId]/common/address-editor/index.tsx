'use client';
import { cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { appLabel, appPath } from '~/lib/app-path';
import { Input } from '~/view/base/input';
import { Link } from '~/view/base/link';
import { MapContextProvider } from '~/view/base/map';
import { NumberInput } from '~/view/base/number-input';
import { Map } from './map';

interface Props {
  className?: string;
}

export const AddressEditor: React.FC<Props> = ({ className }) => {
  const { community, hasGeoapifyApiKey } = useLayoutContext();
  const [pending, onStartLookup] = React.useTransition();

  return (
    <div
      className={cn(className, 'grid grid-cols-1 sm:grid-cols-2 gap-4 mx-4')}
    >
      <div className="flex flex-col gap-2">
        {!hasGeoapifyApiKey && (
          <p className="text-warning text-sm">
            A valid Geoapify API key is required for address lookup. To enable
            this feature, please enter your API key in the{' '}
            <Link
              size="sm"
              href={appPath('thirdPartyIntegration', {
                path: { communityId: community.id },
                query: { tab: 'geoapify' },
              })}
            >
              {appLabel('thirdPartyIntegration')}
            </Link>{' '}
            settings.
          </p>
        )}
        <MapContextProvider>
          <Map className="h-full min-h-[300px]" onStartLookup={onStartLookup} />
        </MapContextProvider>
      </div>
      <div className="flex flex-col grow gap-2">
        <Input
          className={className}
          controlName="address"
          variant="bordered"
          label="Display Address"
          isDisabled={pending}
          isControlled
        />
        <Input
          className={className}
          controlName="streetNo"
          variant="bordered"
          label="Street Number"
          isDisabled={pending}
          isControlled
        />
        <Input
          className={className}
          controlName="streetName"
          variant="bordered"
          label="Street Name"
          isDisabled={pending}
          isControlled
        />
        <Input
          className={className}
          controlName="city"
          variant="bordered"
          label="City"
          isDisabled={pending}
          isControlled
        />
        <Input
          className={className}
          controlName="country"
          variant="bordered"
          label="Country"
          isDisabled={pending}
          isControlled
        />
        <Input
          className={className}
          controlName="postalCode"
          variant="bordered"
          label="Postal Code"
          isDisabled={pending}
          isControlled
        />
        <NumberInput
          className={className}
          controlName="lat"
          variant="bordered"
          label="Latitude"
          isDisabled={pending}
          isControlled
          hideStepper
          isWheelDisabled
          formatOptions={{
            // 7 digits are sufficient to store coordinates with centimeter accuracy
            maximumFractionDigits: 7,
          }}
        />
        <NumberInput
          className={className}
          controlName="lon"
          variant="bordered"
          label="Longtitude"
          isDisabled={pending}
          isControlled
          hideStepper
          isWheelDisabled
          formatOptions={{
            // 7 digits are sufficient to store coordinates with centimeter accuracy
            maximumFractionDigits: 7,
          }}
        />
      </div>
    </div>
  );
};
