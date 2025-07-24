import { useLazyQuery } from '@apollo/client';
import { Button, Divider, Link, Input as NInput } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { useFormContext } from '~/custom-hooks/hook-form';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';
import { appLabel, appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { Input } from '~/view/base/input';
import { NumberInput } from '~/view/base/number-input';

interface InputData {
  address: string;
  streetNo: number;
  streetName: string;
  postalCode: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
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
      lat
      lon
    }
  }
`);

interface Props {
  className?: string;
}

export const AddressEditorForm: React.FC<Props> = ({ className }) => {
  const { community, hasGeoapifyApiKey } = useLayoutContext();
  const { setValue } = useFormContext<InputData>();
  const [address, setAddress] = React.useState<string>();
  const [geocodeLookupAddress, lookupResult] = useLazyQuery(
    GeocodeLookupAddress,
    { onError }
  );

  const lookupAddress = React.useCallback(async () => {
    if (address) {
      const result = await geocodeLookupAddress({
        variables: {
          input: { communityId: community.id, text: address },
        },
      });
      const output = result.data?.geocodeFromText;
      if (output) {
        const setFormValue = (
          name: keyof InputData,
          value?: string | number | null
        ) => {
          setValue(name, value ?? '', {
            shouldDirty: true,
            shouldValidate: true,
          });
        };

        setFormValue('address', output.addressLine1);
        setFormValue('streetNo', output.streetNo);
        setFormValue('streetName', output.streetName);
        setFormValue('postalCode', output.postalCode);
        setFormValue('city', output.city);
        setFormValue('country', output.country);
        setFormValue('lat', output.lat);
        setFormValue('lon', output.lon);
      }
    }
  }, [community.id, address, geocodeLookupAddress, setValue]);

  return (
    <>
      Enter full mailing address to propagate the fields automatically:
      <div className="flex flex-col gap-2 mx-4">
        <NInput
          className={className}
          variant="bordered"
          label="Mailing Address"
          placeholder="eg. 6587 Roller Derby Lane, Springfeld, USA"
          onChange={(evt) => setAddress(evt.currentTarget.value)}
          isDisabled={!hasGeoapifyApiKey}
          endContent={
            <Button
              onPress={lookupAddress}
              isLoading={lookupResult.loading}
              isDisabled={!address}
            >
              Lookup
            </Button>
          }
        />
      </div>
      {!hasGeoapifyApiKey && (
        <p className="text-warning text-sm">
          Address lookup requires a valid Geoapify API key. To enable this
          feature, please enter your API key in the{' '}
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
      <div className="flex items-center gap-4">
        <Divider className="w-auto grow" />
        or
        <Divider className="w-auto grow" />
      </div>
      Enter the fields manually:
      <div className="flex flex-col gap-2 mx-4">
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
    </>
  );
};
