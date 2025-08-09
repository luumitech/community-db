'use client';
import { useLazyQuery } from '@apollo/client';
import { Link, cn } from '@heroui/react';
import React from 'react';
import { Popup } from 'react-leaflet';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { useFormContext } from '~/custom-hooks/hook-form';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';
import { appLabel, appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { Input } from '~/view/base/input';
import {
  AddressSearchControl,
  GeoLocationCenter,
  LeafletMarker,
  MapContainer,
  type ShowLocationResult,
} from '~/view/base/leaflet';
import { NumberInput } from '~/view/base/number-input';

interface InputData {
  address: string;
  streetNo: number | null;
  streetName: string;
  postalCode: string;
  city: string;
  country: string;
  lat: number | null;
  lon: number | null;
}

const GeocodeLookupAddress = graphql(/* GraphQL */ `
  query geocodeFromText($input: GeocodeFromTextInput!) {
    geocodeFromText(input: $input) {
      addressLine1
      addressLine2
      streetNo
      streetName
      postalCode
      city
      country
    }
  }
`);

interface Props {
  className?: string;
}

export const AddressEditor: React.FC<Props> = ({ className }) => {
  const { community, hasGeoapifyApiKey } = useLayoutContext();
  const { setValue, watch } = useFormContext<InputData>();
  const [geocodeLookupAddress] = useLazyQuery(GeocodeLookupAddress, {
    onError,
  });
  const address = watch('address');
  const lat = watch('lat');
  const lng = watch('lon');

  const setFormValue = React.useCallback(
    (name: keyof InputData, value?: string | number | null) => {
      setValue(name, value ?? '', {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue]
  );

  const lookupAddress = React.useCallback(
    async (locationResult: ShowLocationResult) => {
      const address = locationResult.label.trim();
      if (!address) {
        return;
      }

      setFormValue('lat', locationResult.y);
      setFormValue('lon', locationResult.x);

      const result = await geocodeLookupAddress({
        variables: {
          input: { communityId: community.id, text: address },
        },
      });
      const output = result.data?.geocodeFromText;
      if (output) {
        setFormValue('address', output.addressLine1);
        setFormValue('streetNo', output.streetNo);
        setFormValue('streetName', output.streetName);
        setFormValue('postalCode', output.postalCode);
        setFormValue('city', output.city);
        setFormValue('country', output.country);
      }
    },
    [community.id, geocodeLookupAddress, setFormValue]
  );

  const onMarkerDragEnd = React.useCallback(
    async (location: L.LatLng) => {
      setFormValue('lat', location.lat);
      setFormValue('lon', location.lng);
    },
    [setFormValue]
  );

  const CustomMarker = React.useCallback(() => {
    if (lat == null || lng == null) {
      return null;
    }
    return (
      <LeafletMarker
        position={{ lat, lng }}
        draggable
        onDragEnd={onMarkerDragEnd}
      >
        <Popup>{address}</Popup>
      </LeafletMarker>
    );
  }, [lat, lng, address]);

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
              target="_blank"
            >
              {appLabel('thirdPartyIntegration')}{' '}
              <Icon className="ml-1" icon="externalLink" />
            </Link>{' '}
            settings.
          </p>
        )}
        <MapContainer
          className="h-full min-h-[300px]"
          zoom={15}
          scrollWheelZoom
        >
          <GeoLocationCenter />
          {hasGeoapifyApiKey && (
            <AddressSearchControl
              searchLabel="Lookup address to propagate input fields"
              // Customize marker handling locally
              showMarker={false}
              onShowLocation={lookupAddress}
            />
          )}
          <CustomMarker />
        </MapContainer>
      </div>
      <div className="flex flex-col grow gap-2">
        <Input
          className={className}
          controlName="address"
          variant="bordered"
          label="Display Address"
          isControlled
        />
        <Input
          className={className}
          controlName="streetNo"
          variant="bordered"
          label="Street Number"
          isControlled
        />
        <Input
          className={className}
          controlName="streetName"
          variant="bordered"
          label="Street Name"
          isControlled
        />
        <Input
          className={className}
          controlName="city"
          variant="bordered"
          label="City"
          isControlled
        />
        <Input
          className={className}
          controlName="country"
          variant="bordered"
          label="Country"
          isControlled
        />
        <Input
          className={className}
          controlName="postalCode"
          variant="bordered"
          label="Postal Code"
          isControlled
        />
        <NumberInput
          className={className}
          controlName="lat"
          variant="bordered"
          label="Latitude"
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
