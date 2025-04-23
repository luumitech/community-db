import { emailOTPClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { env } from 'next-runtime-env';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { appPath } from '~/lib/app-path';

export const authClient = createAuthClient({
  baseURL: env('NEXT_PUBLIC_HOSTNAME'),
  plugins: [
    /**
     * The Email OTP plugin allows user to sign in, verify their email, or reset
     * their password using a one-time password (OTP) sent to their email
     * address.
     *
     * See: https://www.better-auth.com/docs/plugins/email-otp
     */
    emailOTPClient(),
  ],
});

export const { useSession } = authClient;

/**
 * Sign in helper hook
 *
 * Supports various sign in methods
 */
export function useSignIn() {
  const query = useSearchParams();
  const { signIn, signUp } = authClient;

  const callbackURL = React.useMemo(() => {
    const currentURL = query.get('callbackUrl');
    if (!currentURL || currentURL === appPath('home')) {
      return appPath('communityWelcome');
    }
    return currentURL;
  }, [query]);

  return { signIn, signUp, callbackURL };
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
