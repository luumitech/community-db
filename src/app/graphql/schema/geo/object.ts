import { builder } from '~/graphql/builder';

export interface GeoCoord {
  lat: number;
  lon: number;
}

export const geoCoordRef = builder.objectRef<GeoCoord>('GeoCoord').implement({
  fields: (t) => ({
    lat: t.exposeFloat('lat', { description: 'GPS Latitude' }),
    lon: t.exposeFloat('lon', { description: 'GPS Longitude' }),
  }),
});
