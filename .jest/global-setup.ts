import { MongoMemoryReplSet } from 'mongodb-memory-server';

const DB_NAME = 'test-community-db';

export default async function globalSetup() {
  /**
   * Prisma needs to perform transactions, which requires your
   * MongoDB server to be run as a replica set. https://pris.ly/d/mongodb-replica-set
   */
  const instance = await MongoMemoryReplSet.create({
    replSet: {
      count: 1,
      storageEngine: 'wiredTiger',
    },
  });
  const uri = instance.getUri(DB_NAME);
  (global as any).__MONGOINSTANCE = instance;
  process.env.DATABASE_URL = uri;
}
