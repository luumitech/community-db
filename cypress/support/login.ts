import hkdf from '@panva/hkdf';
import { EncryptJWT, JWTPayload } from 'jose';

/**
 * Function logic derived from
 * https://github.com/nextauthjs/next-auth/blob/5c1826a8d1f8d8c2d26959d12375704b0a693bfc/packages/next-auth/src/jwt/index.ts#L113-L121
 */
async function getDerivedEncryptionKey(secret: string) {
  return await hkdf(
    'sha256',
    secret,
    '',
    'NextAuth.js Generated Encryption Key',
    32
  );
}

/**
 * Function logic derived from
 * https://github.com/nextauthjs/next-auth/blob/5c1826a8d1f8d8c2d26959d12375704b0a693bfc/packages/next-auth/src/jwt/index.ts#L16-L25
 */
async function encode(token: JWTPayload, secret: string) {
  const maxAge = 1 * 24 * 60 * 60; // 1 day
  const encryptionSecret = await getDerivedEncryptionKey(secret);
  const sessionToken = new EncryptJWT(token)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(Math.round(Date.now() / 1000 + maxAge))
    .setJti('test')
    .encrypt(encryptionSecret);
  return sessionToken;
}

/** Create session token to simulate the action of user logging in */
Cypress.Commands.add('login', () => {
  // Set theme to light theme
  window.localStorage.setItem('theme', 'light');
  cy.wrap(null)
    .then(() =>
      encode(
        Cypress.env('NEXTAUTH_SESSION_USER'),
        Cypress.env('NEXTAUTH_SECRET')
      )
    )
    .then((sessionToken) => {
      cy.setCookie('next-auth.session-token', sessionToken);
    });
});
