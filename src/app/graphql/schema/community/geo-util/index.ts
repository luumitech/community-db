import { Community, Property } from '@prisma/client';
import type { GeoCoord } from '~/graphql/schema/geo/object';
import { parseAsNumber } from '~/lib/number-util';
import { hullBoundary } from './hull-boundary';

export class GeoUtil {
  #propertiesLoc: GeoCoord[] = [];

  constructor(
    community: Community,
    propertyList: Pick<Property, 'id' | 'lat' | 'lon'>[]
  ) {
    propertyList.forEach((entry) => {
      const lat = parseAsNumber(entry.lat);
      const lon = parseAsNumber(entry.lon);
      if (lat != null && lon != null) {
        this.#propertiesLoc.push({ lat, lon });
      }
    });
  }

  hullBoundary() {
    return hullBoundary(this.#propertiesLoc);
  }
}
