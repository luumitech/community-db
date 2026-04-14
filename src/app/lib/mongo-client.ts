import { MongoClient } from 'mongodb';
import { env } from '~/lib/env/server-env';
import { appGlobal } from '~/lib/global';

const mongoClient =
  appGlobal.mongoClient ?? new MongoClient(env('MONGODB_URI'));
appGlobal.mongoClient ??= mongoClient;

export default mongoClient;
