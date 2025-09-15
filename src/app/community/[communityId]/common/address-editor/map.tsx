import { useLazyQuery } from '@apollo/client';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { useFormContext } from '~/custom-hooks/hook-form';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';
import { isValidCoordinate } from '~/lib/geojson-util';
import {
  AddressSearchControl,
  GeoLocationCenter,
  LeafletMarker,
  MapCenter,
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
  /**
   * Starting to lookup address
   *
   * - Resolves when lookup completes
   */
  onStartLookup: React.TransitionStartFunction;
}

export const Map: React.FC<Props> = ({ className, onStartLookup }) => {
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
  const lon = watch('lon');

  const markerPos = React.useMemo(() => {
    const pos = { lat, lon };
    if (!isValidCoordinate(pos)) {
      return;
    }

    return { lat, lng: lon } as L.LatLng;
  }, [lat, lon]);

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
    async (locationResult: ShowLocationResult) =>
      onStartLookup(async () => {
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
      }),
    [community.id, onStartLookup, geocodeLookupAddress, setFormValue]
  );

  const onMarkerDragEnd = React.useCallback(
    async (location: L.LatLng) => {
      setFormValue('lat', location.lat);
      setFormValue('lon', location.lng);
    },
    [setFormValue]
  );

  return (
    <MapContainer className={className} zoom={15} scrollWheelZoom>
      {/** Set center to current location if GPS position is not available for property */}
      {!!markerPos ? (
        <MapCenter center={markerPos} zoom={18} />
      ) : (
        <GeoLocationCenter />
      )}
      {hasGeoapifyApiKey && (
        <AddressSearchControl
          searchLabel="Lookup address to propagate input fields"
          // Customize marker handling locally
          showMarker={false}
          onShowLocation={lookupAddress}
        />
      )}
      {!!markerPos && (
        <LeafletMarker
          position={markerPos}
          draggable
          onDragEnd={onMarkerDragEnd}
        >
          <Popup>{address}</Popup>
        </LeafletMarker>
      )}
    </MapContainer>
  );
};
