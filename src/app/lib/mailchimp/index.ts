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
}
