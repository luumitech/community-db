import { createAuthClient } from 'better-auth/react';
import { env } from 'next-runtime-env';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { appPath } from '~/lib/app-path';

export const authClient = createAuthClient({
  baseURL: env('NEXT_PUBLIC_HOSTNAME'),
});

export const { useSession } = authClient;

/**
 * Sign in helper hook
 *
 * Supports various sign in methods
 */
export function useSignIn() {
  const query = useSearchParams();

  const callbackURL = query.get('callbackUrl') ?? appPath('communityWelcome');

  const signInGoogle = React.useCallback(async () => {
    return authClient.signIn.social({ provider: 'google', callbackURL });
  }, [callbackURL]);

  return { signInGoogle };
}

/**
 * Sign out helper hook
 *
 * - Goes back to home page after successful sign out
 */
export function useSignOut() {
  const router = useRouter();

  const signOut = React.useCallback(async () => {
    return authClient.signOut().then(() => {
      router.push(appPath('home'));
    });
  }, [router]);

  return signOut;
}
