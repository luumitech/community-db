import { faker } from '@faker-js/faker';
import type { GeocodeResult } from '../resource';

export function mockGeocodeResult(): GeocodeResult {
  return {
    country: faker.location.country(),
    country_code: faker.location.countryCode(),
    iso3166_2: faker.location.countryCode(),
    state: faker.location.state(),
    state_code: faker.location.state({ abbreviated: true }),
    county: faker.location.county(),
    postcode: faker.location.zipCode(),
    city: faker.location.city(),
    street: faker.location.street(),
    housenumber: faker.number.int().toString(),
    lon: faker.location.longitude(),
    lat: faker.location.latitude(),
    formatted: faker.location.streetAddress(),
    address_line1: faker.location.secondaryAddress(),
    address_line2: faker.location.secondaryAddress(),
    result_type: 'building',
  };
}
