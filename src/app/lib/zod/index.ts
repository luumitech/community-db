import { z, type CustomErrorParams } from 'zod';
export { z } from 'zod';

/**
 * Coerce string ('true') to boolean:
 *
 * - Only 'true' returns truthy,
 * - All other string will return false
 */
export function zStrToBoolean() {
  return z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true');
}

/** Verify that string is non empty */
export function zNonEmptyStr(message?: CustomErrorParams) {
  return z.string().trim().min(1, message);
}
