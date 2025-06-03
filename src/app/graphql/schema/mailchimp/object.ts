import { builder } from '~/graphql/builder';

interface MailchimpMember {
  email: string;
  fullName: string | null;
  status: string;
}

export const mailchimpMemberRef = builder
  .objectRef<MailchimpMember>('MailchimpMember')
  .implement({
    fields: (t) => ({
      email: t.exposeString('email'),
      fullName: t.exposeString('fullName', { nullable: true }),
      status: t.exposeString('status'),
    }),
  });

interface MailchimpAudience {
  name: string;
  listId: string;
}

export const mailchimpAudienceRef = builder
  .objectRef<MailchimpAudience>('MailchimpAudience')
  .implement({
    fields: (t) => ({
      name: t.exposeString('name'),
      listId: t.exposeString('listId'),
    }),
  });
