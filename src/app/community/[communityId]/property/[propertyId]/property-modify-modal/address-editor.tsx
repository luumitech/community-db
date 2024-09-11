import { useLazyQuery } from '@apollo/client';
import { Button, Divider, Input } from '@nextui-org/react';
import React from 'react';
import { Controller } from 'react-hook-form';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { InputData, useHookFormContext } from './use-hook-form';

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
  const [address, setAddress] = React.useState<string>();
  const [geocodeLookupAddress, lookupResult] =
    useLazyQuery(GeocodeLookupAddress);
  useGraphqlErrorHandler(lookupResult);
  const { setValue, control, formState } = useHookFormContext();
  const { errors } = formState;

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
        <Input
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
        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            <Input
              className={className}
              variant="bordered"
              label="Display Address"
              ref={field.ref}
              value={field.value}
              onChange={field.onChange}
              errorMessage={errors.address?.message}
              isInvalid={!!errors.address?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="streetNo"
          render={({ field }) => (
            <Input
              className={className}
              variant="bordered"
              label="Street Number"
              ref={field.ref}
              value={field.value}
              onChange={field.onChange}
              errorMessage={errors.streetNo?.message}
              isInvalid={!!errors.streetNo?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="streetName"
          render={({ field }) => (
            <Input
              className={className}
              variant="bordered"
              label="Street Name"
              ref={field.ref}
              value={field.value}
              onChange={field.onChange}
              errorMessage={errors.streetName?.message}
              isInvalid={!!errors.streetName?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="postalCode"
          render={({ field }) => (
            <Input
              className={className}
              variant="bordered"
              label="Postal Code"
              ref={field.ref}
              value={field.value}
              onChange={field.onChange}
              errorMessage={errors.postalCode?.message}
              isInvalid={!!errors.postalCode?.message}
            />
          )}
        />
      </div>
    </>
  );
};
