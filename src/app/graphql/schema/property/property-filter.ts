import { builder } from '~/graphql/builder';

export const PropertyFilterInput = builder.inputType('PropertyFilterInput', {
  fields: (t) => ({
    searchText: t.string({
      description: 'Match against property address/first name/last name',
    }),
    memberYearList: t.field({
      description: 'Only properties that are member of the given year(s)',
      type: ['Int'],
    }),
    nonMemberYearList: t.field({
      description: 'Only properties that are NOT member of the given year(s)',
      type: ['Int'],
    }),
    membershipFeeEvent: t.field({
      description: 'Only properties that paid membership at the given event',
      type: 'String',
    }),
    memberEventList: t.field({
      description: 'Only properties that attended the given event(s)',
      type: ['String'],
    }),
    ticketList: t.field({
      description: 'Only properties that purchased the given ticket(s)',
      type: ['String'],
    }),
    withGps: t.boolean({
      description:
        'If true, properties with GPS.  If false, properties without GPS',
    }),
    emailList: t.field({
      description: 'Only properties with occupants with given email',
      type: ['String'],
    }),
  }),
});
