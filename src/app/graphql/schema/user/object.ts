import { builder } from '~/graphql/builder';
import { helcimSubscriptionEntryRef } from '../payment/object';
import { getSubscriptionEntry } from '../payment/util';

// const Preference = builder.objectRef<Preference>('Preference').implement({
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
      type: helcimSubscriptionEntryRef,
      nullable: true,
      resolve: async (_parent) => {
        const entry = await getSubscriptionEntry(_parent);
        return entry;
      },
    }),
    // preference: t.field({
    //   type: Preference,
    //   select: { preference: true },
    //   resolve: (entry) => entry.preference,
    // }),
  }),
});
