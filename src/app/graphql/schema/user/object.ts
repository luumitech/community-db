import { builder } from '~/graphql/builder';
import { subscriptionEntryRef } from '../payment/object';
import { getSubscriptionEntry } from '../payment/util';

// const preferenceRef = builder.objectRef<Preference>('Preference').implement({
//   fields: (t) => ({
//     theme: t.exposeString('theme'),
//   }),
// });

export const userRef = builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    name: t.exposeString('name', { nullable: true }),
    accessList: t.relation('accessList'),
    subscription: t.field({
      type: subscriptionEntryRef,
      nullable: true,
      resolve: async (entry) => {
        const subEntry = await getSubscriptionEntry(entry);
        return subEntry;
      },
    }),
    // preference: t.field({
    //   type: preferenceRef,
    //   select: { preference: true },
    //   resolve: (entry) => entry.preference,
    // }),
  }),
});
