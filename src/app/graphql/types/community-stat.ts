import { builder } from '../builder';

/**
 * Statistic for one address
 */
export interface PropertyStat {
  /**
   * membership year associated to this entry
   */
  year: number;
  /**
   * event name where this address pays membership
   */
  joinEvent: string;
  /**
   * Other events this address participated in
   */
  otherEvents: string[];
  /**
   * Was this address also a member last year?
   */
  renew: boolean;
}

/**
 * Statistic for the community
 */
export interface CommunityStat {
  /**
   * Minimum year represented in PropertyStat
   */
  minYear: number;
  /**
   * Minimum year represented in PropertyStat
   */
  maxYear: number;
  /**
   * List of property stats for this community
   */
  propertyStat: PropertyStat[];
}

const propertyStatRef = builder
  .objectRef<PropertyStat>('PropertyStat')
  .implement({
    fields: (t) => ({
      year: t.exposeInt('year'),
      joinEvent: t.exposeString('joinEvent'),
      otherEvents: t.exposeStringList('otherEvents'),
      renew: t.exposeBoolean('renew'),
    }),
  });

export const communityStatRef = builder
  .objectRef<CommunityStat>('CommunityStat')
  .implement({
    fields: (t) => ({
      minYear: t.exposeInt('minYear'),
      maxYear: t.exposeInt('maxYear'),
      propertyStat: t.field({
        type: [propertyStatRef],
        resolve: (entry) => entry.propertyStat,
      }),
    }),
  });
