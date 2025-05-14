import { builder } from '~/graphql/builder';

interface MailchimpMember {
  email: string;
  fullName: string | null;
}

export const mailchimpMemberRef = builder
  .objectRef<MailchimpMember>('MailchimpMember')
  .implement({
    fields: (t) => ({
      email: t.exposeString('email'),
      fullName: t.exposeString('fullName', { nullable: true }),
    }),
  });
