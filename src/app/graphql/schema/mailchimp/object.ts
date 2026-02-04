import { builder } from '~/graphql/builder';
import { MailchimpSubscriberStatusValues } from '~/lib/mailchimp/resource/_type';
import type { MemberEntry } from '~/lib/mailchimp/resource/audience';

export const mailchimpSubscriberStatusRef = builder.enumType(
  'MailchimpSubscriberStatus',
  { values: Object.values(MailchimpSubscriberStatusValues) }
);

export const mailchimpMemberRef = builder
  .objectRef<MemberEntry>('MailchimpMember')
  .implement({
    fields: (t) => ({
      id: t.exposeString('id'),
      email_address: t.exposeString('email_address'),
      full_name: t.exposeString('full_name', { nullable: true }),
      status: t.field({
        description: 'Mailchimp subscriber status',
        type: mailchimpSubscriberStatusRef,
        resolve: (entry) => entry.status,
      }),
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
