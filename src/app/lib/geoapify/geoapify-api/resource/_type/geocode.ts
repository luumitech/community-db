export interface GeocodeResult {
  /** Country component of the address */
  country: string;
  /** ISO 3166-1 alpha-2 country code */
  country_code: string;
  /** State component of the address */
  state: string;
  /**
   * State shortcode, the shortcode might be missing for some countries and
   * languages
   */
  state_code: string;
  /** County component of the address */
  county: string;
  /**
   * County shortcode, the shortcode might be missing for some countries and
   * languages
   */
  county_code: string;
  /** Postcode or ZIP code of the address */
  postcode: string;
  /** City component of the address */
  city: string;
  /** Street component of the address */
  street: string;
  /** House number component of an address */
  housenumber: string;
  /** Coordinates of the location */
  lon: number;
  lat: number;
  /** Display address */
  formatted: string;
  /**
   * Main part of the display address, contains building street and house number
   * or amenity name
   */
  address_line1: string;
  /**
   * The second part of the display address, contains address parts not included
   * to address_line1
   */
  address_line2: string;
  /**
   * Found location type. Can take values from [unknown, amenity, building,
   * street, suburb, district, postcode, city, county, state, country]
   */
  result_type: string;
}
