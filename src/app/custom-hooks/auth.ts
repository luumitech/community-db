import { createAuthClient } from 'better-auth/react';
import { env } from 'next-runtime-env';

export const authClient = createAuthClient({
  baseURL: env('NEXT_PUBLIC_HOSTNAME'),
});

export const { signIn, signOut, useSession } = authClient;
