import { builder } from '~/graphql/builder';
import { getGeoapifyApi } from '~/graphql/schema/geocode/util';
import { parseAsNumber } from '~/lib/number-util';
import { geocodeRef } from './object';

const GeocodeFromTextInput = builder.inputType('GeocodeFromTextInput', {
  fields: (t) => ({
    communityId: t.string({
      description: 'community short ID',
      required: true,
    }),
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
      const { user } = ctx;
      const { text, communityId } = args.input;
      const api = await getGeoapifyApi(user, communityId);
      const result = await api.forwardGeocode.searchFreeForm(text);

      return {
        addressLine1: result.address_line1,
        addressLine2: result.address_line2,
        streetNo: parseAsNumber(result.housenumber),
        streetName: result.street,
        postalCode: result.postcode,
        city: result.city,
        country: result.country,
        lat: parseAsNumber(result.lat),
        lon: parseAsNumber(result.lon),
      };
    },
  })
);
