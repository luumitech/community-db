import { builder } from '~/graphql/builder';
import { GeoapifyApi } from '~/lib/geoapify-api';
import { parseAsNumber } from '~/lib/number-util';
import { geocodeRef } from './object';

const GeocodeFromTextInput = builder.inputType('GeocodeFromTextInput', {
  fields: (t) => ({
    text: t.string({ required: true }),
  }),
});

builder.queryField('geocodeFromText', (t) =>
  t.field({
    type: geocodeRef,
    args: {
      input: t.arg({ type: GeocodeFromTextInput, required: true }),
    },
    resolve: async (parent, args, ctx) => {
      const { text } = args.input;
      const api = await GeoapifyApi.fromConfig();
      const result = await api.geocode.searchFreeForm(text);
      return {
        addressLine1: result.address_line1,
        addressLine2: result.address_line2,
        streetNo: parseAsNumber(result.housenumber),
        streetName: result.street,
        postalCode: result.postcode,
        city: result.city,
        country: result.country,
      };
    },
  })
);
