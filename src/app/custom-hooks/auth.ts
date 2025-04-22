import { emailOTPClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { env } from 'next-runtime-env';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { appPath } from '~/lib/app-path';
import { isProduction } from '~/lib/env-var';

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

  const callbackURL = query.get('callbackUrl') ?? appPath('communityWelcome');

  /** Sign in as developer (internal use only) */
  const signInDev = React.useCallback(async () => {
    // Only available in development mode
    if (isProduction()) {
      return;
    }
    await authClient.signUp.email({
      name: 'Dev User',
      email: 'dev@email.com',
      password: 'password1234',
    });
    return authClient.signIn.email({
      email: 'dev@email.com',
      password: 'password1234',
      callbackURL,
    });
  }, [callbackURL]);

  const signInGoogle = React.useCallback(async () => {
    return authClient.signIn.social({ provider: 'google', callbackURL });
  }, [callbackURL]);

  const signInEmailOTP = React.useCallback(async () => {
    return authClient.emailOtp.sendVerificationOtp({
      email: 'user-email@email.com',
      type: 'sign-in',
    });
  }, [callbackURL]);

  return { signInGoogle, signInDev };
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
