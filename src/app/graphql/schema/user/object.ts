import { builder } from '~/graphql/builder';
import { HelcimApi } from '~/lib/helcim-api';
import { helcimSubscriptionEntryRef } from '../payment/object';

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
        const { subscriptionId } = _parent;
        if (!subscriptionId) {
          return null;
        }
        const api = await HelcimApi.fromConfig();
        const subResult = await api.subscriptions.getSingle({ subscriptionId });
        return subResult.data;
      },
    }),
    // preference: t.field({
    //   type: Preference,
    //   select: { preference: true },
    //   resolve: (entry) => entry.preference,
    // }),
  }),
});
