export interface GeocodeResult {
  /**
   * Country component of the address
   *
   * I.e. 'Canada'
   */
  country: string;
  /**
   * ISO 3166-1 country code
   *
   * I.e. 'ca'
   */
  country_code: string;
  /**
   * ISO 3166-1 alpha-2 country code
   *
   * I.e. 'CA-ON'
   */
  iso3166_2: string;
  /**
   * State component of the address
   *
   * I.e. 'Ontario'
   */
  state: string;
  /**
   * State shortcode, the shortcode might be missing for some countries and
   * languages
   *
   * I.e. 'ON'
   */
  state_code: string;
  /**
   * County component of the address
   *
   * I.e. 'York Region'
   */
  county: string;
  /**
   * County shortcode, the shortcode might be missing for some countries and
   * languages
   */
  county_code?: string;
  /**
   * State district
   *
   * I.e. 'Golden Horseshoe'
   */
  state_district?: string;
  /**
   * District
   *
   * I.e. 'Box Grove'
   */
  district?: string;
  /** Postcode or ZIP code of the address */
  postcode: string;
  /**
   * City component of the address
   *
   * I.e. 'Markham'
   */
  city: string;
  /** Street component of the address */
  street: string;
  /** House number component of an address */
  housenumber: string;
  /** Coordinates of the location */
  lon: number;
  lat: number;
  /** Fully formatted address for display purpose */
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
