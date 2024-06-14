import { builder } from '../../builder';

// const Preference = builder.objectRef<Preference>('Preference').implement({
//   fields: (t) => ({
//     theme: t.exposeString('theme'),
//   }),
// });

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    name: t.exposeString('name', { nullable: true }),
    accessList: t.relation('accessList'),
    // preference: t.field({
    //   type: Preference,
    //   select: { preference: true },
    //   resolve: (entry) => entry.preference,
    // }),
  }),
});
