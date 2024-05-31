import type { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { env } from '~/lib/env-cfg';

export const authOptions: AuthOptions = {
  providers: [GoogleProvider(env.google)],
};
