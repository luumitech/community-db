import { Resource, type CallArg } from './resource';

export class General {
  constructor(private res: Resource) {}

  private async call(path: string, method: string, arg?: CallArg) {
    const url = `/v2${path}`;
    return this.res.call(url, method, arg);
  }

  async connectionTest() {
    return this.call('/connection-test', 'GET');
  }
}
