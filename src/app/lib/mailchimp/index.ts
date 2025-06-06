import * as GQL from '~/graphql/generated/graphql';
import { Cipher } from '~/lib/cipher';
import { Audience, Ping, Resource } from './resource';
import { MailchimpCredential } from './resource/_type';

export class MailchimpApi {
  public ping: Ping;
  public audience: Audience;

  constructor(credential: MailchimpCredential) {
    const resource = new Resource(credential);
    this.ping = new Ping(resource);
    this.audience = new Audience(resource);
  }

  /**
   * Create Mailchimp instance by deciphering the apiKey from database
   *
   * @param apiKey Encrypted mailchip API key (from database)
   * @returns
   */
  static fromEncryptedApiKey(encryptedApiKey: string) {
    const cipher = Cipher.fromConfig();
    const apiKey = cipher.decrypt(encryptedApiKey);
    return MailchimpApi.fromApiKey(apiKey);
  }

  /**
   * Create Mailchimp instance by deciphering the apiKey from database
   *
   * @param apiKey Mailchip API key
   * @returns
   */
  static fromApiKey(apiKey: string) {
    const parts = apiKey.split('-');
    const server = apiKey.split('-').at(-1);
    if (parts.length !== 2 || !server) {
      throw new Error('Mailchimp API key is not valid');
    }
    return new MailchimpApi({ apiKey, server });
  }
}
