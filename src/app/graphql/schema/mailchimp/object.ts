import type { Property } from '@prisma/client';
import { builder } from '~/graphql/builder';
import { type MailchimpSubscriberStatus } from '~/lib/mailchimp/resource/_type';
import { propertyRef } from '../property/object';

const mailchimpSubscriberStatusRef = builder.enumType(
  'MailchimpSubscriberStatus',
  {
    values: [
      'subscribed',
      'unsubscribed',
      'cleaned',
      'pending',
      'transactional',
      'archive',
    ] as const,
  }
);

interface MailchimpMember {
  email: string;
  fullName: string | null;
  status: MailchimpSubscriberStatus;
  /**
   * Email exists in community database, and this is the property containing the
   * email
   */
  property: Property | null;
}

export const mailchimpMemberRef = builder
  .objectRef<MailchimpMember>('MailchimpMember')
  .implement({
    fields: (t) => ({
      email: t.exposeString('email'),
      fullName: t.exposeString('fullName', { nullable: true }),
      status: t.field({
        description: 'Mailchimp subscriber status',
        type: mailchimpSubscriberStatusRef,
        resolve: (entry) => entry.status,
      }),
      property: t.field({
        description: 'Property containing member with the same email',
        type: propertyRef,
        nullable: true,
        resolve: (entry) => entry.property,
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
