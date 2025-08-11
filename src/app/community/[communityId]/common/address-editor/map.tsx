import { useLazyQuery } from '@apollo/client';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { useFormContext } from '~/custom-hooks/hook-form';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';
import {
  AddressSearchControl,
  GeoLocationCenter,
  LeafletMarker,
  MapContainer,
  useMapContext,
  type ShowLocationResult,
} from '~/view/base/map';
import { type InputData } from './_type';

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

export const Map: React.FC<Props> = ({ className }) => {
  const { community, hasGeoapifyApiKey } = useLayoutContext();
  const { watch, setValue } = useFormContext<InputData>();
  const {
    reactLeaflet: { Popup },
  } = useMapContext();
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
      const addr = locationResult.label.trim();
      if (!addr) {
        return;
      }

      setFormValue('lat', locationResult.y);
      setFormValue('lon', locationResult.x);

      const result = await geocodeLookupAddress({
        variables: {
          input: { communityId: community.id, text: addr },
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
  }, [Popup, lat, lng, address, onMarkerDragEnd]);

  return (
    <MapContainer className={className} zoom={15} scrollWheelZoom>
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
  );
};
