import { builder } from '~/graphql/builder';

interface Geocode {
  addressLine1: string | null;
  addressLine2: string | null;
  streetNo: number | null;
  streetName: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
}

export const geocodeRef = builder.objectRef<Geocode>('Geocode').implement({
  fields: (t) => ({
    addressLine1: t.exposeString('addressLine1', { nullable: true }),
    addressLine2: t.exposeString('addressLine2', { nullable: true }),
    streetNo: t.exposeInt('streetNo', { nullable: true }),
    streetName: t.exposeString('streetName', { nullable: true }),
    postalCode: t.exposeString('postalCode', { nullable: true }),
    city: t.exposeString('city', { nullable: true }),
    country: t.exposeString('country', { nullable: true }),
  }),
});
