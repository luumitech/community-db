import { useApolloClient } from '@apollo/client';
import { emailOTPClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { appPath } from '~/lib/app-path';
import { toast } from '~/view/base/toastify';

export const authClient = createAuthClient({
  // By default, reads process.env.BETTER_AUTH_URL
  // baseURL: env('BETTER_AUTH_URL'),
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
  const client = useApolloClient();

  const signOut = React.useCallback(async () => {
    const resp = await authClient.signOut();
    // Clear graphQL cache upon logout
    await client.clearStore();
    router.push(appPath('home'));
  }, [router, client]);

  return signOut;
}

/**
 * Remove user account
 *
 * - Goes back to home page after deletion
 */
export function useDeleteAccount() {
  const router = useRouter();

  const deleteAccount = React.useCallback(async () => {
    /**
     * Deletion pre-check and cleanup logic are defined in
     * `src/app/api/auth/[...better]/auth.ts`
     *
     * See: better-auth configuration object `user.deleteUser`
     */
    const resp = await authClient.deleteUser();
    const { error } = resp;
    if (error) {
      toast.error(
        <p className="whitespace-pre-line">
          {error.message ?? error.statusText}
        </p>
      );
      return;
    }

    router.push(appPath('home'));
  }, [router]);

  return deleteAccount;
}
