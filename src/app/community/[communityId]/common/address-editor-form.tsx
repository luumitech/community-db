import { useLazyQuery } from '@apollo/client';
import { Button, Divider, Input as NInput } from '@nextui-org/react';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { useFormContext } from '~/custom-hooks/hook-form';
import { graphql } from '~/graphql/generated';
import { Input } from '~/view/base/input';

interface InputData {
  address: string;
  streetNo: string;
  streetName: string;
  postalCode: string;
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

export const AddressEditorForm: React.FC<Props> = ({ className }) => {
  const { setValue } = useFormContext<InputData>();
  const [address, setAddress] = React.useState<string>();
  const [geocodeLookupAddress, lookupResult] =
    useLazyQuery(GeocodeLookupAddress);
  useGraphqlErrorHandler(lookupResult);

  const lookupAddress = React.useCallback(async () => {
    if (address) {
      const result = await geocodeLookupAddress({
        variables: { input: { text: address } },
      });
      const output = result.data?.geocodeFromText;
      if (output) {
        const setFormValue = (name: keyof InputData, value?: string | null) => {
          setValue(name, value ?? '', {
            shouldDirty: true,
            shouldValidate: true,
          });
        };

        setFormValue('address', output.addressLine1);
        setFormValue('streetNo', output.streetNo);
        setFormValue('streetName', output.streetName);
        setFormValue('postalCode', output.postalCode);
      }
    }
  }, [address, geocodeLookupAddress, setValue]);

  return (
    <>
      Enter full mailing address to propagate the fields automatically:
      <div className="flex flex-col gap-2 mx-4">
        <NInput
          className={className}
          variant="bordered"
          label="Mailing Address"
          placeholder="i.e. 6587 Roller Derby Lane"
          onChange={(evt) => setAddress(evt.currentTarget.value)}
          endContent={
            <Button
              onClick={lookupAddress}
              isLoading={lookupResult.loading}
              isDisabled={!address}
            >
              Lookup
            </Button>
          }
        />
      </div>
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
          controlName="postalCode"
          variant="bordered"
          label="Postal Code"
          isControlled
        />
      </div>
    </>
  );
};
