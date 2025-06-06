export interface MailchimpCredential {
  /** Mailchimp server to route to. For example, `'us10'`. */
  server: string;
  /** API key for your Mailchimp marketing account. */
  apiKey: string;
}

/**
 * Mailchimp subscriber's status
 *
 * - Subscribed: These are individuals who have opted in to receive your email
 *   marketing campaigns.
 * - Unsubscribed: These are individuals who previously opted in but have since
 *   opted out.
 * - Cleaned: These are non-deliverable email addresses, either due to hard
 *   bounces (permanent failure) or repeated soft bounces (temporary failure).
 * - Pending: These are email addresses that are waiting for confirmation or
 *   haven't been fully verified.
 * - Transactional: These are individuals who have interacted with your online
 *   store or provided contact information but haven't opted in to receive email
 *   marketing campaigns.
 * - Archived: These are contacts that have been moved to a separate archived
 *   contacts table, effectively removing them from the main list.
 */
export type MailchimpSubscriberStatus =
  | 'subscribed'
  | 'unsubscribed'
  | 'cleaned'
  | 'pending'
  | 'transactional'
  | 'archive';
